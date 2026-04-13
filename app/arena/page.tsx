"use client";

import { useEffect, useState } from "react";

import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";

import ArenaQuiz from "@/components/arena/quiz";
import Timer from "@/components/arena/timer";
import XPBar from "@/components/arena/xp-bar";
import ArenaBadges from "@/components/arena/badge";
import Leaderboard from "@/components/arena/leaderboard";

import { generateQuiz } from "@/services/arena/quiz-generator";
import {
  createInitialStats,
  updateXP,
  shouldTriggerAd,
} from "@/services/arena/scoring";
import { getUnlockedAchievements } from "@/services/arena/achievements";

import { Quiz, PlayerStats } from "@/types/arena";
import { trackUserActivity } from "@/services/memory/client-tracking"; // ✅ NEW

type Score = {
  xp: number;
  date: string;
};

export default function ArenaPage() {
  const [topic, setTopic] = useState("");
  const [started, setStarted] = useState(false);

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<PlayerStats>(createInitialStats());
  const [finished, setFinished] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);

  // ⚠️ Replace with real auth later
  const userId = "temp-user";

  // 🧠 Debounce tracking (VERY IMPORTANT for Arena)
  let trackTimeout: NodeJS.Timeout;

  function debouncedTrack(
    userId: string,
    type: string,
    topic: string,
    score: number
  ) {
    clearTimeout(trackTimeout);
    trackTimeout = setTimeout(() => {
      trackUserActivity(userId, type, topic, score);
    }, 300);
  }

  // Load Quiz
  useEffect(() => {
    if (!started) return;

    async function loadQuiz() {
      try {
        setLoading(true);
        const data = await generateQuiz(topic);
        setQuiz(data);
      } catch (err) {
        console.error(err);
        setError("Failed to generate quiz.");
      } finally {
        setLoading(false);
      }
    }

    loadQuiz();
  }, [started, topic]);

  const handleStart = () => {
    if (!topic.trim()) return;
    setStarted(true);
  };

  const handleAnswer = (isCorrect: boolean) => {
    setStats((prev) => {
      const updated = updateXP(prev, isCorrect);

      if (shouldTriggerAd(updated)) {
        alert("Ad Break! (Simulation)");
      }

      return updated;
    });

    // ✅ ✅ ✅ MEMORY TRACKING (ARENA MODE — CRITICAL)
    if (userId && topic) {
      const score = isCorrect ? 1 : 0;

      // ⚡ Debounced (prevents API spam)
      debouncedTrack(userId, "arena", topic, score);
    }
  };

  const handleNext = () => {
    setQuestionIndex((prev) => prev + 1);
  };

  const handleFinish = () => {
    setFinished(true);

    try {
      const stored = localStorage.getItem("arena_leaderboard");
      const scores: Score[] = stored ? JSON.parse(stored) : [];

      scores.push({
        xp: stats.xp,
        date: new Date().toLocaleDateString(),
      });

      scores.sort((a, b) => b.xp - a.xp);

      localStorage.setItem(
        "arena_leaderboard",
        JSON.stringify(scores.slice(0, 5))
      );
    } catch {
      console.error("Leaderboard save failed");
    }
  };

  const achievements = getUnlockedAchievements(stats);

  if (!started) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="flex flex-col gap-4 w-full max-w-md">
          <h2 className="text-white text-lg font-semibold">
            🎮 Arena Mode
          </h2>

          <Input
            placeholder="Enter a topic (e.g. Python, Math, AI)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          <Button onClick={handleStart} disabled={!topic.trim()}>
            Start Arena
          </Button>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="flex items-center gap-3">
          <Spinner />
          <span className="text-gray-300">
            Generating your Arena...
          </span>
        </Card>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="flex flex-col gap-4 text-center">
          <p className="text-red-400">{error}</p>
          <Button onClick={() => location.reload()}>
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto py-10 px-4">
      <XPBar stats={stats} />

      <Timer key={questionIndex} onTimeUp={handleNext} />

      {!finished ? (
        <ArenaQuiz
          questions={quiz.questions}
          onAnswer={handleAnswer}
          onFinish={handleFinish}
        />
      ) : (
        <Card className="text-center flex flex-col gap-4">
          <h2 className="text-xl text-white font-semibold">
            🎉 Arena Completed!
          </h2>

          <p className="text-gray-400">
            Final Score: {stats.xp} XP
          </p>

          <ArenaBadges achievements={achievements} />
          <Leaderboard />
        </Card>
      )}
    </div>
  );
}