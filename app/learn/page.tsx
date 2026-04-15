"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";

import FileUpload from "@/components/file/file-upload";
import FileList from "@/components/file/file-list";

export default function LearnPage() {
  const [topic, setTopic] = useState("");
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const userId = "temp-user";

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
    <div className="max-w-3xl mx-auto flex flex-col gap-6 py-10">

      {/* HEADER */}
      <div className="text-center space-y-2">
        <Badge>Learn Mode</Badge>
        <h1 className="text-3xl font-bold text-white">
          What do you want to learn today?
        </h1>
        <p className="text-gray-400">
          Enter any topic or use your uploaded notes to learn smarter.
        </p>
      </div>

      {/* 📚 FILE SYSTEM (INTEGRATED CARD) */}
      <Card className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            📂 Your Study Materials
          </h2>
          <p className="text-xs text-gray-400">
            Upload PDFs, images, notes
          </p>
        </div>

        <FileUpload userId={userId} />
        <FileList
          onSelectionChange={setSelectedFiles}
        />
      </Card>

      {/* 🎯 LEARNING INPUT */}
      <Card className="flex flex-col gap-4 p-5">
        <Input
          placeholder="e.g. Photosynthesis, JavaScript basics, Gravity..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleStart();
          }}
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleReward}
            className="bg-yellow-500 text-black"
          >
            🎁 Get Credits
          </Button>

          <Button
            onClick={handleStart}
            disabled={!topic.trim()}
            className="flex-1"
          >
            🚀 Start Learning
          </Button>
        </div>
      </Card>
    </div>
  );
}