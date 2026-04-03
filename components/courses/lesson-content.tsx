"use client";

import { motion } from "framer-motion";

import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";

import { slideUp, transition } from "@/lib/animations";

type LessonContentProps = {
  title: string;
  content: string;
};

export default function LessonContent({
  title,
  content,
}: LessonContentProps) {
  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="visible"
      transition={transition}
      className="flex flex-col gap-4"
    >
      <Badge>Lesson</Badge>

      <Card className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-white">
          {title}
        </h1>

        <p className="text-gray-300 leading-relaxed text-lg">
          {content}
        </p>
      </Card>
    </motion.div>
  );
}