import OpenAI from "openai";

/**
 * Basic Chat Function
 * Sends user message to OpenAI and returns response
 */
export async function openaiChat(prompt: string): Promise<string> {
  try {
    // ✅ Initialize ONLY when needed
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is missing");
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    return content;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("OpenAI Error:", error.message);
    } else {
      console.error("Unknown OpenAI Error:", error);
    }

    throw new Error("Failed to fetch response from OpenAI");
  }
}