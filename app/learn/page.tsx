"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";

export default function LearnPage() {
  const [topic, setTopic] = useState("");
  const router = useRouter();

  const handleStart = () => {
    if (!topic.trim()) {
      alert("Please enter a topic");
      return;
    }

    const encodedTopic = encodeURIComponent(topic.trim());
    router.push(`/learn/${encodedTopic}`);
  };

  const handleReward = async () => {
    try {
      const res = await fetch("/api/reward", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Reward failed");
      }

      alert("🎉 Credits added!");
    } catch {
      alert("❌ Failed to add credits");
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6 py-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <Badge>Learn Mode</Badge>
        <h1 className="text-3xl font-bold text-white">
          What do you want to learn today?
        </h1>
        <p className="text-gray-400">
          Enter any topic and NeoLearner will teach you step-by-step.
        </p>
      </div>

      {/* Input Card */}
      <Card className="flex flex-col gap-4 p-4">
        <Input
          placeholder="e.g. Photosynthesis, JavaScript basics, Gravity..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleStart();
          }}
        />

        {/* 🎁 Reward Button */}
        <Button
          onClick={handleReward}
          className="bg-yellow-500 text-black px-4 py-2 rounded"
        >
          Watch Ad + Get Credits
        </Button>

        {/* 🚀 Start */}
        <Button onClick={handleStart} disabled={!topic.trim()}>
          Start Learning
        </Button>
      </Card>
    </div>
  );
}