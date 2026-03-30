"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";

import { slideUp, transition } from "@/lib/animations";
import { MCQ } from "@/types/learn";

type MCQQuizProps = {
  questions: MCQ[];
};

export default function MCQQuiz({ questions }: MCQQuizProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  if (!questions || questions.length === 0) {
    return null;
  }

  const current = questions[index];

  const handleSelect = (option: string) => {
    if (showAnswer) return;
    setSelected(option);
    setShowAnswer(true);
  };

  const nextQuestion = () => {
    setIndex((prev) => (prev + 1) % questions.length);
    setSelected(null);
    setShowAnswer(false);
  };

  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="visible"
      transition={transition}
      className="flex flex-col gap-4"
    >
      <Badge>Quiz</Badge>

      <Card className="flex flex-col gap-4">
        {/* Question */}
        <h2 className="text-lg text-white font-semibold">
          {current.question}
        </h2>

        {/* Options */}
        <div className="flex flex-col gap-2">
          {current.options.map((option, i) => {
            const isCorrect = option === current.correctAnswer;
            const isSelected = option === selected;

            return (
              <button
                key={i}
                onClick={() => handleSelect(option)}
                className={`
                  text-left px-4 py-2 rounded-xl border transition-all
                  ${
                    showAnswer
                      ? isCorrect
                        ? "border-green-400 bg-green-500/10 text-green-400"
                        : isSelected
                        ? "border-red-400 bg-red-500/10 text-red-400"
                        : "border-[var(--glass-border)] text-gray-300"
                      : "border-[var(--glass-border)] text-gray-300 hover:bg-white/10"
                  }
                `}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showAnswer && (
          <div className="text-sm text-gray-400 border-t border-[var(--glass-border)] pt-2">
            {current.explanation}
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">
            {index + 1} / {questions.length}
          </span>

          <Button onClick={nextQuestion} variant="secondary">
            Next
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}