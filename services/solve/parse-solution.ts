import { SolveResponse } from "@/types/solve";

/**
 * Safely parse AI response into structured object
 */
export function parseSolution(text: string): SolveResponse | null {
  try {
    // 🧠 Extract JSON from text
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);

    // ✅ Validate structure
    if (
      typeof parsed.question === "string" &&
      Array.isArray(parsed.steps) &&
      typeof parsed.finalAnswer === "string" &&
      typeof parsed.explanation === "string"
    ) {
      return parsed;
    }

    return null;
  } catch (error) {
    console.error("Parse Error:", error);
    return null;
  }
}