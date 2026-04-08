import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]/route";
import { generateAndSaveLearningModule } from "@/services/learn/learn-generator";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // ❌ Not logged in
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    // 🔥 Generate + Save
    const course = await generateAndSaveLearningModule(
      topic,
      session.user.id
    );

    // ✅ IMPORTANT: return full course (includes id)
    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to generate course" },
      { status: 500 }
    );
  }
}