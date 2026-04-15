import { prisma } from "@/lib/prisma";
import { saveFile } from "./file-storage";
import { parseFile } from "./file-parser";
import { FileRecord } from "@/types/file";

// ⚠️ Memory system (adjust path if needed)
import { trackActivity } from "@/services/memory/tracking.service";

function extractTopicFromContent(text: string): string {
  if (!text) return "general";

  const lower = text.toLowerCase();

  if (lower.includes("newton") || lower.includes("force")) return "Physics";
  if (lower.includes("algebra") || lower.includes("equation")) return "Mathematics";
  if (lower.includes("cell") || lower.includes("biology")) return "Biology";
  if (lower.includes("reaction") || lower.includes("chemical")) return "Chemistry";
  if (lower.includes("programming") || lower.includes("javascript")) return "Programming";

  return "general";
}

export async function uploadFile(userId: string, file: File): Promise<FileRecord> {
  // 1️⃣ Save file to storage
  const fileUrl = await saveFile(file);

  // 2️⃣ Parse file content
  const parsedContent = await parseFile(file);

  // 3️⃣ Extract topic (simple heuristic for now)
  const extractedTopic = extractTopicFromContent(parsedContent.text);

  // 4️⃣ Save to database
  const savedFile = await prisma.userFile.create({
    data: {
      userId,
      filename: file.name,
      fileType: file.type,
      fileUrl,
      content: parsedContent,
    },
  });

  // 5️⃣ Update memory system (VERY IMPORTANT)
  await trackActivity(userId, "file", extractedTopic);

  return {
    ...savedFile,
    content: parsedContent,
  };
}

// 📄 Get all user files
export async function getUserFiles(userId: string): Promise<FileRecord[]> {
  const files = await prisma.userFile.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return files.map((file) => ({
    ...file,
    content: file.content as FileRecord["content"], // safe cast (comes from DB)
  }));
}