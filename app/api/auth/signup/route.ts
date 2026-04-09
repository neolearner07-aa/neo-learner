import { NextResponse } from "next/server";

import { withErrorHandler } from "@/lib/error-handler";
import { successResponse, errorResponse } from "@/lib/api-response";

import { signupSchema } from "@/validators/auth";

import {
  findUserByEmail,
  createUser,
} from "@/services/auth/user.service";

import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  return withErrorHandler(async () => {
    const body = await req.json();

    // ✅ Zod Validation
    const validatedData = signupSchema.parse(body);

    const { email, password } = validatedData;

    // 🔍 Check existing user
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        errorResponse("User already exists"),
        { status: 400 }
      );
    }

    // 🔐 Hash password
    const hashedPassword = await hashPassword(password);

    // 💾 Create user
    await createUser({
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      successResponse({ message: "User created successfully" }),
      { status: 201 }
    );
  });
}