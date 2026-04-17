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

  // ✅ Selected files for AI context
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const userId = "temp-user";

  const handleStart = () => {
    if (!topic.trim()) {
      alert("Please enter a topic");
      return;
    }

    const encodedTopic = encodeURIComponent(topic.trim());

    // ✅ Pass selected file ids in query
    const query =
      selectedFiles.length > 0
        ? `?files=${encodeURIComponent(selectedFiles.join(","))}`
        : "";

    router.push(`/learn/${encodedTopic}${query}`);
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
    <div className="max-w-3xl mx-auto flex flex-col gap-6 py-10 px-4 w-full overflow-x-hidden">

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

      {/* FILE SYSTEM */}
      <Card className="flex flex-col gap-4 p-5 w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
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

      {/* INPUT */}
      <Card className="flex flex-col gap-4 p-5 w-full overflow-hidden">
        <Input
          placeholder="e.g. Photosynthesis, JavaScript basics, Gravity..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleStart();
          }}
        />

        {selectedFiles.length > 0 && (
          <p className="text-xs text-cyan-400">
            {selectedFiles.length} file(s) selected for AI learning context
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            onClick={handleReward}
            className="bg-yellow-500 text-black w-full sm:w-auto"
          >
            🎁 Get Credits
          </Button>

          <Button
            onClick={handleStart}
            disabled={!topic.trim()}
            className="flex-1 w-full"
          >
            🚀 Start Learning
          </Button>
        </div>
      </Card>
    </div>
  );
}