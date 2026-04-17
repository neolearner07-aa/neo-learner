/* C:\Users\admin\Desktop\neo-learner\services\tutor\tutor-generator.ts */

import { runAI } from "@/services/ai/orchestrator";

/**
 * Study Plan Generator
 */
export async function generateStudyPlan(
  goal: string,
  time: string,
  duration: string,
  userId?: string, // ✅ NEW
  selectedFileIds?: string[] // ✅ NEW
): Promise<string> {
  try {
    const input = `
Goal: ${goal}
Time per day: ${time} hours
Duration: ${duration}

Create a complete study plan.
`;

    // ✅ PASS CONTEXT
    const response = await runAI(
      "tutor",
      input,
      userId,
      selectedFileIds
    );

    if (!response) {
      throw new Error("Empty AI response");
    }

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Tutor Generator Error:", error.message);
    } else {
      console.error("Unknown Tutor Generator Error:", error);
    }

    throw new Error("Failed to generate study plan");
  }
}