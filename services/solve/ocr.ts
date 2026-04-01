import Tesseract from "tesseract.js";

/**
 * Convert image to canvas (fix unsupported formats like AVIF)
 */
async function convertToSupportedFormat(file: File): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      resolve(canvas);
    };

    img.onerror = () => reject(new Error("Image load failed"));

    img.src = URL.createObjectURL(file);
  });
}

/**
 * Extract text from image using OCR
 */
export async function extractTextFromImage(file: File): Promise<string> {
  try {
    if (!file) {
      throw new Error("No image provided");
    }

    // 🧠 Convert ANY image → canvas (KEY FIX)
    const canvas = await convertToSupportedFormat(file);

    const result = await Tesseract.recognize(canvas, "eng", {
      logger: (m) => console.log(m),
    });

    const text = result.data.text;

    if (!text) {
      throw new Error("No text detected");
    }

    return text.trim();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("OCR Error:", error.message);
    } else {
      console.error("Unknown OCR Error:", error);
    }

    throw new Error("Failed to extract text from image");
  }
}