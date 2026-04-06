"use client";

import clsx from "clsx";
import React from "react";
import { useRouter, usePathname } from "next/navigation";

type SidebarProps = {
  isOpen: boolean;
};

const navItems = [
  { name: "Learn", path: "/learn" },
  { name: "Solve", path: "/solve" },
  { name: "Tutor", path: "/tutor" },
  { name: "Arena", path: "/arena" },
  { name: "Courses", path: "/courses" },
  { name: "Feed", path: "/feed" },
  { name: "Profile", path: "/profile" },
];

export default function Sidebar({ isOpen }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside
      className={clsx(
        "h-screen transition-all duration-300",
        "bg-[var(--glass-bg)] border-r border-[var(--glass-border)] backdrop-blur-md",
        isOpen ? "w-64" : "w-0 overflow-hidden"
      )}
    >
      <nav className="flex flex-col gap-2 mt-10 p-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.path);

          return (
            <button
              key={item.name}
              onClick={() => router.push(item.path)}
              className={clsx(
                "text-left px-4 py-2 rounded-xl transition-all duration-300",

                isActive
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-400/30"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              )}
            >
              {item.name}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}