"use client";

import { useState } from "react";

import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Spinner from "@/components/ui/spinner";

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
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "tutor",
          prompt: `Topic: ${topic}\nQuestion: ${input}`,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "AI request failed");
      }

      const aiMessage: Message = {
        role: "ai",
        content: data.response || "No response from AI",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: unknown) {
      let message = "❌ Failed to get response";

      if (error instanceof Error) {
        if (error.message.includes("No AI credits")) {
          message = "⚠️ No credits left. Watch an ad to continue.";
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: message,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReward = async () => {
    try {
      const res = await fetch("/api/reward", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Reward failed");
      }

      alert("🎉 Credits added!");
    } catch {
      alert("❌ Failed to add credits");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Badge>Ask AI Tutor</Badge>

      {/* Chat Messages */}
      <Card className="flex flex-col gap-4 h-[300px] overflow-y-auto p-3">
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

      {/* Input + Actions */}
      <div className="flex gap-2 mt-2">
        <Input
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />

        <Button
          onClick={handleReward}
          className="bg-yellow-500 text-black px-4 py-2 rounded whitespace-nowrap"
        >
          Watch Ad
        </Button>

        <Button onClick={sendMessage} disabled={loading}>
          Send
        </Button>
      </div>
    </div>
  );
}