export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]/route";

import { withErrorHandler } from "@/lib/error-handler";
import { successResponse, errorResponse } from "@/lib/api-response";

import { incrementAIUsage } from "@/services/ai/ai-usage.service";

export async function POST() {
  return withErrorHandler(async () => {
    const session = await getServerSession(authOptions);

    // 🔐 Auth check
    if (!session || !session.user?.id) {
      return NextResponse.json(
        errorResponse("Unauthorized"),
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 🔥 Use service (NO Prisma here)
    await incrementAIUsage(userId);

    return NextResponse.json(
      successResponse({ message: "AI usage updated" }),
      { status: 200 }
    );
  });
}