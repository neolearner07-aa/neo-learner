"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";

import { slideUp, transition } from "@/lib/animations";
import { Flashcard as FlashcardType } from "@/types/learn";

type FlashcardsProps = {
  cards: FlashcardType[];
};

export default function Flashcards({ cards }: FlashcardsProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!cards || cards.length === 0) {
    return null;
  }

  const current = cards[index];

  const nextCard = () => {
    setFlipped(false);
    setIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setFlipped(false);
    setIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="visible"
      transition={transition}
      className="flex flex-col gap-4"
    >
      <Badge>Flashcards</Badge>

      {/* Card */}
      <motion.div
        onClick={() => setFlipped((prev) => !prev)}
        className="cursor-pointer"
        whileTap={{ scale: 0.97 }}
      >
        <Card className="min-h-[150px] flex items-center justify-center text-center">
          <p className="text-lg text-gray-200">
            {flipped ? current.answer : current.question}
          </p>
        </Card>
      </motion.div>

      {/* Controls */}
      <div className="flex justify-between">
        <Button variant="secondary" onClick={prevCard}>
          Previous
        </Button>

        <span className="text-gray-400 text-sm">
          {index + 1} / {cards.length}
        </span>

        <Button variant="secondary" onClick={nextCard}>
          Next
        </Button>
      </div>
    </motion.div>
  );
}