"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";

import CourseCard from "@/components/courses/course-card";

import { fadeIn, transition } from "@/lib/animations";
import { generateCourse } from "@/services/courses/course-generator";
import { Course } from "@/types/course";

import { trackUserActivity } from "@/services/memory/client-tracking"; // ✅ NEW

export default function CoursesPage() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  const router = useRouter();

  // ⚠️ Replace later with real auth
  const userId = "temp-user";

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setLoading(true);

    try {
      const newCourse = await generateCourse(topic);

      setCourses((prev) => [newCourse, ...prev]);
      setTopic("");

      // ✅ ✅ MEMORY TRACKING (COURSE GENERATION)
      if (userId && topic) {
        trackUserActivity(userId, "course", topic);
      }

    } catch (error) {
      console.error("Failed to generate course:", error);
      alert("Something went wrong while generating course.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartCourse = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;

    localStorage.setItem("currentCourse", JSON.stringify(course));

    // ✅ ✅ MEMORY TRACKING (COURSE START)
    if (userId && course.title) {
      trackUserActivity(userId, "course", course.title);
    }

    router.push(`/courses/${courseId}`);
  };

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      transition={transition}
      className="p-6 max-w-3xl mx-auto flex flex-col gap-6"
    >
      <h1 className="text-3xl font-bold text-white">📚 Courses</h1>

      <Card className="flex flex-col gap-4">
        <h2 className="text-xl text-white font-semibold">
          Generate New Course
        </h2>

        <Input
          placeholder="Enter topic (e.g. Learn Python, Physics, AI...)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? <Spinner /> : "Generate Course"}
        </Button>

        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Spinner />
            <span>Generating your course...</span>
          </div>
        )}
      </Card>

      {courses.length === 0 ? (
        <div className="text-gray-400 text-center">
          No courses yet. Generate one 🚀
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onStart={handleStartCourse}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}