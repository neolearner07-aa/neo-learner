// services/ai/ai-reward.service.ts

import { prisma } from "@/lib/prisma";

export async function rewardCredits(userId: string) {
  const usage = await prisma.aIUsage.findFirst({
    where: { userId },
  });

  // 🧠 First-time user
  if (!usage) {
    return await prisma.aIUsage.create({
      data: {
        userId,
        count: 0,
        credits: 3,
      },
    });
  }

  // ✅ Add credits
  return await prisma.aIUsage.update({
    where: { id: usage.id },
    data: {
      credits: {
        increment: 3,
      },
    },
  });
}