/* C:\Users\admin\Desktop\neo-learner\services\solve\solve-generator.ts */

import { runAI } from "@/services/ai/orchestrator";

/**
 * Generate structured solution using AI
 */
export async function generateSolution(
  input: string,
  role: string,
  userId?: string, // ✅ NEW
  selectedFileIds?: string[] // ✅ NEW
): Promise<string> {
  try {
    const enhancedInput = `
Act as a ${role}.

${input}
`;

    // ✅ PASS CONTEXT
    const response = await runAI(
      "solve",
      enhancedInput,
      userId,
      selectedFileIds
    );

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