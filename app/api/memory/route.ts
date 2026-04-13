import { NextRequest, NextResponse } from "next/server";
import { memorySchema } from "@/validators/memory";
import { trackActivity } from "@/services/memory/tracking.service";
import {
  getUserMemory,
  getWeakTopics,
  getStrongTopics,
} from "@/services/memory/memory.service";
import { getRecommendations } from "@/services/memory/recommendation.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = memorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    const { userId, type, topic, score } = parsed.data;

    await trackActivity(userId, type, topic, score);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to track activity" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    const [memory, weak, strong, recommendations] = await Promise.all([
      getUserMemory(userId),
      getWeakTopics(userId),
      getStrongTopics(userId),
      getRecommendations(userId),
    ]);

    return NextResponse.json({
      memory,
      weakTopics: weak,
      strongTopics: strong,
      recommendations,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch memory" },
      { status: 500 }
    );
  }
}