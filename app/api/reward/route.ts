export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

/**
 * 🎁 Reward Credits (Ad System)
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    // ❌ Not logged in
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 🧠 Find usage record
    const usage = await prisma.aIUsage.findFirst({
      where: { userId },
    });

    // 🧠 If not exists → create
    if (!usage) {
      const newUsage = await prisma.aIUsage.create({
        data: {
          userId,
          count: 0,
          credits: 3, // 🎁 reward credits
        },
      });

      return NextResponse.json(newUsage);
    }

    // ✅ Add credits
    const updated = await prisma.aIUsage.update({
      where: { id: usage.id },
      data: {
        credits: {
          increment: 3, // 🎁 reward amount
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Reward Error:", error);

    return NextResponse.json(
      { error: "Failed to reward credits" },
      { status: 500 }
    );
  }
}