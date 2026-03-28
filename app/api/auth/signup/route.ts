import { NextResponse } from "next/server";
import { findUserByEmail, createUser } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // ✅ 1. Check empty fields
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // ✅ 2. Email validation
    if (!email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // ✅ 3. Password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // ✅ 4. Check existing user
    const existingUser = findUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // ✅ 5. Hash password
    const hashedPassword = await hashPassword(password);

    // ✅ 6. Create user
    createUser({
      id: Date.now().toString(),
      email,
      password: hashedPassword,
    });

    // ✅ 7. Safe response (no password)
    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    // ✅ 8. Generic error (no leak)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}