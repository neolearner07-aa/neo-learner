import crypto from "crypto";
import { getCache, setCache } from "@/lib/cache";

/**
 * Supported AI Types
 */
export type AIType =
  | "general"
  | "tutor"
  | "learning"
  | "solve"
  | "arena"
  | "course";

/**
 * Generate hash from prompt
 */
function hashPrompt(prompt: string): string {
  return crypto.createHash("sha256").update(prompt).digest("hex");
}

/**
 * MAIN AI FUNCTION (with caching)
 */
export async function generateAIResponse({
  prompt,
  type,
}: {
  prompt: string;
  type: AIType;
}): Promise<string> {
  const promptHash = hashPrompt(prompt);

  const cacheKey = `ai:${type}:${promptHash}`;

  // 1. Check cache
  const cached = await getCache<string>(cacheKey);

  if (cached) {
    console.log("⚡ AI Cache HIT");
    return cached;
  }

  console.log("🐢 AI Cache MISS → Calling AI");

  /**
   * ⚠️ TEMP MOCK (since you are in dev mode)
   * Replace later with OpenAI/Gemini call
   */
  const aiResponse = `
🤖 Mock AI Response:

You said:
"${prompt}"

This is a simulated response for development mode.
`;

  // 2. Store in cache (TTL: 1 hour)
  await setCache(cacheKey, aiResponse, 3600);

  return aiResponse;
}