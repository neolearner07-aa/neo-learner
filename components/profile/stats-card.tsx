"use client";

import React from "react";
import Card from "@/components/ui/card";

type StatsCardProps = {
  label: string;
  value: string | number;
};

export default function StatsCard({ label, value }: StatsCardProps) {
  return (
    <Card className="flex flex-col gap-2">
      
      {/* Label */}
      <span className="text-sm text-gray-400">
        {label}
      </span>

      {/* Value */}
      <span className="text-xl font-semibold text-cyan-400">
        {value}
      </span>

    </Card>
  );
}