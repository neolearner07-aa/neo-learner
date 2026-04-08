import { prisma } from "@/lib/prisma";

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const createUser = async ({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name?: string;
}) => {
  return await prisma.user.create({
    data: {
      email,
      password,
      name,
    },
  });
};