/**
 * Individual Topic
 */
export type Topic = {
  id: string;
  title: string;
};

/**
 * Daily Plan Item
 */
export type DailyPlan = {
  day: number;
  tasks: string[];
};

/**
 * Weekly Plan Item
 */
export type WeeklyPlan = {
  week: number;
  focus: string;
};

/**
 * Full Study Plan
 */
export type StudyPlan = {
  goal: string;
  duration: string;

  topics: Topic[];
  dailyPlan: DailyPlan[];
  weeklyPlan: WeeklyPlan[];
};