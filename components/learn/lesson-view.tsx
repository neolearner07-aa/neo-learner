"use client";

import React, { useState } from "react";
import { useEffect } from "react";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import { motion } from "framer-motion";
import Flashcards from "../shared/flashcards";
import MCQQuiz from "../shared/mcq-quiz";
import { fadeIn, slideUp, transition } from "@/lib/animations";
import { LearningModule } from "@/types/learn";
import ChatBox from "./chat-box";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/button";

type LessonViewProps = {
  data: LearningModule;
};

export default function LessonView({ data }: LessonViewProps) {
  const { data: session } = useSession();

  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
  async function fetchProgress() {
    try {
      const res = await fetch(
        `/api/progress?courseId=${data.id}`
      );

      const result = await res.json();

      if (result && !result.error) {
        setProgress(result.progressPercent || 0);
      }
    } catch (error) {
      console.error("Failed to load progress:", error);
    }
  }

  if (data?.id) {
    fetchProgress();
  }
}, [data.id]);

  // 🛡️ HARD SAFETY CHECK
  if (!data || !Array.isArray(data.lessons)) {
    return (
      <div className="text-center text-gray-400">
        No lessons available
      </div>
    );
  }

  // ✅ Handle lesson completion
  const handleComplete = async (lessonId: string) => {
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: data.id, // temporary (will improve later)
          lessonId,
          totalLessons: data.lessons.length,
        }),
      });

      const result = await res.json();

      if (result.error) {
        alert(result.error);
      } else {
        setProgress(result.progressPercent);
      }
    } catch (error) {
      console.error("Progress error:", error);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={transition}
      className="flex flex-col gap-6"
    >
      {/* Title */}
      <motion.div variants={slideUp} transition={transition}>
        <h1 className="text-3xl font-bold text-white">{data.title}</h1>
      </motion.div>

      {/* ✅ Progress Bar */}
      <Card>
        <p className="text-white font-semibold">
          Progress: {progress}%
        </p>

        <div className="w-full bg-gray-700 rounded-full h-3 mt-2">
          <div
            className="bg-green-500 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </Card>

      {/* 🔥 LOOP THROUGH LESSONS */}
      {data.lessons.map((lesson) => (
        <motion.div
          key={lesson.id}
          variants={slideUp}
          transition={transition}
          className="flex flex-col gap-6"
        >
          {/* ✅ Mark Complete Button */}
          <Button
            onClick={() => handleComplete(lesson.id)}
          >
            Mark as Completed
          </Button>

          {/* Explanation */}
          <Card>
            <Badge>Explanation</Badge>
            <p className="mt-2 text-gray-300">
              {lesson.content.explanation}
            </p>
          </Card>

          {/* Analogy */}
          <Card>
            <Badge>Analogy</Badge>
            <p className="mt-2 text-gray-300">
              {lesson.content.analogy}
            </p>
          </Card>

          {/* Story */}
          <Card>
            <Badge>Story</Badge>
            <p className="mt-2 text-gray-300">
              {lesson.content.story}
            </p>
          </Card>

          {/* Steps */}
          <Card>
            <Badge>Step-by-Step</Badge>
            <ul className="mt-2 list-disc list-inside text-gray-300 space-y-1">
              {lesson.content.steps?.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </Card>

          {/* Summary */}
          <Card>
            <Badge>Summary</Badge>
            <p className="mt-2 text-gray-300">
              {lesson.content.summary}
            </p>
          </Card>

          {/* Flashcards */}
          <Flashcards cards={lesson.content.flashcards || []} />

          {/* MCQ Quiz */}
          <MCQQuiz questions={lesson.content.mcqs || []} />
        </motion.div>
      ))}

      {/* Chat */}
      <ChatBox topic={data.title} />
    </motion.div>
  );
}