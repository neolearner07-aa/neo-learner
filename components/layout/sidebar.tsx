"use client";

import clsx from "clsx";
import React from "react";
import { useRouter, usePathname } from "next/navigation";

type SidebarProps = {
  isOpen: boolean;
  onClose?: () => void;
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

export default function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={clsx(
          "fixed inset-0 bg-black/50 z-40 transition-opacity md:hidden",
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        )}
      />

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] w-64",
          "bg-[var(--glass-bg)] border-r border-[var(--glass-border)] backdrop-blur-md",
          "transition-transform duration-300",
          isOpen
            ? "translate-x-0"
            : "-translate-x-full"
        )}
      >
        <nav className="flex flex-col gap-2 mt-6 p-4">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.path);

            return (
              <button
                key={item.name}
                onClick={() => {
                  router.push(item.path);
                  onClose?.();
                }}
                className={clsx(
                  "text-left px-4 py-2 rounded-xl transition-all",
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
    </>
  );
}