"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import StudyPlanView from "@/components/tutor/study-plan-view";
import ProgressTracker from "@/components/tutor/progress-tracker";
import CoachingBox from "@/components/tutor/coaching-box";

import Spinner from "@/components/ui/spinner";
import Card from "@/components/ui/card";

import FileUpload from "@/components/file/file-upload";
import FileList from "@/components/file/file-list";

import { StudyPlan } from "@/types/tutor";
import { trackUserActivity } from "@/services/memory/client-tracking";

const mockPlan: StudyPlan = {
  goal: "Learn Python",
  duration: "30 days",
  topics: [
    { id: "1", title: "Python Basics" },
    { id: "2", title: "Data Types" },
    { id: "3", title: "Control Flow" },
    { id: "4", title: "Functions" },
    { id: "5", title: "OOP Basics" },
  ],
  dailyPlan: [
    { day: 1, tasks: ["Install Python", "Write first program"] },
    { day: 2, tasks: ["Learn variables", "Practice exercises"] },
    { day: 3, tasks: ["If-else statements", "Mini project"] },
    { day: 4, tasks: ["Loops", "Solve problems"] },
    { day: 5, tasks: ["Functions", "Practice coding"] },
  ],
  weeklyPlan: [
    { week: 1, focus: "Python Fundamentals" },
    { week: 2, focus: "Intermediate Concepts" },
  ],
};

export default function PlanPage() {
  const params = useParams();
  const planId = params?.planId as string;

  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);

  const userId = "temp-user";

  useEffect(() => {
    setTimeout(() => {
      setPlan(mockPlan);
      setLoading(false);
    }, 800);
  }, [planId]);

  useEffect(() => {
    if (!plan || !userId) return;

    trackUserActivity(userId, "tutor", plan.goal);
  }, [plan, userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <p className="text-red-400">Failed to load plan</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 flex flex-col gap-6 max-w-4xl mx-auto w-full overflow-x-hidden">

      {/* KNOWLEDGE PANEL */}
      <Card className="p-5 space-y-4 overflow-hidden">
        <div>
          <h2 className="text-lg font-semibold text-white">
            📚 Your Study Materials
          </h2>

          <p className="text-sm text-gray-400">
            Add or review your notes while following the plan
          </p>
        </div>

        <FileUpload userId={userId} />

        <FileList
          onSelectionChange={setSelectedFileIds}
        />

        {selectedFileIds.length > 0 && (
          <p className="text-xs text-cyan-400">
            {selectedFileIds.length} file(s) selected for plan context
          </p>
        )}
      </Card>

      {/* PLAN */}
      <StudyPlanView plan={plan} />
      <ProgressTracker plan={plan} />
      <CoachingBox plan={plan} />

    </div>
  );
}