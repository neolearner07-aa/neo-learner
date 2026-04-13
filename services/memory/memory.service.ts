import { prisma } from "@/lib/prisma";

export async function getUserMemory(userId: string) {
  return prisma.userMemory.findMany({
    where: { userId },
    orderBy: { lastAccessed: "desc" },
  });
}

export async function getWeakTopics(userId: string) {
  return prisma.userMemory.findMany({
    where: {
      userId,
      proficiency: {
        lt: 0.5,
      },
    },
  });
}

export async function getStrongTopics(userId: string) {
  return prisma.userMemory.findMany({
    where: {
      userId,
      proficiency: {
        gt: 0.75,
      },
    },
  });
}