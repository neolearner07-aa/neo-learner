"use client";

import { PlayerStats } from "@/types/arena";

type XPBarProps = {
  stats: PlayerStats;
};

export default function XPBar({ stats }: XPBarProps) {
  const xpInLevel = stats.xp % 100;
  const progress = (xpInLevel / 100) * 100;

  return (
    <div className="flex flex-col gap-2">
      {/* Level + XP Info */}
      <div className="flex justify-between text-sm text-gray-400">
        <span>Level {stats.level}</span>
        <span>{stats.xp} XP</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-[var(--glass-bg)] rounded-full overflow-hidden">
        <div
          className="h-full bg-cyan-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}