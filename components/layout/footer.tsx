import React from "react";

export default function Footer() {
  return (
    <footer className="w-full px-6 py-4 mt-auto bg-[var(--glass-bg)] border-t border-[var(--glass-border)] backdrop-blur-md text-center text-sm text-gray-400">
      
      © {new Date().getFullYear()} NeoLearner. All rights reserved.
      
    </footer>
  );
}