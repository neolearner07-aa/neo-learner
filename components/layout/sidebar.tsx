"use client";

import clsx from "clsx";
import React, { useState } from "react";

const navItems = ["Learn", "Solve", "Tutor", "Arena", "Profile"];

type SidebarProps = {
  isOpen: boolean;
};

export default function Sidebar({ isOpen }: SidebarProps) {
  const [active, setActive] = useState("Learn");

  return (
    <aside
      className={clsx(
        "h-screen transition-all duration-300",
        "bg-[var(--glass-bg)] border-r border-[var(--glass-border)] backdrop-blur-md",
        isOpen ? "w-64" : "w-0 overflow-hidden"
      )}
    >
      <nav className="flex flex-col gap-2 mt-10 p-4">
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => setActive(item)}
            className={clsx(
              "text-left px-4 py-2 rounded-xl transition-all duration-300",

              active === item
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-400/30"
                : "text-gray-300 hover:bg-white/10 hover:text-white"
            )}
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
}