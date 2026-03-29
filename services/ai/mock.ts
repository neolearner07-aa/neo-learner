/**
 * Mock AI (Development Mode)
 * Returns fake responses to save API cost
 */

export async function mockAI(prompt: string): Promise<string> {
  // Simulate delay (like real AI)
  await new Promise((res) => setTimeout(res, 500));

  return `🤖 Mock AI Response:

You said:
"${prompt}"

This is a simulated response for development mode.
No API credits were used.
`;
}