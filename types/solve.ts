export type SolveResponse = {
  question: string;
  steps: string[];
  finalAnswer: string;
  explanation: string;
};
export type MultiSolveResponse = SolveResponse[];