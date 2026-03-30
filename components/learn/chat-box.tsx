"use client";

import { useState } from "react";

import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Spinner from "@/components/ui/spinner";

import { runAI } from "@/services/ai/orchestrator";

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function ChatBox({ topic }: { topic: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await runAI(
        "tutor",
        `Topic: ${topic}\nQuestion: ${input}`
      );

      const aiMessage: Message = {
        role: "ai",
        content: response,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "❌ Failed to get response",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Badge>Ask AI Tutor</Badge>

      <Card className="flex flex-col gap-4 max-h-[400px] overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-gray-400 text-sm">
            Ask anything about this topic...
          </p>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg ${
              msg.role === "user"
                ? "bg-cyan-500/10 text-cyan-300 self-end"
                : "bg-white/10 text-gray-300 self-start"
            }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <Spinner />
          </div>
        )}
      </Card>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />

        <Button onClick={sendMessage} disabled={loading}>
          Send
        </Button>
      </div>
    </div>
  );
}