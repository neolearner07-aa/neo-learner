import { prisma } from "@/lib/prisma";

/**
 * Get progress for a user + course
 */
export async function getProgress(userId: string, courseId: string) {
  return await prisma.progress.findFirst({
    where: {
      userId,
      courseId,
    },
  });
}

/**
 * Update progress
 */
export async function updateProgress(
  userId: string,
  courseId: string,
  lessonId: string,
  totalLessons: number
) {
  const existing = await prisma.progress.findFirst({
    where: { userId, courseId },
  });

  let completedLessons: string[] = [];

  if (existing?.completedLessons) {
    completedLessons = existing.completedLessons as string[];
  }

  // ✅ Avoid duplicates
  if (!completedLessons.includes(lessonId)) {
    completedLessons.push(lessonId);
  }

  const progressPercent = Math.floor(
    (completedLessons.length / totalLessons) * 100
  );

  return await prisma.progress.upsert({
    where: {
      id: existing?.id || "",
    },
    update: {
      completedLessons,
      progressPercent,
    },
    create: {
      userId,
      courseId,
      completedLessons,
      progressPercent,
    },
  });
}