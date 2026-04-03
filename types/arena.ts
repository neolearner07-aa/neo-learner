/**
 * Arena Mode Types
 * Defines structure for quiz + player stats
 */

/**
 * Single Question
 */
export type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

/**
 * Quiz Structure
 */
export type Quiz = {
  topic: string;
  questions: Question[];
};

/**
 * Player Stats (Gamification Core)
 */
export type PlayerStats = {
  xp: number;
  streak: number;
  level: number;
  correctAnswers: number;
  totalQuestions: number;
};