"use client";

import React from "react";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import { motion } from "framer-motion";
import Flashcards from "../shared/flashcards";
import MCQQuiz from "../shared/mcq-quiz";
import { fadeIn, slideUp, transition } from "@/lib/animations";
import { LearningModule } from "@/types/learn";
import ChatBox from "./chat-box";

type LessonViewProps = {
  data: LearningModule | string;
};

export default function LessonView({ data }: LessonViewProps) {
  // 🧠 Handle DEV MODE (string response)
  if (typeof data === "string") {
    return (
      <Card>
        <p className="text-gray-300 whitespace-pre-line">{data}</p>
      </Card>
    );
  }

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

      {/* Explanation */}
      <motion.div variants={slideUp} transition={transition}>
        <Card>
          <Badge>Explanation</Badge>
          <p className="mt-2 text-gray-300">{data.explanation}</p>
        </Card>
      </motion.div>

      {/* Analogy */}
      <motion.div variants={slideUp} transition={transition}>
        <Card>
          <Badge>Analogy</Badge>
          <p className="mt-2 text-gray-300">{data.analogy}</p>
        </Card>
      </motion.div>

      {/* Story */}
      <motion.div variants={slideUp} transition={transition}>
        <Card>
          <Badge>Story</Badge>
          <p className="mt-2 text-gray-300">{data.story}</p>
        </Card>
      </motion.div>

      {/* Steps */}
      <motion.div variants={slideUp} transition={transition}>
        <Card>
          <Badge>Step-by-Step</Badge>
          <ul className="mt-2 list-disc list-inside text-gray-300 space-y-1">
            {data.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </Card>
      </motion.div>

      {/* Summary */}
      <motion.div variants={slideUp} transition={transition}>
        <Card>
          <Badge>Summary</Badge>
          <p className="mt-2 text-gray-300">{data.summary}</p>
        </Card>
      </motion.div>

      {/* Flashcards */}
      {typeof data !== "string" && (
        <Flashcards cards={data.flashcards} />
      )}

      {/* MCQ Quiz */}
      {typeof data !== "string" && (
        <MCQQuiz questions={data.mcqs} />
      )}

      {/* Chat */}
      {typeof data !== "string" && (
        <ChatBox topic={data.title} />
    )}
    </motion.div>
  );
}