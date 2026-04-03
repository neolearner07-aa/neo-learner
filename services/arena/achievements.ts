import { PlayerStats } from "@/types/arena";

export type Achievement = {
  id: string;
  title: string;
  description: string;
};

/**
 * All Available Achievements
 */
const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_win",
    title: "First Win 🎉",
    description: "Answer your first question correctly",
  },
  {
    id: "streak_5",
    title: "Hot Streak 🔥",
    description: "Reach a 5-question streak",
  },
  {
    id: "xp_100",
    title: "Century Club 💯",
    description: "Reach 100 XP",
  },
  {
    id: "quiz_10",
    title: "Quiz Master 🧠",
    description: "Complete 10 questions",
  },
];

/**
 * Check unlocked achievements
 */
export function getUnlockedAchievements(
  stats: PlayerStats
): Achievement[] {
  const unlocked: Achievement[] = [];

  if (stats.correctAnswers >= 1) {
    unlocked.push(ACHIEVEMENTS[0]);
  }

  if (stats.streak >= 5) {
    unlocked.push(ACHIEVEMENTS[1]);
  }

  if (stats.xp >= 100) {
    unlocked.push(ACHIEVEMENTS[2]);
  }

  if (stats.totalQuestions >= 10) {
    unlocked.push(ACHIEVEMENTS[3]);
  }

  return unlocked;
}