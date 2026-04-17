"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

import LessonView from "@/components/learn/lesson-view";
import Spinner from "@/components/ui/spinner";
import Card from "@/components/ui/card";

import FileUpload from "@/components/file/file-upload";
import FileList from "@/components/file/file-list";

import { LearningModule } from "@/types/learn";
import { trackUserActivity } from "@/services/memory/client-tracking";

export default function TopicPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const topic = decodeURIComponent(params.topic as string);

  const initialFiles = useMemo(() => {
    const raw = searchParams.get("files");

    if (!raw) return [];

    return raw
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
  }, [searchParams]);

  const [data, setData] = useState<LearningModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Persist selected files from previous page
  const [selectedFileIds, setSelectedFileIds] =
    useState<string[]>(initialFiles);

  const userId = "temp-user";

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/courses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic,
            selectedFileIds,
          }),
        });

        const result = await res.json();

        const payload = result.data ?? result;

        if (result.error) {
          if (result.error === "No AI credits left") {
            setError(
              "🚫 You have no AI credits left. Watch ads or upgrade."
            );
          } else {
            setError(result.error);
          }

          return;
        }

        const content = payload.content;

        let safeData: LearningModule;

        if (content && Array.isArray(content.lessons)) {
          safeData = {
            id: payload.id,
            title: content.title || topic,
            lessons: content.lessons,
          };
        } else {
          safeData = {
            id: payload.id || "temp-id",
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

        setData(safeData);

        if (userId && topic) {
          trackUserActivity(userId, "learn", topic);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load learning content");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [topic, userId, selectedFileIds]);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 flex flex-col gap-6 w-full overflow-x-hidden">

      {/* FILE SYSTEM */}
      <Card className="flex flex-col gap-4 p-5 w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-lg font-semibold text-white">
            📂 Your Study Materials
          </h2>

          <p className="text-xs text-gray-400">
            AI will use selected files while teaching
          </p>
        </div>

        <FileUpload userId={userId} />

        <FileList
          onSelectionChange={setSelectedFileIds}
        />

        {selectedFileIds.length > 0 && (
          <p className="text-xs text-cyan-400">
            Using {selectedFileIds.length} selected file(s)
          </p>
        )}
      </Card>

      {/* CONTENT */}
      {loading && (
        <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
          <Spinner />

          <p className="text-gray-400 text-sm text-center">
            Generating your personalized lesson...
          </p>
        </div>
      )}

      {!loading && error && (
        <Card>
          <div className="text-center">
            <p className="text-red-400 font-semibold">
              ⚠️ Something went wrong
            </p>

            <p className="text-gray-400 text-sm">
              Please try again later.
            </p>
          </div>
        </Card>
      )}

      {!loading && !error && data && (
        <LessonView data={data} />
      )}
    </div>
  );
}