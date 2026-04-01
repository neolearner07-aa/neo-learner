"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import LessonView from "@/components/learn/lesson-view";
import Spinner from "@/components/ui/spinner";

import { generateLearningModule } from "@/services/learn/learn-generator";
import { LearningModule } from "@/types/learn";

export default function TopicPage() {
  const params = useParams();
  const topic = decodeURIComponent(params.topic as string);

  const [data, setData] = useState<LearningModule | string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await generateLearningModule(topic);

        // 🧠 Try parsing JSON (for future real AI)
        try {
          const parsed = JSON.parse(result) as LearningModule;
          setData(parsed);
        } catch {
          // DEV MODE fallback (string)
          setData(result);
        }
      } catch (err) {
        setError("Failed to load learning content");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [topic]);

  return (
    <>
      {/* 🔄 Loading UI */}
      {loading && (
        <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
          <Spinner />
          <p className="text-gray-400 text-sm">
            Generating your personalized lesson...
          </p>
        </div>
      )}

      {/* ❌ Error UI */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <p className="text-red-400 font-semibold">
            ⚠️ Something went wrong
          </p>
          <p className="text-gray-400 text-sm">
            Please try again later.
          </p>
        </div>
      )}

      {/* ⚠️ Empty State */}
      {!loading && !error && !data && (
        <div className="text-gray-400 text-center">
          No data available
        </div>
      )}

      {/* ✅ Final Content */}
      {!loading && !error && data && (
        <LessonView data={data} />
      )}
    </>
  );
}