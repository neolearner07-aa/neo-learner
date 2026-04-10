import { NextResponse } from "next/server";
import { generateFeed } from "@/services/feed/feed-generator";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const topic = searchParams.get("topic") || undefined;

    const feed = await generateFeed(topic);

    return NextResponse.json(feed);
  } catch (error) {
    console.error("Feed API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate feed" },
      { status: 500 }
    );
  }
}