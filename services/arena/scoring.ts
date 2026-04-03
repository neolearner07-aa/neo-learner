import { PlayerStats } from "@/types/arena";

/**
 * Initialize Player Stats
 */
export function createInitialStats(): PlayerStats {
  return {
    xp: 0,
    streak: 0,
    level: 1,
    correctAnswers: 0,
    totalQuestions: 0,
  };
}

/**
 * Calculate Level from XP
 */
function calculateLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

/**
 * Update Stats (XP + Streak + Level)
 */
export function updateXP(
  stats: PlayerStats,
  isCorrect: boolean
): PlayerStats {
  const xpGain = isCorrect ? 10 : 2;

  const newXP = stats.xp + xpGain;
  const newLevel = calculateLevel(newXP);

  return {
    ...stats,
    xp: newXP,

    // ✅ STREAK
    streak: isCorrect ? stats.streak + 1 : 0,

    // ✅ LEVEL
    level: newLevel,

    correctAnswers: isCorrect
      ? stats.correctAnswers + 1
      : stats.correctAnswers,

    totalQuestions: stats.totalQuestions + 1,
  };
}

/**
 * Check if Ad should be shown
 */
export function shouldTriggerAd(stats: PlayerStats): boolean {
  return stats.totalQuestions > 0 && stats.totalQuestions % 10 === 0;
}