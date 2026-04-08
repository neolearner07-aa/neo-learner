import { prisma } from "@/lib/prisma";

/**
 * Increment AI Usage Count
 */
export async function incrementAIUsage(userId: string) {
  try {
    const existing = await prisma.aIUsage.findFirst({
      where: { userId },
    });

    // 🧠 First-time user
    if (!existing) {
      await prisma.aIUsage.create({
        data: {
          userId,
          count: 1,
          credits: 2, // after 1 usage
        },
      });
      return;
    }

    // ✅ Increment usage
    await prisma.aIUsage.update({
      where: { id: existing.id }, // 🔥 IMPORTANT (NOT userId)
      data: {
        count: { increment: 1 },
      },
    });
  } catch (error) {
    console.error("Increment AI Usage Error:", error);
  }
}