import { runAI } from "@/services/ai/orchestrator";

/**
 * Generate Learning Module
 * Takes topic and returns AI-generated content
 */
export async function generateLearningModule(topic: string): Promise<string> {
  try {
    if (!topic || !topic.trim()) {
      throw new Error("Topic is required");
    }

    const userInput = `Teach me ${topic} in a structured way`;

    const response = await runAI("learning", userInput);

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