import { runAI } from "@/services/ai/orchestrator";

/**
 * Generate structured solution using AI
 */
export async function generateSolution(
  input: string,
  role: string
): Promise<string> {
  try {
    // 🎭 Inject role into input
    const enhancedInput = `
Act as a ${role}.

${input}
`;

    // 🚀 Use solve mode
    const response = await runAI("solve", enhancedInput);

    if (!response) {
      throw new Error("Empty AI response");
    }

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Solve Generator Error:", error.message);
    } else {
      console.error("Unknown Solve Generator Error:", error);
    }

    throw new Error("Failed to generate solution");
  }
}