/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { google } from "googleapis";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

// Google OAuth Setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.APP_URL}/auth/callback`
);

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Google Fit OAuth URL
app.get("/api/auth/google/url", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/fitness.activity.read",
      "https://www.googleapis.com/auth/fitness.body.read",
    ],
    prompt: "consent"
  });
  res.json({ url });
});

// Callback handler
app.get("/auth/callback", async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code as string);
    // In a real app, store this in a database. 
    // For this demo, we'll send a success message to the browser.
    
    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'GOOGLE_FIT_SUCCESS', tokens: ${JSON.stringify(tokens)} }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>FitTiffin: Authentication successful! This window will close.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("OAuth Error:", error);
    res.status(500).send("Authentication failed");
  }
});

// Fetch Real Steps (Simplified simulation with API call structure)
app.post("/api/fitness/steps", async (req, res) => {
  const { tokens } = req.body;
  if (!tokens) return res.status(401).json({ error: "Missing tokens" });

  try {
    oauth2Client.setCredentials(tokens);
    const fitness = google.fitness({ version: "v1", auth: oauth2Client });
    
    // Get steps for the last 24 hours
    const now = new Date();
    const startTimeMillis = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime();
    const endTimeMillis = now.getTime();

    const response = await fitness.users.dataset.aggregate({
      userId: "me",
      requestBody: {
        aggregateBy: [{ dataSourceId: "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps" }],
        bucketByTime: { durationMillis: (endTimeMillis - startTimeMillis).toString() },
        startTimeMillis: startTimeMillis.toString(),
        endTimeMillis: endTimeMillis.toString(),
      },
    });

    const buckets = response.data.bucket;
    let steps = 0;
    if (buckets && buckets.length > 0) {
      const dataset = buckets[0].dataset;
      if (dataset && dataset[0].point) {
        steps = dataset[0].point[0].value![0].intVal || 0;
      }
    }

    res.json({ steps });
  } catch (error) {
    console.error("Fitness API Error:", error);
    res.status(500).json({ error: "Failed to fetch steps" });
  }
});

async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FitTiffin Server running on http://localhost:${PORT}`);
  });
}

startServer();
