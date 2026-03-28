import clsx from "clsx";
import React from "react";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "px-3 py-1 text-xs rounded-full font-medium",
        "bg-cyan-500/10 text-cyan-400",
        "border border-cyan-400/30",
        "shadow-sm shadow-cyan-500/20",
        className
      )}
    >
      {children}
    </span>
  );
}