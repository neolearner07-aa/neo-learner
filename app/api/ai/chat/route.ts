import { NextRequest } from "next/server";
import OpenAI from "openai";
import { runAI } from "@/services/ai/orchestrator";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, type } = body;

    if (!message || typeof message !== "string") {
      return new Response("Invalid message", { status: 400 });
    }

    // 🔥 Try OpenAI Streaming FIRST
    try {
      const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        stream: true,
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      });

      const encoder = new TextEncoder();

      const readableStream = new ReadableStream({
        async start(controller) {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            controller.enqueue(encoder.encode(content));
          }
          controller.close();
        },
      });

      return new Response(readableStream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    } catch (streamError) {
      console.warn("Streaming failed, using fallback AI...");

      // 🔥 Fallback to orchestrator (Gemini or OpenAI normal)
      const response = await runAI(type || "general", message);

      return new Response(response, {
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }
  } catch (error: unknown) {
  let message = "Something went wrong";

  if (error instanceof Error) {
    console.error("API Error:", error.message);

    if (error.message.includes("quota")) {
      message = "AI service quota exceeded. Please try again later.";
    } else if (error.message.includes("failed")) {
      message = "AI service is currently unavailable.";
    } else {
      message = error.message;
    }
  } else {
    console.error("Unknown API Error:", error);
  }

  return new Response(
    JSON.stringify({
      success: false,
      error: message,
    }),
    {
      status: 500,
      headers: { "Content-Type": "application/json" },
    }
  );
  }
}