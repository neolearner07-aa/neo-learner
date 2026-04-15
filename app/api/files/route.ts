import { NextRequest, NextResponse } from "next/server";

import { uploadFile, getUserFiles } from "@/services/file/file.service";
import { validateFile, validateUserId } from "@/validators/file";
import { prisma } from "@/lib/prisma";

// 📤 Upload File
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file");
    const userId = formData.get("userId");

    // 🔒 Basic validation
    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "Invalid file" },
        { status: 400 }
      );
    }

    if (typeof userId !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid userId" },
        { status: 400 }
      );
    }

    // ✅ Strict validation
    validateFile(file);
    validateUserId(userId);

    const result = await uploadFile(userId, file);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    console.error("File Upload Error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Upload failed",
      },
      { status: 400 }
    );
  }
}

// 📥 Get Files
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (typeof userId !== "string") {
      throw new Error("Invalid userId");
    }

    validateUserId(userId);

    const files = await getUserFiles(userId);

    return NextResponse.json({
      success: true,
      data: files,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch files",
      },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const fileId = searchParams.get("fileId") as string;
    const userId = searchParams.get("userId") as string;

    if (!fileId || !userId) {
      return Response.json(
        { error: "Missing fileId or userId" },
        { status: 400 }
      );
    }

    // ✅ Delete only user's file (security)
    await prisma.userFile.deleteMany({
      where: {
        id: fileId,
        userId,
      },
    });

    return Response.json({ success: true });
  } catch (error: unknown) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Delete failed",
      },
      { status: 400 }
    );
  }
}