import { runAI } from "@/services/ai/orchestrator";
import { createCourse } from "@/services/courses/course.service";
import { prisma } from "@/lib/prisma";
import { LearningModule } from "@/types/learn";

/**
 * Generate Learning Module (RAW AI)
 */
export async function generateLearningModule(
  topic: string,
  userId?: string
): Promise<string> {
  try {
    if (!topic || !topic.trim()) {
      throw new Error("Topic is required");
    }

    const userInput = `Teach me ${topic} in a structured way`;

    const response = await runAI("learning", userInput, userId);

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
  userId: string
) {
  try {
    if (!topic || !topic.trim()) {
      throw new Error("Topic is required");
    }

    // 🧠 1. CHECK EXISTING COURSE (GLOBAL, NOT USER-SPECIFIC)
    const existingCourse = await prisma.course.findFirst({
      where: {
      title: topic,
      },
    });

    // ✅ RETURN EXISTING (NO DUPLICATE EVER)
    if (existingCourse) {
      return existingCourse;
    }

    // ✅ RETURN EXISTING (NO DUPLICATE)
    if (existingCourse) {
      return existingCourse;
    }

    // 🧠 2. GENERATE NEW CONTENT
    const rawContent = await generateLearningModule(topic, userId);

    let structuredContent: LearningModule;

    // 🧠 3. SAFE PARSING
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

    // 🧠 4. SAVE TO DB
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