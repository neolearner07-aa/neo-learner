import { openaiChat } from "./openai";
import { geminiChat } from "./gemini";
import { buildPrompt } from "@/lib/prompts";

import { mockAI } from "./mock";

/**
 * AI Task Types
 */
type AIType = "general" | "tutor" | "learning";

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
 * Main Orchestrator with Failover
 */
export async function runAI(
  type: AIType,
  userInput: string
): Promise<string> {

  // 🧠 DEV MODE CHECK
  if (process.env.NEXT_PUBLIC_DEV_MODE === "true") {
    console.log("Running in DEV MODE (Mock AI)");
    return await mockAI(userInput);
  }
  const prompt = buildPrompt(type, userInput);

  const primaryModel = selectModel(userInput);
  const fallbackModel = primaryModel === "openai" ? "gemini" : "openai";

  console.log("Primary Model:", primaryModel);
  console.log("Fallback Model:", fallbackModel);

  try {
    // 🔥 Try Primary AI
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
      // 🔥 Try Fallback AI
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
}