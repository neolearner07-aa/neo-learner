/**
 * Mock AI (Development Mode)
 * Simulates different AI behaviors
 */

export async function mockAI(prompt: string): Promise<string> {
  await new Promise((res) => setTimeout(res, 500));

  // 🧠 Detect if it's asking for study plan (JSON)
  if (prompt.toLowerCase().includes("study plan")) {
    return JSON.stringify({
      goal: "Learn Python",
      duration: "30 days",

      topics: [
        { id: "1", title: "Python Basics" },
        { id: "2", title: "Data Types" },
        { id: "3", title: "Control Flow" },
        { id: "4", title: "Functions" },
        { id: "5", title: "OOP Basics" }
      ],

      dailyPlan: [
        { day: 1, tasks: ["Install Python", "Write first program"] },
        { day: 2, tasks: ["Variables", "Practice problems"] },
        { day: 3, tasks: ["Conditions", "Mini project"] },
        { day: 4, tasks: ["Loops", "Exercises"] },
        { day: 5, tasks: ["Functions", "Practice coding"] }
      ],

      weeklyPlan: [
        { week: 1, focus: "Fundamentals" },
        { week: 2, focus: "Intermediate Concepts" }
      ]
    });
  }

  // 🧠 Otherwise → coaching / general response
  return `
Focus on your weak topics and revise them carefully.

Try to:
- Spend more time on difficult concepts
- Practice daily
- Revise regularly

Consistency is key to success.
`;
}