/* C:\Users\admin\Desktop\neo-learner\services\learn\learn-generator.ts */

import { runAI } from "@/services/ai/orchestrator";
import { createCourse } from "@/services/courses/course.service";
import { prisma } from "@/lib/prisma";
import { LearningModule } from "@/types/learn";

/**
 * Generate Learning Module (RAW AI)
 */
export async function generateLearningModule(
  topic: string,
  userId?: string,
  selectedFileIds?: string[] // ✅ NEW
): Promise<string> {
  try {
    if (!topic || !topic.trim()) {
      throw new Error("Topic is required");
    }

    const userInput = `Teach me ${topic} in a structured way`;

    // ✅ PASS userId + files
    const response = await runAI(
      "learning",
      userInput,
      userId,
      selectedFileIds
    );

    if (!response) {
      throw new Error("Empty AI response");
    }

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Learn Generator Error:", error.message);
    } else {
      console.error("Unknown Learn Generator Error:", error);
    }

    throw new Error("Failed to generate learning module");
  }
}

/**
 * Generate OR Fetch Learning Module (🔥 FIXED)
 */
export async function generateAndSaveLearningModule(
  topic: string,
  userId: string,
  selectedFileIds?: string[] // ✅ NEW
) {
  try {
    if (!topic || !topic.trim()) {
      throw new Error("Topic is required");
    }

    const existingCourse = await prisma.course.findFirst({
      where: {
        title: topic,
      },
    });

    if (existingCourse) {
      return existingCourse;
    }

    // ✅ PASS FILE CONTEXT
    const rawContent = await generateLearningModule(
      topic,
      userId,
      selectedFileIds
    );

    let structuredContent: LearningModule;

    try {
      structuredContent = JSON.parse(rawContent) as LearningModule;
    } catch {
      structuredContent = {
        id: crypto.randomUUID(),
        title: topic,
        lessons: [
          {
            id: "1",
            title: topic,
            content: {
              explanation: rawContent,
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

    const course = await createCourse({
      title: topic,
      description: `AI generated course for ${topic}`,
      content: structuredContent,
      userId,
    });

    return course;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Generate & Save Error:", error.message);
    } else {
      console.error("Unknown Generate & Save Error:", error);
    }

    throw new Error("Failed to generate and save course");
  }
}