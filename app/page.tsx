"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import Badge from "@/components/ui/badge";

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function Home() {
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
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          type: "tutor",
        }),
      });

      let aiText = "";

        const contentType = res.headers.get("content-type");

        if (contentType?.includes("application/json")) {
          const json = await res.json();

          if (!json.success) {
            aiText = `❌ ${json.error}`;
          } else {
            aiText = json.data;
        }
      } else {
        aiText = await res.text();
      }

      const aiMessage: Message = {
        role: "ai",
        content: aiText,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Frontend Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "❌ Error fetching response",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <Card className="w-full max-w-2xl space-y-4">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">NeoLearner AI</h1>
          <Badge>DEV MODE</Badge>
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto space-y-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-xl ${
                msg.role === "user"
                  ? "bg-cyan-500/20 text-right"
                  : "bg-white/10 text-left"
              }`}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          ))}

          {loading && (
            <div className="flex justify-center">
              <Spinner />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <Button onClick={sendMessage} disabled={loading || !input.trim()}>
            Send
          </Button>
        </div>
      </Card>
    </main>
  );
}