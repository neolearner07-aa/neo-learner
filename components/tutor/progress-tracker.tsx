"use client";

import { useEffect, useState } from "react";

import { StudyPlan } from "@/types/tutor";
import {
  getProgress,
  toggleTopic,
  toggleDay,
  ProgressData,
} from "@/services/tutor/progress";

import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";

type Props = {
  plan: StudyPlan;
};

export default function ProgressTracker({ plan }: Props) {
  const [progress, setProgress] = useState<ProgressData>(() => {
    return getProgress();
    });

  /**
   * Handle topic click
   */
  const handleTopicClick = (id: string) => {
    const updated = toggleTopic(id);
    setProgress(updated);
  };

  /**
   * Handle day click
   */
  const handleDayClick = (day: number) => {
    const updated = toggleDay(day);
    setProgress(updated);
  };

  /**
   * Progress percentage
   */
  const topicProgress =
    (progress.completedTopics.length / plan.topics.length) * 100;

  const dayProgress =
    (progress.completedDays.length / plan.dailyPlan.length) * 100;

  return (
    <div className="flex flex-col gap-6">

      {/* Topic Progress */}
      <Card>
        <Badge>Topic Progress</Badge>

        <div className="mt-4">
          <div className="w-full h-2 bg-gray-700 rounded-full">
            <div
              className="h-2 bg-cyan-400 rounded-full"
              style={{ width: `${topicProgress}%` }}
            />
          </div>

          <p className="text-sm text-gray-400 mt-2">
            {progress.completedTopics.length} / {plan.topics.length} completed
          </p>
        </div>

        {/* Topics List */}
        <ul className="mt-4 flex flex-col gap-2">
          {plan.topics.map((topic) => {
            const completed = progress.completedTopics.includes(topic.id);

            return (
              <li
                key={topic.id}
                onClick={() => handleTopicClick(topic.id)}
                className={`
                  cursor-pointer px-3 py-2 rounded-lg border
                  ${
                    completed
                      ? "bg-green-500/10 border-green-400 text-green-400"
                      : "border-[var(--glass-border)] text-gray-300 hover:bg-white/10"
                  }
                `}
              >
                {topic.title}
              </li>
            );
          })}
        </ul>
      </Card>

      {/* Day Progress */}
      <Card>
        <Badge>Daily Progress</Badge>

        <div className="mt-4">
          <div className="w-full h-2 bg-gray-700 rounded-full">
            <div
              className="h-2 bg-cyan-400 rounded-full"
              style={{ width: `${dayProgress}%` }}
            />
          </div>

          <p className="text-sm text-gray-400 mt-2">
            {progress.completedDays.length} / {plan.dailyPlan.length} days completed
          </p>
        </div>

        {/* Days List */}
        <ul className="mt-4 flex flex-col gap-2">
          {plan.dailyPlan.map((day) => {
            const completed = progress.completedDays.includes(day.day);

            return (
              <li
                key={day.day}
                onClick={() => handleDayClick(day.day)}
                className={`
                  cursor-pointer px-3 py-2 rounded-lg border
                  ${
                    completed
                      ? "bg-green-500/10 border-green-400 text-green-400"
                      : "border-[var(--glass-border)] text-gray-300 hover:bg-white/10"
                  }
                `}
              >
                Day {day.day}
              </li>
            );
          })}
        </ul>
      </Card>

    </div>
  );
}