"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className }: CardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={clsx(
        "rounded-2xl p-6",
        "bg-[var(--glass-bg)]",
        "border border-[var(--glass-border)]",
        "backdrop-blur-md",
        "shadow-lg shadow-black/30",
        className
      )}
    >
      {children}
    </motion.div>
  );
}