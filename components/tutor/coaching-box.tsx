"use client";

import { useEffect, useState } from "react";

import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Spinner from "@/components/ui/spinner";

import { StudyPlan } from "@/types/tutor";
import { getWeakTopics } from "@/services/tutor/progress";
import { runAI } from "@/services/ai/orchestrator";

type Props = {
  plan: StudyPlan;
};

export default function CoachingBox({ plan }: Props) {
  const [advice, setAdvice] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateAdvice = async () => {
      try {
        // 🧠 Get weak topics
        const weakTopicIds = getWeakTopics(plan.topics?.map(t => t.id) || []);

        const weakTitles = plan.topics
          .filter(t => weakTopicIds.includes(t.id))
          .map(t => t.title)
          .join(", ");

        const input = `
User Goal: ${plan.goal}
Weak Topics: ${weakTitles}

Give short actionable study advice.
`;

        // 🤖 Call AI
        const response = await runAI("general", input);

        setAdvice(response);
      } catch (error) {
        console.error("Coaching Error:", error);
        setAdvice("Unable to generate advice.");
      } finally {
        setLoading(false);
      }
    };

    generateAdvice();
  }, [plan]);

  return (
    <Card>
      <Badge>AI Coach</Badge>

      <div className="mt-4">
        {loading ? (
          <div className="flex items-center gap-2">
            <Spinner />
            <span className="text-gray-400">Analyzing your progress...</span>
          </div>
        ) : (
          <p className="text-gray-300 whitespace-pre-line">{advice}</p>
        )}
      </div>
    </Card>
  );
}