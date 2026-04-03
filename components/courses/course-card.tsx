"use client";

import { motion } from "framer-motion";

import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";

import { fadeIn, transition } from "@/lib/animations";
import { Course } from "@/types/course";

type CourseCardProps = {
  course: Course;
  onStart: (courseId: string) => void;
};

export default function CourseCard({
  course,
  onStart,
}: CourseCardProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      transition={transition}
    >
      <Card className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">
            {course.title}
          </h2>
          <Badge>Course</Badge>
        </div>

        <p className="text-gray-400 text-sm">
          {course.description}
        </p>

        <Button onClick={() => onStart(course.id)}>
          Start Course
        </Button>
      </Card>
    </motion.div>
  );
}