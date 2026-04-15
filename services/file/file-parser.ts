import { ParsedContent } from "@/types/file";

// ⚠️ OCR
import { extractTextFromImage } from "@/services/solve/ocr";

// ⚠️ AI summary
import { generateAIResponse } from "@/services/ai/ai.service";

type PdfParseResult = {
  text: string;
};

export async function parseFile(file: File): Promise<ParsedContent> {
  const fileType = file.type;

  let extractedText = "";

  // 📄 PDF Processing (FINAL CLEAN + TYPE SAFE)
  if (fileType === "application/pdf") {
    const buffer = Buffer.from(await file.arrayBuffer());

    // ✅ Now properly typed (no TS error)
    const { default: pdfParse } = await import(
      "pdf-parse/lib/pdf-parse.js"
    );

    const data: PdfParseResult = await pdfParse(buffer);

    extractedText = data.text;
  }

  // 🖼️ Image Processing
  else if (fileType.startsWith("image/")) {
    extractedText = await extractTextFromImage(file);
  }

  // 📄 Text fallback
  else {
    extractedText = await file.text();
  }

  // ✂️ Clean text
  extractedText = extractedText.trim().slice(0, 20000);

  // 🤖 Summary
  const summary = await generateAIResponse({
    prompt: `Summarize the following study content:\n\n${extractedText}`,
    type: "general",
  });

  return {
    text: extractedText,
    summary,
  };
}