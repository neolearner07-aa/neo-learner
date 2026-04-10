import { prisma } from "@/lib/prisma";
import { Prisma, Course } from "@prisma/client";
import { getCache, setCache } from "@/lib/cache";

/**
 * Create Course (NO CACHE HERE — WRITE OPERATION)
 */
export const createCourse = async ({
  title,
  description,
  content,
  userId,
}: {
  title: string;
  description: string;
  content: Prisma.InputJsonValue;
  userId: string;
}) => {
  const newCourse = await prisma.course.create({
    data: {
      title,
      description,
      content,
      createdById: userId,
    },
  });

  /**
   * ⚠️ IMPORTANT: Invalidate cache after creating course
   */
  const cacheKey = `courses:user:${userId}`;
  await setCache(cacheKey, null, 1); // expire immediately

  return newCourse;
};

/**
 * Get Courses By User (CACHED)
 */
export const getCoursesByUser = async (
  userId: string
): Promise<Course[]> => {
  const cacheKey = `courses:user:${userId}`;

  // 1. Check cache
  const cached = await getCache<Course[]>(cacheKey);

  if (cached) {
    console.log("⚡ Cache HIT: User Courses");
    return cached;
  }

  console.log("🐢 Cache MISS: Fetching from DB");

  // 2. Fetch from DB
  const courses = await prisma.course.findMany({
    where: {
      createdById: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // 3. Store in cache (TTL: 1 hour)
  await setCache(cacheKey, courses, 3600);

  return courses;
};