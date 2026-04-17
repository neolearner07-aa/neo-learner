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

// ✅ Zustand store
import { useFileStore } from "@/store/file-store";

export default function TutorPage() {
  const router = useRouter();

  const [goal, setGoal] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);

  // kept without removing anything
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const userId = "temp-user";

  // global file state
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

      console.log("Selected Files:", selectedFileIds);

      if (userId && goal) {
        trackUserActivity(userId, "tutor", goal);
      }

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
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 w-full overflow-x-hidden">
      <Card className="w-full max-w-xl flex flex-col gap-6 p-5 sm:p-6 overflow-hidden">

        <h1 className="text-2xl font-bold text-white text-center">
          📚 Tutor Mode
        </h1>

        <p className="text-gray-400 text-center">
          Create your personalized AI study plan
        </p>

        {/* KNOWLEDGE SECTION */}
        <div className="border border-gray-700 rounded-xl p-4 space-y-3 bg-black/20 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <p className="text-sm font-medium text-white">
              Your Study Materials
            </p>

            <span className="text-xs text-gray-400">
              Optional but recommended
            </span>
          </div>

          <FileUpload userId={userId} />

          {/* FIXED */}
          <FileList
            onSelectionChange={setSelectedFiles}
          />

          {selectedFiles.length > 0 && (
            <p className="text-xs text-cyan-400">
              {selectedFiles.length} file(s) selected
            </p>
          )}
        </div>

        {/* INPUTS */}
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

        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full"
        >
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