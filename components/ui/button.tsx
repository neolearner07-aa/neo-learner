"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

export default function Button({
  children,
  variant = "primary",
  onClick,
  className,
  disabled = false,
}: ButtonProps) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={clsx(
        "px-5 py-2 rounded-xl font-medium transition-all duration-300",

        // Disabled styles
        disabled && "opacity-50 cursor-not-allowed",

        // Variant styles
        variant === "primary" &&
          "bg-[var(--primary)] text-black shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50",

        variant === "secondary" &&
          "bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-md text-white hover:bg-white/10",

        className
      )}
    >
      {children}
    </motion.button>
  );
}