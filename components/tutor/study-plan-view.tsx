"use client";

import { StudyPlan } from "@/types/tutor";

import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";

type Props = {
  plan: StudyPlan;
};

export default function StudyPlanView({ plan }: Props) {
  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <Card>
        <h1 className="text-2xl font-bold text-white">{plan.goal}</h1>
        <p className="text-gray-400 mt-1">Duration: {plan.duration}</p>
      </Card>

      {/* Topics */}
      <Card>
        <Badge>Curriculum</Badge>

        <ul className="mt-4 flex flex-col gap-2">
          {plan.topics.map((topic) => (
            <li key={topic.id} className="text-gray-300">
              • {topic.title}
            </li>
          ))}
        </ul>
      </Card>

      {/* Daily Plan */}
      <Card>
        <Badge>Daily Plan</Badge>

        <div className="mt-4 flex flex-col gap-3">
          {plan.dailyPlan.map((day) => (
            <div key={day.day}>
              <p className="text-white font-semibold">Day {day.day}</p>
              <ul className="ml-4 text-gray-400 list-disc">
                {day.tasks.map((task, i) => (
                  <li key={i}>{task}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      {/* Weekly Plan */}
      <Card>
        <Badge>Weekly Plan</Badge>

        <div className="mt-4 flex flex-col gap-2">
          {plan.weeklyPlan.map((week) => (
            <p key={week.week} className="text-gray-300">
              Week {week.week}: {week.focus}
            </p>
          ))}
        </div>
      </Card>

    </div>
  );
}