// validators/course.ts

import { z } from "zod";

export const createCourseSchema = z.object({
  topic: z
    .string()
    .min(3, "Topic must be at least 3 characters")
    .max(100, "Topic must not exceed 100 characters"),
});