"use client";

import React from "react";
import Card from "@/components/ui/card";
import { SolveResponse } from "@/types/solve";

type SolutionViewProps = {
  solutions: SolveResponse[];
  rawResponse: string | null;
};

export default function SolutionView({
  solutions,
  rawResponse,
}: SolutionViewProps) {
  if (!solutions.length && !rawResponse) return null;

  if (solutions.length === 0 && !rawResponse) return null;

return (
  <>
    {solutions.map((solution, idx) => (
      <Card key={idx}>
        <div className="space-y-4 text-white text-sm">
          
          <div>
            <h2 className="text-lg font-semibold text-cyan-400">
              Question {idx + 1}
            </h2>
            <p>{solution.question}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-cyan-400">
              Steps
            </h2>
            <ol className="list-decimal list-inside space-y-1">
              {solution.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-cyan-400">
              Final Answer
            </h2>
            <p>{solution.finalAnswer}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-cyan-400">
              Explanation
            </h2>
            <p>{solution.explanation}</p>
          </div>

        </div>
      </Card>
    ))}

    {rawResponse && (
      <Card>
        <pre className="text-white whitespace-pre-wrap text-sm">
          {rawResponse}
        </pre>
      </Card>
    )}
  </>
);
}