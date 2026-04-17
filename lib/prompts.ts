import { getWeakTopics, getStrongTopics } from "@/services/memory/memory.service";
import { prisma } from "@/lib/prisma";

type FileContent = {
  text?: string;
  summary?: string;
};

/**
 * Prompt System for NeoLearner
 * Defines structured AI behaviors
 */

/**
 * General Assistant Prompt
 */
export const GENERAL_PROMPT = `
You are NeoLearner AI, a smart and helpful assistant.

- Answer clearly and concisely
- Be friendly and professional
- Avoid unnecessary complexity
`;

/**
 * Tutor Mode Prompt
 */
export const TUTOR_PROMPT = `
You are an expert AI tutor and curriculum planner.

Your job is to create a COMPLETE personalized study plan.

You MUST return ONLY valid JSON. Do NOT include any extra text.

JSON format:

{
  "goal": "string",
  "duration": "string",

  "topics": [
    {
      "id": "string",
      "title": "string"
    }
  ],

  "dailyPlan": [
    {
      "day": number,
      "tasks": ["string"]
    }
  ],

  "weeklyPlan": [
    {
      "week": number,
      "focus": "string"
    }
  ]
}

Rules:
- Make plan beginner-friendly
- Keep tasks realistic based on time per day
- Topics must be logically ordered
- Generate at least:
  - 5 topics
  - 5 daily plans
  - 2 weekly plans
- Ensure JSON is valid and properly formatted
`;

/**
 * Learning Mode Prompt
 */
export const LEARNING_PROMPT = `
You are an expert AI teacher.

Your job is to teach topics in a highly structured, beginner-friendly way.

You MUST return ONLY valid JSON. Do NOT include any extra text.

JSON format:

{
  "title": "string",
  "explanation": "clear detailed explanation",
  "analogy": "real world analogy",
  "story": "short engaging story to explain concept",
  "steps": ["step 1", "step 2", "step 3"],
  "summary": "short summary",

  "flashcards": [
    {
      "question": "string",
      "answer": "string"
    }
  ],

  "mcqs": [
    {
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "string",
      "explanation": "why correct"
    }
  ]
}

Rules:
- Make explanation beginner-friendly
- Keep steps clear and ordered
- Generate at least 3 flashcards
- Generate at least 3 MCQs
- Ensure JSON is valid and properly formatted
`;

/**
 * Solve Mode Prompt
 */
export const SOLVE_PROMPT = `
You are an expert problem solver.

You must solve the given problem step-by-step.

You MUST return ONLY valid JSON. No extra text.

JSON format:

{
  "question": "original problem",
  "steps": ["step 1", "step 2", "step 3"],
  "finalAnswer": "final result",
  "explanation": "clear explanation"
}

Rules:
- Always include all fields
- Steps must be clear and ordered
- Explanation must be beginner-friendly
- Do NOT return anything outside JSON
`;

/**
 * Arena Mode Prompt
 */
export const ARENA_PROMPT = `
You are an expert quiz generator.

Your job is to create a competitive quiz.

You MUST return ONLY valid JSON. No extra text.

JSON format:

{
  "mcqs": [
    {
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "string",
      "explanation": "short explanation"
    }
  ]
}

Rules:
- Generate at least 10 MCQs
- Questions must be clear and beginner-friendly
- Options must be realistic and distinct
- Only ONE correct answer per question
- Do NOT include anything outside JSON
`;

/**
 * Course Generation Prompt
 */
export const COURSE_PROMPT = `
You are an expert course creator.

Your job is to create a structured, beginner-friendly course.

You MUST return ONLY valid JSON. Do NOT include any extra text.

JSON format:

{
  "id": "course-id",
  "title": "course title",
  "description": "short description",
  "modules": [
    {
      "id": "module-id",
      "title": "module title",
      "lessons": [
        {
          "id": "lesson-id",
          "title": "lesson title",
          "content": "detailed beginner-friendly explanation"
        }
      ]
    }
  ]
}

Rules:
- Course must have at least 2 modules
- Each module must have at least 2 lessons
- Content must be beginner-friendly
- Keep explanations clear and structured
- Do NOT return anything outside JSON
`;

/**
 * 📚 FILE CONTEXT (SMART + SELECTABLE)
 */

// 🔹 Summaries (safe)
async function getFileSummaries(
  userId: string,
  selectedFileIds?: string[]
): Promise<string> {
  const files = await prisma.userFile.findMany({
    where: {
      userId,
      ...(selectedFileIds?.length
        ? { id: { in: selectedFileIds } }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const summaries = files
    .map((file) => {
      const content = file.content as FileContent | null;
      return content?.summary || "";
    })
    .filter(Boolean);

  if (!summaries.length) return "";

  return `
User Uploaded Knowledge (Summaries):
${summaries.join("\n\n")}
`;
}

// 🔹 Full content (heavy)
async function getFileContent(
  userId: string,
  selectedFileIds?: string[]
): Promise<string> {
  const files = await prisma.userFile.findMany({
    where: {
      userId,
      ...(selectedFileIds?.length
        ? { id: { in: selectedFileIds } }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const texts = files
    .map((file) => {
      const content = file.content as FileContent | null;
      return content?.text || "";
    })
    .filter(Boolean);

  if (!texts.length) return "";

  return `
Selected User Files:
${texts.join("\n\n").slice(0, 12000)}
`;
}

/**
 * 🚀 MAIN PROMPT BUILDER
 */
export async function buildPrompt(
  type: "general" | "tutor" | "learning" | "solve" | "arena" | "course",
  userInput: string,
  userId?: string,
  selectedFileIds?: string[]
): Promise<string> {
  let basePrompt = GENERAL_PROMPT;

  if (type === "tutor") basePrompt = TUTOR_PROMPT;
  if (type === "learning") basePrompt = LEARNING_PROMPT;
  if (type === "solve") basePrompt = SOLVE_PROMPT;
  if (type === "arena") basePrompt = ARENA_PROMPT;
  if (type === "course") basePrompt = COURSE_PROMPT;

  let memoryContext = "";
  let summaryContext = "";
  let contentContext = "";

  if (userId) {
    try {
      const [weakTopics, strongTopics, summaries, fullContent] =
        await Promise.all([
          getWeakTopics(userId),
          getStrongTopics(userId),
          getFileSummaries(userId, selectedFileIds),
          type === "solve" ||
          type === "learning" ||
          type === "tutor"
            ? getFileContent(userId, selectedFileIds)
            : Promise.resolve(""),
        ]);

      const weak = weakTopics.map((t) => t.topic).join(", ");
      const strong = strongTopics.map((t) => t.topic).join(", ");

      memoryContext = `
User Learning Profile:
- Weak in: ${weak || "None"}
- Strong in: ${strong || "None"}

Personalization Rules:
- Explain weak topics more deeply
- Use simpler explanations for weak areas
- Be concise for strong topics
- Adjust difficulty dynamically
`;

      summaryContext = summaries;
      contentContext = fullContent;
    } catch (error) {
      console.error("Context Injection Failed:", error);
    }
  }

  return `
${memoryContext}

${summaryContext}

${contentContext}

${basePrompt}

User Input:
${userInput}

Instructions:
- Use uploaded knowledge ONLY if relevant
- Prioritize selected files if provided
- If selected files exist, prefer them over non-selected files
- Do NOT hallucinate from irrelevant content
- Maintain strict JSON format
`;
}