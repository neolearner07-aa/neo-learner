import { runAI } from "@/services/ai/orchestrator";
import { Question, Quiz } from "@/types/arena";

/**
 * Safely parse JSON
 */
function safeParse(json: string) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Validate MCQs structure
 */
function isValidMCQArray(mcqs: unknown): mcqs is Question[] {
  if (!Array.isArray(mcqs)) return false;

  return mcqs.every((q) => {
    return (
      typeof q.question === "string" &&
      Array.isArray(q.options) &&
      typeof q.correctAnswer === "string" &&
      typeof q.explanation === "string"
    );
  });
}

/**
 * Generate Quiz using AI
 */
export async function generateQuiz(topic: string): Promise<Quiz> {
  try {
    const response = await runAI("arena", topic);

    const parsed = safeParse(response);

    if (!parsed || !isValidMCQArray(parsed.mcqs)) {
      throw new Error("Invalid AI response format");
    }

    // Ensure minimum 3 questions (we'll increase later)
    if (parsed.mcqs.length < 3) {
      throw new Error("Not enough questions generated");
    }

    return {
      topic,
      questions: parsed.mcqs,
    };
  } catch (error) {
    console.warn("AI Quiz Generation Failed. Using fallback.");

    // 🧪 FALLBACK MOCK QUIZ (DEV MODE SAFE)
    return {
      topic,
      questions: [
        {
          question: `What is ${topic}?`,
          options: [
            "A programming language",
            "A database",
            "A framework",
            "A concept",
          ],
          correctAnswer: "A programming language",
          explanation: `${topic} is commonly known as a programming language.`,
        },
        {
          question: `Why is ${topic} important?`,
          options: [
            "It builds logic",
            "It is useless",
            "Only for experts",
            "Not used today",
          ],
          correctAnswer: "It builds logic",
          explanation: `${topic} helps in developing logical thinking.`,
        },
        {
          question: `Where is ${topic} used?`,
          options: [
            "Web development",
            "Cooking",
            "Driving",
            "Painting",
          ],
          correctAnswer: "Web development",
          explanation: `${topic} is widely used in web development.`,
        },
      ],
    };
  }
}