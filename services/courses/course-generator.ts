import { runAI } from "@/services/ai/orchestrator";
import { Course } from "@/types/course";

/**
 * ✅ Raw Types (for AI response)
 */
type RawLesson = {
  title?: string;
  content?: string;
};

type RawModule = {
  title?: string;
  lessons?: RawLesson[];
};

type RawCourse = {
  title?: string;
  description?: string;
  modules?: RawModule[];
};

/**
 * Safe JSON parser
 */
function safeParseJSON(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/**
 * Fallback course (DEV MODE or failure)
 */
function createFallbackCourse(topic: string): Course {
  return {
    id: Date.now().toString(),
    title: `${topic} (Sample Course)`,
    description: "This is a fallback course (AI failed).",
    modules: [
      {
        id: "m1",
        title: "Introduction",
        lessons: [
          {
            id: "l1",
            title: `What is ${topic}?`,
            content: `${topic} is an important subject. This is a sample lesson.`,
          },
          {
            id: "l2",
            title: `${topic} Basics`,
            content: `Here are the basic concepts of ${topic}.`,
          },
        ],
      },
    ],
  };
}

/**
 * Generate Course using AI
 */
export async function generateCourse(
  topic: string
): Promise<Course> {
  try {
    const response = await runAI(
      "general",
      `Generate a structured course for: ${topic}`
    );

    const parsed = safeParseJSON(response) as RawCourse | null;

    // ❌ Invalid JSON → fallback
    if (!parsed || !parsed.modules) {
      console.warn("Invalid JSON from AI. Using fallback.");
      return createFallbackCourse(topic);
    }

    return {
      id: Date.now().toString(),
      title: parsed.title || topic,
      description: parsed.description || "",
      modules: parsed.modules.map((module, mIndex) => ({
        id: `m-${mIndex}`,
        title: module.title || "Module",
        lessons:
          module.lessons?.map((lesson, lIndex) => ({
            id: `l-${mIndex}-${lIndex}`,
            title: lesson.title || "Lesson",
            content: lesson.content || "No content",
          })) || [],
      })),
    };
  } catch (error) {
    console.error("Course generation failed:", error);

    // 🔥 Always fallback instead of crash
    return createFallbackCourse(topic);
  }
}