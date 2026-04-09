import { NextRequest } from "next/server";
import OpenAI from "openai";

import { runAI } from "@/services/ai/orchestrator";

import { withErrorHandler } from "@/lib/error-handler";
import { errorResponse } from "@/lib/api-response";

import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// ✅ Match EXACT AIType
const chatSchema = z.object({
  message: z.string().min(1, "Message is required"),
  type: z
    .enum(["general", "tutor", "learning", "solve", "arena", "course"])
    .optional(),
});

export async function POST(req: NextRequest) {
  return withErrorHandler(async () => {
    const body = await req.json();

    // ✅ Validate input
    const validated = chatSchema.parse(body);
    const { message, type } = validated;

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

      // 🔥 Fallback to orchestrator
      const response = await runAI(type || "general", message);

      return new Response(response, {
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }
  });
}