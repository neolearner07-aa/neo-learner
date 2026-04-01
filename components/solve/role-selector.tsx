"use client";

import React from "react";
import clsx from "clsx";

type Role = "teacher" | "mathematician" | "scientist" | "programmer";

type RoleSelectorProps = {
  selected: Role;
  onChange: (role: Role) => void;
};

const roles: { label: string; value: Role }[] = [
  { label: "Teacher", value: "teacher" },
  { label: "Mathematician", value: "mathematician" },
  { label: "Scientist", value: "scientist" },
  { label: "Programmer", value: "programmer" },
];

export default function RoleSelector({
  selected,
  onChange,
}: RoleSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {roles.map((role) => (
        <button
          key={role.value}
          onClick={() => onChange(role.value)}
          className={clsx(
            "px-4 py-2 rounded-xl text-sm transition-all duration-300",
            "border",

            selected === role.value
              ? "bg-cyan-500/20 text-cyan-400 border-cyan-400"
              : "bg-[var(--glass-bg)] text-gray-300 border-[var(--glass-border)] hover:bg-white/10"
          )}
        >
          {role.label}
        </button>
      ))}
    </div>
  );
}