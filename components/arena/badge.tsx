"use client";

import { Achievement } from "@/services/arena/achievements";
import Badge from "@/components/ui/badge";

type Props = {
  achievements: Achievement[];
};

export default function ArenaBadges({ achievements }: Props) {
  if (!achievements.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {achievements.map((ach) => (
        <Badge key={ach.id}>
          {ach.title}
        </Badge>
      ))}
    </div>
  );
}