"use client";

import { useState } from "react";

import StatsCard from "@/components/profile/stats-card";
import Card from "@/components/ui/card";
import ActivityCard from "@/components/profile/activity-card";

export default function ProfilePage() {
  // ✅ Lazy initialization (BEST PRACTICE)
  const [aiUsage] = useState(() => {
    if (typeof window === "undefined") return 0;

    const stored = localStorage.getItem("ai_usage");
    return stored ? parseInt(stored) : 0;
  });

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      
      {/* Title */}
      <h1 className="text-2xl font-semibold text-white">
        👤 Your Profile
      </h1>

      {/* User Info */}
      <Card>
        <h2 className="text-lg text-white font-semibold">
          Akhnas Akhter
        </h2>
        <p className="text-gray-400 text-sm">
          Beginner Learner 🚀
        </p>
      </Card>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard label="XP" value="1200" />
        <StatsCard label="Streak" value="7 Days" />
        <StatsCard label="Courses Completed" value="3" />
        <StatsCard label="AI Usage" value={aiUsage} />
      </div>

      {/* Activity Section */}
      <ActivityCard
        activities={[
          "Learned JavaScript Basics",
          "Completed Python Quiz",
          "Watched AI Introduction Video",
        ]}
      />
    </div>
  );
}