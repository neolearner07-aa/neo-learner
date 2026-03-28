"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import AppShell from "@/components/layout/appshell";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import Badge from "@/components/ui/badge";
import Spinner from "@/components/ui/spinner";

import { fadeIn, slideUp, transition } from "@/lib/animations";

export default function Home() {
  const [text, setText] = useState("");

  return (
    <AppShell>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={transition}
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={slideUp} transition={transition}>
          <h1 className="text-2xl font-semibold">
            NeoLearner UI System 🚀
          </h1>
          <p className="text-gray-400">
            Futuristic AI-powered design system demo
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div variants={slideUp} transition={transition} className="flex gap-4">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button disabled>Disabled Button</Button>
        </motion.div>

        {/* Card */}
        <motion.div variants={slideUp} transition={transition}>
          <Card className="max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">AI Module</h2>
              <Badge>NEW</Badge>
            </div>

            <p className="text-gray-400 text-sm">
              This is a futuristic glassmorphism card component.
            </p>

            <Input
              placeholder="Ask AI something..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <Button>Submit</Button>
          </Card>
        </motion.div>

        {/* Spinner */}
        <motion.div variants={slideUp} transition={transition} className="flex items-center gap-3">
          <Spinner />
          <span className="text-gray-400 text-sm">AI is thinking...</span>
        </motion.div>
      </motion.div>
    </AppShell>
  );
}