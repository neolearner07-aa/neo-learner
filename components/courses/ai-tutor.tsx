"use client";

import { useState } from "react";

import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";

import { runAI } from "@/services/ai/orchestrator";

type AITutorProps = {
  title: string;
  content: string;
};

export default function AITutor({ title, content }: AITutorProps) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await runAI(
        "tutor",
        `${title}\n\n${content}\n\nQuestion: ${question}`
      );

      setResponse(res);
    } catch (error) {
      console.error("AI Tutor Error:", error);
      setResponse("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Badge>AI Tutor</Badge>

      <Card className="flex flex-col gap-4">
        <Input
          placeholder="Ask anything about this lesson..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <Button onClick={handleAsk} disabled={loading}>
          {loading ? <Spinner /> : "Ask AI"}
        </Button>

        {response && (
          <div className="text-gray-300 border-t border-[var(--glass-border)] pt-3 whitespace-pre-wrap">
            {response}
          </div>
        )}
      </Card>
    </div>
  );
}