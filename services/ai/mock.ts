/**
 * Mock AI (Development Mode)
 * Returns structured JSON for testing
 */

export async function mockAI(prompt: string): Promise<string> {
  await new Promise((res) => setTimeout(res, 500));

  // Extract topic (basic)
  const topic = prompt.split("for:")?.[1]?.trim() || "Sample Topic";

  return JSON.stringify({
    title: `${topic} Course`,
    description: `Learn ${topic} from beginner to advanced level.`,
    modules: [
      {
        title: "Introduction",
        lessons: [
          {
            title: `What is ${topic}?`,
            content: `${topic} is a fundamental concept. This lesson introduces the basics in a simple way.`,
          },
          {
            title: `Why learn ${topic}?`,
            content: `Understanding ${topic} is important for real-world applications and problem solving.`,
          },
        ],
      },
      {
        title: "Core Concepts",
        lessons: [
          {
            title: `${topic} Basics`,
            content: `In this lesson, we explore the core principles of ${topic}.`,
          },
          {
            title: `Advanced ${topic}`,
            content: `This lesson dives deeper into advanced topics and real-world usage.`,
          },
        ],
      },
    ],
  });
}