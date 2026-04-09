export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]/route";

import { withErrorHandler } from "@/lib/error-handler";
import { successResponse, errorResponse } from "@/lib/api-response";

import { rewardCredits } from "@/services/ai/ai-reward.service";

/**
 * 🎁 Reward Credits (Ad System)
 */
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

    const result = await rewardCredits(session.user.id);

    return NextResponse.json(
      successResponse(result),
      { status: 200 }
    );
  });
}