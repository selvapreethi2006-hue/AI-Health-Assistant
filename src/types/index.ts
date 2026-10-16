export type NavigationTab = 'home' | 'chat' | 'nutrition' | 'fitness' | 'tips' | 'about';

export type Language = 'en' | 'ta';

export type Theme = 'light' | 'dark';

export interface DayTrend {
  day: string;
  dayTa: string;
  waterMl: number;
  waterGoal: number;
  sleepHours: number;
  sleepGoal: number;
  exerciseMinutes: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isEmergency?: boolean;
}

export interface HabitItem {
  id: string;
  label: string;
  labelTa: string;
  done: boolean;
  category: 'water' | 'exercise' | 'food' | 'mind' | 'sleep';
}

export interface HealthTrackerData {
  waterMl: number;
  waterGoalMl: number;
  sleepHours: number;
  sleepQuality: 'restful' | 'average' | 'interrupted';
  exerciseMinutes: number;
  exerciseGoalMinutes: number;
  exerciseType: string;
  checklist: HabitItem[];
}

export interface Micronutrient {
  nutrient: string;
  benefit: string;
  foodSources: string;
}

export interface NutritionAnalysisResult {
  title: string;
  summary: string;
  isVegetarianFriendly: boolean;
  macronutrients: {
    protein: string;
    carbohydrates: string;
    healthyFats: string;
    fiber: string;
  };
  keyMicronutrients: Micronutrient[];
  healthyTips: string[];
  caution?: string;
}

export interface HealthTip {
  id: string;
  category: 'hydration' | 'sleep' | 'nutrition' | 'exercise' | 'mind';
  title: string;
  titleTa: string;
  summary: string;
  summaryTa: string;
  practicalAction: string;
  practicalActionTa: string;
  evidenceBase: string;
}
