"use client";

import { useState, useEffect } from "react";

import CoursePlayer from "@/components/courses/course-player";
import Spinner from "@/components/ui/spinner";
import Card from "@/components/ui/card";

import { Course } from "@/types/course";
import { trackUserActivity } from "@/services/memory/client-tracking"; // ✅ NEW

export default function CoursePage() {
  const [course] = useState<Course | null>(() => {
    try {
      const stored = localStorage.getItem("currentCourse");
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Failed to load course:", error);
      return null;
    }
  });

  // ⚠️ Replace later
  const userId = "temp-user";

  // ✅ ✅ MEMORY TRACKING (COURSE VIEW)
  useEffect(() => {
    if (!course || !userId) return;

    trackUserActivity(userId, "course", course.title);
  }, [course, userId]);

  if (!course) {
    return (
      <div className="p-6 flex justify-center items-center">
        <Card className="flex items-center gap-3">
          <Spinner />
          <span className="text-gray-300">
            Loading course...
          </span>
        </Card>
      </div>
    );
  }

  return <CoursePlayer course={course} />;
}