/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { differenceInCalendarDays, format, parseISO } from 'date-fns';
import { UserProfile, DailyLog } from '../types';

const STORAGE_KEY_PROFILE = 'fittiffin_profile';
const STORAGE_KEY_LOGS = 'fittiffin_logs';
const STORAGE_KEY_TOKENS = 'fittiffin_google_tokens';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Warrior',
  age: 23,
  height: "5'8\"",
  currentWeight: 75,
  goalWeight: 63,
  startDate: new Date().toISOString(),
  waterGoal: 10,
  walkGoal: 8000,
  isSaturdayHoliday: true,
};

export function useFitTiffin() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [logs, setLogs] = useState<Record<string, DailyLog>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LOGS);
    return saved ? JSON.parse(saved) : {};
  });

  const [tokens, setTokens] = useState<any>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TOKENS);
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    if (tokens) {
      localStorage.setItem(STORAGE_KEY_TOKENS, JSON.stringify(tokens));
    }
  }, [tokens]);

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const currentDayNumber = differenceInCalendarDays(new Date(), parseISO(profile.startDate)) + 1;
  const isSaturday = new Date().getDay() === 6;

  // Real-time synchronization for steps if connected
  useEffect(() => {
    if (tokens) {
      const syncSteps = async () => {
        try {
          const res = await fetch('/api/fitness/steps', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tokens })
          });
          const data = await res.json();
          if (data.steps !== undefined) {
             updateTodayLog(log => ({
                ...log,
                habits: { ...log.habits, walk: data.steps >= profile.walkGoal }
             }));
          }
        } catch (e) {
          console.error("Step sync failed", e);
        }
      };
      syncSteps();
      const interval = setInterval(syncSteps, 120000); // sync every 2 mins
      return () => clearInterval(interval);
    }
  }, [tokens, profile.walkGoal]);

  const getLogForDate = (date: string): DailyLog => {
    return logs[date] || {
      date,
      waterGlasses: 0,
      habits: {
        breakfast: false,
        lunch: false,
        dinner: false,
        walk: false,
        noJunk: false,
        noSugarDrinks: false,
        sleepOnTime: false,
      }
    };
  };

  const updateTodayLog = (updater: (log: DailyLog) => DailyLog) => {
    setLogs(prev => {
      const current = getLogForDate(todayStr);
      return { ...prev, [todayStr]: updater(current) };
    });
  };

  const addWater = () => {
    updateTodayLog(log => ({ ...log, waterGlasses: Math.min(log.waterGlasses + 1, 20) }));
  };

  const toggleHabit = (habitId: keyof DailyLog['habits']) => {
    updateTodayLog(log => ({
      ...log,
      habits: { ...log.habits, [habitId]: !log.habits[habitId] }
    }));
  };

  const updateWeight = (weight: number) => {
    updateTodayLog(log => ({ ...log, weight }));
  };

  const resetCycle = () => {
    setProfile(prev => ({ ...prev, startDate: new Date().toISOString() }));
    // Optionally keep logs or clear them. Usually cycle reset means new start date.
  };

  return {
    profile,
    setProfile,
    logs,
    todayLog: getLogForDate(todayStr),
    currentDayNumber,
    isSaturday,
    addWater,
    toggleHabit,
    updateWeight,
    resetCycle,
    tokens,
    setTokens,
  };
}
