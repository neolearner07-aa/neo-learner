import { prisma } from "@/lib/prisma";

export async function trackActivity(
  userId: string,
  type: string,
  topic: string,
  score?: number
) {
  try {
    // 1. Store activity
    await prisma.userActivity.create({
      data: {
        userId,
        type,
        topic,
        score,
      },
    });

    // 2. Check existing memory
    const existing = await prisma.userMemory.findUnique({
      where: {
        userId_topic: {
          userId,
          topic,
        },
      },
    });

    if (existing) {
      const newProficiency =
        score !== undefined && score !== null
          ? (existing.proficiency + score) / 2
          : existing.proficiency;

      await prisma.userMemory.update({
        where: {
          userId_topic: {
            userId,
            topic,
          },
        },
        data: {
          interactions: existing.interactions + 1,
          proficiency: newProficiency,
        },
      });
    } else {
      await prisma.userMemory.create({
        data: {
          userId,
          topic,
          proficiency: score ?? 0,
          interactions: 1,
        },
      });
    }
  } catch (error) {
    console.error("Tracking Error:", error);
    throw new Error("Failed to track activity");
  }
}