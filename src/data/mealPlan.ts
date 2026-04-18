/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DayPlan } from '../types';

const basePlan: DayPlan[] = [
  {
    day: 1,
    focus: "Start Strong",
    tip: "Consistency is better than perfection. Just focus on today.",
    breakfast: {
      name: "Protein Start",
      description: "Simple and filling",
      items: ["2 Boiled Eggs", "1 Apple", "Black Coffee/Tea (No Sugar)"]
    },
    lunch: {
      name: "Classic Tiffin",
      description: "Easy to pack",
      items: ["2 Roti", "Mixed Veg Sabji", "Sliced Cucumber & Carrots"]
    },
    dinner: {
      name: "Light & Lean",
      description: "Early dinner",
      items: ["Yellow Dal (Lentils)", "Small cup of Rice", "Green Salad"]
    }
  },
  {
    day: 2,
    focus: "Hydration Focus",
    tip: "Drink a glass of water before each meal to feel fuller.",
    breakfast: {
      name: "Oatmeal Bowl",
      description: "Slow-release energy",
      items: ["Oats with milk/curd", "Handful of peanuts", "1 Banana"]
    },
    lunch: {
      name: "High Protein Tiffin",
      description: "Sustainable energy",
      items: ["Chicken Curry (less oil)", "2 Roti", "Yogurt/Curd"]
    },
    dinner: {
      name: "Paneer Stir-fry",
      description: "Vegetarian protein",
      items: ["Paneer with Capsicum", "1 Roti", "Clear Soup"]
    }
  },
  {
    day: 3,
    focus: "Office Movement",
    tip: "Take a 5-minute walk after your lunch tiffin.",
    breakfast: {
      name: "Savory Pancakes",
      description: "Quick Besan Chilla",
      items: ["2 Besan Chilla", "Tomato Chutney", "Herbal Tea"]
    },
    lunch: {
      name: "Dal-Chawal Tiffin",
      description: "Traditional comfort",
      items: ["Dal", "Brown Rice (or small portion white)", "Alu-Bhanda (Dry Veg)"]
    },
    dinner: {
      name: "Egg Curry",
      description: "Low carb option",
      items: ["2 Egg Curry", "Large Bowl of Salad", "No Roti/Rice"]
    }
  },
  {
    day: 4,
    focus: "Sugar Watch",
    tip: "Avoid sugary drinks. Stick to plain water or green tea.",
    breakfast: {
      name: "Egg Bhurji",
      description: "Spiced scrambled eggs",
      items: ["Scrambled Eggs (2)", "1 Slice Whole Wheat Bread", "Orange Juice (Fresh)"]
    },
    lunch: {
      name: "Roti-Paneer Tiffin",
      description: "Satisfying office lunch",
      items: ["2 Roti", "Paneer Sabji", "Onion & Cucumber"]
    },
    dinner: {
      name: "Mixed Veg Soup",
      description: "Ultra light night",
      items: ["Large bowl of Vegetable Soup", "1 Boiled Egg", "Apple"]
    }
  },
  {
    day: 5,
    focus: "Portion Control",
    tip: "Use a smaller tiffin box to control your portions automatically.",
    breakfast: {
      name: "Sprouted Salad",
      description: "Rich in fiber",
      items: ["Moong Sprouts", "Lemon & Ginger", "1 Hard Boiled Egg"]
    },
    lunch: {
      name: "Chicken Roti Wrap",
      description: "Fun office lunch",
      items: ["2 Roti wraps with Chicken & Veg", "Mint Chutney"]
    },
    dinner: {
      name: "Lentil Soup",
      description: "Protein rich",
      items: ["Dal Tadka", "Steamed Cabbage", "Curd"]
    }
  },
  {
    day: 6,
    focus: "Saturday Reset",
    tip: "Use today to plan your groceries for next week.",
    isSaturdaySpecial: true,
    breakfast: {
      name: "Holiday Special",
      description: "Refined taste",
      items: ["Oatmeal with Honey", "Apple slices", "Peanut butter (1 tsp)"]
    },
    lunch: {
      name: "Homemade Feast",
      description: "Clean & Hearty",
      items: ["Fish or Chicken Curry", "Rice (limited)", "Saag (Green leafy veg)"]
    },
    dinner: {
      name: "Saturday Soup",
      description: "Recover & Cleanse",
      items: ["Mixed Bean Soup", "Cucumber Salad", "No grains"]
    }
  },
  {
    day: 7,
    focus: "Weekend Walk",
    tip: "Try a 45-minute brisk walk today. Explore a park.",
    breakfast: {
      name: "Banana Pancakes",
      description: "Healthy version",
      items: ["Oats & Banana pancakes", "1 Egg", "Tea"]
    },
    lunch: {
      name: "Variety Platter",
      description: "Multiple nutrients",
      items: ["Chickpea (Chana) Salad", "1 Roti", "Small portion Curd"]
    },
    dinner: {
      name: "Grilled Paneer",
      description: "Satiating protein",
      items: ["Grilled Paneer", "Stir-fry Veggies", "Glass of warm milk"]
    }
  }
];

// Generate 30 days by repeating and slightly modifying the 7-day plan
export const MEAL_PLAN: DayPlan[] = Array.from({ length: 30 }, (_, i) => {
  const baseIndex = i % 7;
  const original = basePlan[baseIndex];
  return {
    ...original,
    day: i + 1,
    // Add small variations to focus items for late days
    focus: i >= 14 ? `Advanced: ${original.focus}` : original.focus
  };
});
