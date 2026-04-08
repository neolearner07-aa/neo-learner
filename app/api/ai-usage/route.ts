import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

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

    // 🧠 Check existing usage
    const existing = await prisma.aIUsage.findUnique({
      where: { userId },
    });

    // 🆕 First time usage
    if (!existing) {
      const usage = await prisma.aIUsage.create({
        data: {
          userId,
          count: 1,
          lastUsed: new Date(),
        },
      });

      return NextResponse.json(usage);
    }

    // 🔁 Increment usage
    const updated = await prisma.aIUsage.update({
      where: { userId },
      data: {
        count: existing.count + 1,
        lastUsed: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("AI Usage Error:", error);

    return NextResponse.json(
      { error: "Failed to track AI usage" },
      { status: 500 }
    );
  }
}