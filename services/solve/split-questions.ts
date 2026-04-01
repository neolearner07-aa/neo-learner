/**
 * Split input into multiple questions
 */
export function splitQuestions(input: string): string[] {
  return input
    .split(/\n+/) // split by new lines
    .map((q) => q.trim())
    .filter((q) => q.length > 0);
}