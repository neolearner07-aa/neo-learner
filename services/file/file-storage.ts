import fs from "fs";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads");

// Ensure upload directory exists
export function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

// Generate secure unique filename
function generateFileName(originalName: string) {
  const ext = path.extname(originalName);
  const uniqueId = crypto.randomBytes(16).toString("hex");
  return `${uniqueId}${ext}`;
}

// Save file and return URL
export async function saveFile(file: File): Promise<string> {
  ensureUploadDir();

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = generateFileName(file.name);
  const filePath = path.join(UPLOAD_DIR, filename);

  await fs.promises.writeFile(filePath, buffer);

  // Public URL path
  return `/uploads/${filename}`;
}