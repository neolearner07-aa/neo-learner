"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";

import FileUpload from "@/components/file/file-upload";
import FileList from "@/components/file/file-list";

import { trackUserActivity } from "@/services/memory/client-tracking";

// ✅ NEW: Zustand store
import { useFileStore } from "@/store/file-store";

export default function TutorPage() {
  const router = useRouter();

  const [goal, setGoal] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const userId = "temp-user";

  // ✅ NEW: file selection state
  const { selectedFileIds } = useFileStore();

  const handleGenerate = async () => {
    if (!goal.trim() || !time.trim() || !duration.trim()) {
      alert("⚠️ Please fill all fields properly");
      return;
    }

    if (isNaN(Number(time))) {
      alert("⚠️ Time must be a number (hours per day)");
      return;
    }

    try {
      setLoading(true);

      const fakePlanId = Date.now().toString();

      // ✅ DEBUG (optional but useful)
      console.log("Selected Files:", selectedFileIds);

      if (userId && goal) {
        trackUserActivity(userId, "tutor", goal);
      }

      // ✅ FUTURE READY: pass selected files via query (optional)
      const query = new URLSearchParams({
        goal,
        time,
        duration,
        files: JSON.stringify(selectedFileIds),
      });

      router.push(`/tutor/${fakePlanId}?${query.toString()}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-xl flex flex-col gap-6 p-6">

        <h1 className="text-2xl font-bold text-white text-center">
          📚 Tutor Mode
        </h1>

        <p className="text-gray-400 text-center">
          Create your personalized AI study plan
        </p>

        {/* 📚 INLINE KNOWLEDGE SECTION */}
        <div className="border border-gray-700 rounded-xl p-4 space-y-3 bg-black/20">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-white">
              Your Study Materials
            </p>
            <span className="text-xs text-gray-400">
              Optional but recommended
            </span>
          </div>

          <FileUpload userId={userId} />

          {/* ✅ CONNECTED TO GLOBAL FILE SELECTION */}
          <FileList
            userId={userId}
            onSelectionChange={setSelectedFiles}
          />
        </div>

        {/* 🎯 INPUTS */}
        <Input
          placeholder="Your Goal (e.g., Crack JEE, Learn Python)"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />

        <Input
          placeholder="Hours per day (e.g., 2)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <Input
          placeholder="Duration (e.g., 30 days)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? (
            <div className="flex items-center gap-2">
              <Spinner />
              Generating your AI study plan...
            </div>
          ) : (
            "Generate Study Plan"
          )}
        </Button>

        {loading && (
          <p className="text-sm text-gray-400 text-center">
            This may take a few seconds. Please wait...
          </p>
        )}

      </Card>
    </div>
  );
}