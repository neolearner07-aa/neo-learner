import { prisma } from "@/lib/prisma";

/**
 * Check + Consume AI Credit
 */
export async function consumeAICredit(userId: string) {
  try {
    const usage = await prisma.aIUsage.findFirst({
      where: { userId },
    });

    // 🧠 First-time user
    if (!usage) {
      await prisma.aIUsage.create({
        data: {
          userId,
          count: 0,
          credits: 2, // 3 total - 1 consumed now
        },
      });

      return { allowed: true };
    }

    // ❌ No credits left
    if (usage.credits <= 0) {
      return { allowed: false };
    }

    // ✅ Consume credit
    await prisma.aIUsage.update({
      where: { id: usage.id }, // 🔥 IMPORTANT
      data: {
        credits: { decrement: 1 },
      },
    });

    return { allowed: true };
  } catch (error) {
    console.error("AI Credit Error:", error);
    return { allowed: false };
  }
}