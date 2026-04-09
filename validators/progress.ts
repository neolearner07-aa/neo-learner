// validators/progress.ts

import { z } from "zod";

export const progressSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
  progressPercent: z
    .number()
    .min(0, "Progress cannot be less than 0")
    .max(100, "Progress cannot exceed 100"),
});

export const updateProgressSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
  lessonId: z.string().min(1, "Lesson ID is required"),
  totalLessons: z
    .number()
    .min(1, "Total lessons must be at least 1"),
});