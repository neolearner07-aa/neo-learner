"use client";

import { useState, useEffect } from "react";

import { Course } from "@/types/course";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import LessonContent from "@/components/courses/lesson-content";
import AITutor from "@/components/courses/ai-tutor";

import {
  getProgress,
  markLessonComplete,
  calculateProgress,
} from "@/services/courses/progress";

type CoursePlayerProps = {
  course: Course;
};

export default function CoursePlayer({ course }: CoursePlayerProps) {
  const [moduleIndex, setModuleIndex] = useState(0);
  const [lessonIndex, setLessonIndex] = useState(0);
  
  const [completedLessons, setCompletedLessons] = useState<string[]>(
    () => getProgress(course.id)
  );

  /**
   * Calculate total lessons
   */
  const totalLessons = course.modules.reduce(
    (acc, module) => acc + module.lessons.length,
    0
  );

  /**
   * Current lesson
   */
  const currentModule = course.modules[moduleIndex];
  const currentLesson = currentModule.lessons[lessonIndex];

  /**
   * Calculate progress %
   */
  const progress = calculateProgress(
    totalLessons,
    completedLessons.length
  );

  const isFirstLesson =
      moduleIndex === 0 && lessonIndex === 0;

    const isLastLesson =
      moduleIndex === course.modules.length - 1 &&
      lessonIndex ===
        course.modules[moduleIndex].lessons.length - 1;

  /**
   * Navigation - NEXT
   */
  const nextLesson = () => {
    const lessonId = currentLesson.id;

    // ✅ Mark lesson as complete
    markLessonComplete(course.id, lessonId);

    setCompletedLessons((prev) =>
      prev.includes(lessonId) ? prev : [...prev, lessonId]
    );

    // Navigation logic
    if (lessonIndex < currentModule.lessons.length - 1) {
      setLessonIndex((prev) => prev + 1);
    } else if (moduleIndex < course.modules.length - 1) {
      setModuleIndex((prev) => prev + 1);
      setLessonIndex(0);
    }
  };

  /**
   * Navigation - PREVIOUS
   */
  const prevLesson = () => {
    if (lessonIndex > 0) {
      setLessonIndex((prev) => prev - 1);
    } else if (moduleIndex > 0) {
      const prevModule = course.modules[moduleIndex - 1];
      setModuleIndex((prev) => prev - 1);
      setLessonIndex(prevModule.lessons.length - 1);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-6 p-6 max-w-7xl mx-auto">
      {/* Sidebar */}
      <div className="col-span-1">
        <Card className="flex flex-col gap-2">
          <h2 className="text-white font-semibold">Lessons</h2>

          {/* ✅ Progress */}
          <p className="text-sm text-gray-400">
            Progress: {progress}%
          </p>

          {course.modules.map((module, mIndex) => (
            <div key={module.id}>
              <p className="text-sm text-gray-400 mt-2">
                {module.title}
              </p>

              {module.lessons.map((lesson, lIndex) => {
                const isActive =
                  mIndex === moduleIndex && lIndex === lessonIndex;

                const isCompleted = completedLessons.includes(
                  lesson.id
                );

                return (
                  <div
                    key={lesson.id}
                    onClick={() => {
                      setModuleIndex(mIndex);
                      setLessonIndex(lIndex);
                    }}
                    className={`cursor-pointer px-2 py-1 rounded-lg text-sm flex justify-between ${
                      isActive
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    <span>{lesson.title}</span>

                    {/* ✅ Completed indicator */}
                    {isCompleted && (
                      <span className="text-green-400 text-xs">
                        ✓
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </Card>
      </div>

      {/* Content */}
      <div className="col-span-3 flex justify-center">
        <div className="flex flex-col gap-6 w-full max-w-3xl">
          <LessonContent
            title={currentLesson.title}
            content={currentLesson.content}
          />

          {/* ✅ Navigation */}
          <div className="flex justify-between mt-2">
            <Button
              variant="secondary"
              onClick={prevLesson}
              disabled={isFirstLesson}
            >
              Previous
            </Button>

            <Button
              onClick={nextLesson}
              disabled={isLastLesson}
            >
              {isLastLesson ? "Finish" : "Next"}
            </Button>
          </div>

          {/* ✅ AI Tutor moved BELOW navigation */}
          <AITutor
            title={currentLesson.title}
            content={currentLesson.content}
          />
        </div>
      </div>
    </div>
  );
}