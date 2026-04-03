"use client";

import { useState } from "react";

type Score = {
  xp: number;
  date: string;
};

export default function Leaderboard() {
  const [scores] = useState<Score[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const stored = localStorage.getItem("arena_leaderboard");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  if (!scores.length) {
    return (
      <div className="text-sm text-gray-400">
        No scores yet. Play to get started!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-white font-semibold">🏆 Leaderboard</h3>

      {scores.map((score, index) => (
        <div
          key={index}
          className="flex justify-between text-sm text-gray-300"
        >
          <span>#{index + 1}</span>
          <span>{score.xp} XP</span>
          <span>{score.date}</span>
        </div>
      ))}
    </div>
  );
}