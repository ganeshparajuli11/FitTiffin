/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Meal {
  name: string;
  description: string;
  items: string[];
}

export interface DayPlan {
  day: number;
  focus: string;
  tip: string;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  isSaturdaySpecial?: boolean;
}

export interface UserProfile {
  name: string;
  age: number;
  height: string; // e.g. "5'8"
  currentWeight: number;
  goalWeight: number;
  startDate: string; // ISO string
  waterGoal: number; // glasses
  walkGoal: number; // steps
  isSaturdayHoliday: boolean;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  waterGlasses: number;
  habits: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
    walk: boolean;
    noJunk: boolean;
    noSugarDrinks: boolean;
    sleepOnTime: boolean;
  };
  weight?: number;
}
