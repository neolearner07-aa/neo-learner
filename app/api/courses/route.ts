export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]/route";

import { withErrorHandler } from "@/lib/error-handler";
import { successResponse, errorResponse } from "@/lib/api-response";

import { createCourseSchema } from "@/validators/course";
import { generateAndSaveLearningModule } from "@/services/learn/learn-generator";
import { rateLimit } from "@/lib/rate-limit";

type CourseRequestBody = {
  topic: string;
  selectedFileIds?: string[];
};

export async function POST(req: Request) {
  return withErrorHandler(async () => {
    const session = await getServerSession(authOptions);

    // 🔐 Auth Check
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

    const body = (await req.json()) as CourseRequestBody;

    // ✅ NEW: Extract selectedFileIds (IMPORTANT)
    const { selectedFileIds } = body;

    // ✅ Zod Validation
    const validatedData = createCourseSchema.parse(body);

    // 🔥 Service Call (UPDATED)
    const course = await generateAndSaveLearningModule(
      validatedData.topic,
      session.user.id,
      selectedFileIds // ✅ CRITICAL ADDITION
    );

    // ✅ Standard Response
    return NextResponse.json(
      successResponse(course),
      { status: 201 }
    );
  });
}