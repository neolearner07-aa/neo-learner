"use client";

import React from "react";

type NavbarProps = {
  toggleSidebar?: () => void;
};

export default function Navbar({ toggleSidebar }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-6 py-4 flex items-center justify-between bg-[var(--glass-bg)] border-b border-[var(--glass-border)] backdrop-blur-md">
      
      {/* Left */}
      <div className="flex items-center gap-4">
        
        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="text-cyan-400"
        >
          ☰
        </button>

        {/* Logo */}
        <h1 className="text-lg font-semibold tracking-wide">
          <span className="text-cyan-400">Neo</span>Learner
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">v1.0</span>
      </div>

    </header>
  );
}