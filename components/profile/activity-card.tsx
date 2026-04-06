"use client";

import React from "react";
import Card from "@/components/ui/card";

type ActivityCardProps = {
  activities: string[];
};

export default function ActivityCard({ activities }: ActivityCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      
      {/* Title */}
      <h3 className="text-white font-semibold">
        Recent Activity
      </h3>

      {/* Activity List */}
      {activities.length === 0 ? (
        <p className="text-gray-400 text-sm">
          No recent activity
        </p>
      ) : (
        <ul className="text-gray-400 text-sm space-y-1">
          {activities.map((activity, index) => (
            <li key={index}>✔ {activity}</li>
          ))}
        </ul>
      )}

    </Card>
  );
}