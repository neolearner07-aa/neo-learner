import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

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
  return await prisma.course.create({
    data: {
      title,
      description,
      content,
      createdById: userId,
    },
  });
};

export const getCoursesByUser = async (userId: string) => {
  return await prisma.course.findMany({
    where: {
      createdById: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};