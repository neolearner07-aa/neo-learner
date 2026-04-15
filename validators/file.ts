const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "text/plain",
];

export function validateFile(file: File): void {
  if (!file) {
    throw new Error("No file provided");
  }

  if (typeof file.type !== "string" || !file.type) {
    throw new Error("Invalid file type");
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Unsupported file type");
  }

  if (typeof file.size !== "number" || file.size <= 0) {
    throw new Error("Invalid file size");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size exceeds 5MB limit");
  }
}

export function validateUserId(userId: string): void {
  if (!userId || typeof userId !== "string" || userId.trim().length === 0) {
    throw new Error("Invalid user ID");
  }
}