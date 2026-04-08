import { openaiChat } from "./openai";
import { geminiChat } from "./gemini";
import { buildPrompt } from "@/lib/prompts";
import { incrementAIUsage } from "./ai-usage.service";
import { consumeAICredit } from "././ai-credit.service"; // ✅ NEW

import { mockAI } from "./mock";

/**
 * AI Task Types
 */
type AIType =
  | "general"
  | "tutor"
  | "learning"
  | "solve"
  | "arena"
  | "course";

/**
 * Decide which AI model to use
 */
function selectModel(userInput: string): "openai" | "gemini" {
  const complexKeywords = [
    "explain",
    "why",
    "how",
    "code",
    "logic",
    "deep",
  ];

  const isComplex = complexKeywords.some((word) =>
    userInput.toLowerCase().includes(word)
  );

  return isComplex ? "openai" : "gemini";
}

/**
 * Main Orchestrator with Failover + Credits System
 */
export async function runAI(
  type: AIType,
  userInput: string,
  userId?: string
): Promise<string> {
  try {
    // ==============================
    // 🔥 STEP 1: CREDIT CHECK
    // ==============================
    if (userId) {
      const creditResult = await consumeAICredit(userId);

      if (!creditResult.allowed) {
        throw new Error("No AI credits left");
      }

      // ✅ Track usage ONLY if allowed
      await incrementAIUsage(userId);
    }

    // ==============================
    // 🧠 DEV MODE CHECK
    // ==============================
    if (process.env.NEXT_PUBLIC_DEV_MODE === "true") {
      console.log("Running in DEV MODE (Mock AI)");
      return await mockAI(userInput);
    }

    const prompt = buildPrompt(type, userInput);

    const primaryModel = selectModel(userInput);
    const fallbackModel =
      primaryModel === "openai" ? "gemini" : "openai";

    console.log("Primary Model:", primaryModel);
    console.log("Fallback Model:", fallbackModel);

    try {
      // ==============================
      // 🔥 PRIMARY MODEL
      // ==============================
      if (primaryModel === "openai") {
        return await openaiChat(prompt);
      } else {
        return await geminiChat(prompt);
      }
    } catch (primaryError: unknown) {
      console.warn("Primary AI Failed. Switching to fallback...");

      if (primaryError instanceof Error) {
        console.warn("Primary Error:", primaryError.message);
      }

      try {
        // ==============================
        // 🔥 FALLBACK MODEL
        // ==============================
        if (fallbackModel === "openai") {
          return await openaiChat(prompt);
        } else {
          return await geminiChat(prompt);
        }
      } catch (fallbackError: unknown) {
        console.error("Fallback AI also failed.");

        if (fallbackError instanceof Error) {
          console.error("Fallback Error:", fallbackError.message);
        }

        throw new Error("Both AI models failed to respond");
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("AI Orchestrator Error:", error.message);
      throw error;
    }

    throw new Error("AI execution failed");
  }
}