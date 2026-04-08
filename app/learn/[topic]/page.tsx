"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import LessonView from "@/components/learn/lesson-view";
import Spinner from "@/components/ui/spinner";

import { LearningModule } from "@/types/learn";

export default function TopicPage() {
  const params = useParams();
  const topic = decodeURIComponent(params.topic as string);

  const [data, setData] = useState<LearningModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  async function fetchData() {
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      const result = await res.json();

      if (result.error) {
  if (result.error === "No AI credits left") {
    setError("🚫 You have no AI credits left. Watch ads or upgrade.");
  } else {
    setError(result.error);
  }
  return;
}

      const content = result.content;

      // 🛡️ HARD SAFETY LAYER
      let safeData: LearningModule;

      if (content && Array.isArray(content.lessons)) {
        safeData = {
          id: result.id, // ✅ FIXED (REAL DB ID)
          title: content.title || topic,
          lessons: content.lessons,
        };
      } else {
        safeData = {
          id: result.id || "temp-id", // ✅ FIXED (fallback id)
          title: topic,
          lessons: [
            {
              id: "1",
              title: topic,
              content: {
                explanation:
                  typeof content === "string"
                    ? content
                    : "No content available",
                analogy: "",
                story: "",
                steps: [],
                summary: "",
                flashcards: [],
                mcqs: [],
              },
            },
          ],
        };
      }

      console.log("🔥 FINAL DATA SENT TO UI:", safeData);

      setData(safeData);
    } catch (err) {
      console.error(err);
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