"use client";

import React, { useState } from "react";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import Footer from "./footer";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} />

      {/* Main Area */}
      <div className="flex flex-col flex-1 transition-all duration-300">
        
        {/* Navbar */}
        <Navbar toggleSidebar={() => setIsOpen((prev) => !prev)} />

        {/* Content */}
        <main className="flex-1 p-6">
          {children}
        </main>

        {/* Footer */}
        <Footer />
        
      </div>
    </div>
  );
}