import { motion } from "framer-motion";
import React from "react";

export default function Spinner() {
  return (
    <motion.div
      className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        duration: 1,
        ease: "linear",
      }}
    />
  );
}