"use client";

import React, { useState } from "react";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import Footer from "./footer";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-black text-white">
      {/* Fixed Navbar */}
      <Navbar toggleSidebar={() => setIsOpen((prev) => !prev)} />

      {/* Fixed Sidebar Overlay */}
      <Sidebar
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />

      {/* Main Content */}
      <div className="flex flex-col min-h-screen pt-16">
        <main className="flex-1 w-full max-w-full px-4 sm:px-6 overflow-x-hidden">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}