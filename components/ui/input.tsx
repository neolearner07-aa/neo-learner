"use client";

import clsx from "clsx";
import React from "react";

type InputProps = {
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({
  placeholder,
  className,
  value,
  onChange,
}: InputProps) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={clsx(
        "w-full px-4 py-2 rounded-xl outline-none",
        "bg-[var(--glass-bg)]",
        "border border-[var(--glass-border)]",
        "backdrop-blur-md",
        "text-white placeholder:text-gray-400",
        "transition-all duration-300",

        // Focus glow effect
        "focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400",

        className
      )}
    />
  );
}