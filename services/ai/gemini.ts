import { GoogleGenerativeAI } from "@google/generative-ai";

// Create Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * Gemini Chat Function
 */
export async function geminiChat(prompt: string): Promise<string> {
  try {
    // Use latest recommended model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(prompt);

    const response = result.response;
    const text = response.text();

    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    return text;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Gemini Error:", error.message);
    } else {
      console.error("Unknown Gemini Error:", error);
    }

    throw new Error("Failed to fetch response from Gemini");
  }
}
