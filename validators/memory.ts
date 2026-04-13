import { z } from "zod";

export const memorySchema = z.object({
  userId: z.string().min(1),
  type: z.string().min(1),
  topic: z.string().min(1),
  score: z.number().min(0).max(1).optional(),
});