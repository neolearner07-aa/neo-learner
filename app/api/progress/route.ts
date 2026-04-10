export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]/route";

import { withErrorHandler } from "@/lib/error-handler";
import { successResponse, errorResponse } from "@/lib/api-response";

import { progressSchema } from "@/validators/progress";
import { updateProgressSchema } from "@/validators/progress";
import { rateLimit } from "@/lib/rate-limit";

import {
  getProgress,
  updateProgress,
} from "@/services/progress/progress.service";

/**
 * ✅ GET → Fetch progress
 */
export async function GET(req: Request) {
  return withErrorHandler(async () => {
    const session = await getServerSession(authOptions);

    // 🔐 Auth check
    if (!session || !session.user?.id) {
      return NextResponse.json(
        errorResponse("Unauthorized"),
        { status: 401 }
      );
    }

    const allowed = await rateLimit(session.user.id);

    if (!allowed) {
      return NextResponse.json(
        errorResponse("Too many requests"),
        { status: 429 }
      );
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        errorResponse("Course ID required"),
        { status: 400 }
      );
    }

    const progress = await getProgress(session.user.id, courseId);

    return NextResponse.json(
      successResponse(progress),
      { status: 200 }
    );
  });
}

/**
 * ✅ POST → Update progress
 */
export async function POST(req: Request) {
  return withErrorHandler(async () => {
    const session = await getServerSession(authOptions);

    // 🔐 Auth check
    if (!session || !session.user?.id) {
      return NextResponse.json(
        errorResponse("Unauthorized"),
        { status: 401 }
      );
    }

    const body = await req.json();

    const validated = updateProgressSchema.parse(body);

    // 🔥 Service call
    const updated = await updateProgress(
      session.user.id,
      validated.courseId,
      validated.lessonId,
      validated.totalLessons
    );

    return NextResponse.json(
      successResponse(updated),
      { status: 200 }
    );
  });
}