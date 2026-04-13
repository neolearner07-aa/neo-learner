"use client";

import { useState } from "react";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import Spinner from "@/components/ui/spinner";
import RoleSelector from "@/components/solve/role-selector";
import ImageUpload from "@/components/solve/image-upload";
import { extractTextFromImage } from "@/services/solve/ocr";
import { generateSolution } from "@/services/solve/solve-generator";
import { parseSolution } from "@/services/solve/parse-solution";
import { SolveResponse } from "@/types/solve";
import SolutionView from "@/components/solve/solution-view";
import { splitQuestions } from "@/services/solve/split-questions";
import { trackUserActivity } from "@/services/memory/client-tracking"; // ✅ NEW

type Role =
  | "teacher"
  | "mathematician"
  | "scientist"
  | "programmer";

export default function SolvePage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [solutions, setSolutions] = useState<SolveResponse[]>([]);
  const [rawResponse, setRawResponse] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [role, setRole] = useState<Role>("teacher");
  const [customRole, setCustomRole] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);

  // ⚠️ Replace with real auth later
  const userId = "temp-user";

  /**
   * 🧠 VERY BASIC TOPIC DETECTION (SAFE VERSION)
   * You can upgrade later using AI
   */
  function detectTopic(question: string): string {
    if (!question) return "General";

    const q = question.toLowerCase();

    if (q.includes("integral") || q.includes("derivative")) return "Calculus";
    if (q.includes("equation") || q.includes("x") || q.includes("algebra")) return "Algebra";
    if (q.includes("force") || q.includes("velocity")) return "Physics";
    if (q.includes("reaction") || q.includes("molecule")) return "Chemistry";
    if (q.includes("code") || q.includes("function")) return "Programming";

    return "General";
  }

  const handleSolve = async () => {
    if (!input.trim() && !image) {
      setError("Please enter a problem or upload an image.");
      return;
    }

    setError(null);

    const finalRole = customRole.trim() || role;

    setLoading(true);
    setSolutions([]);
    setRawResponse(null);

    try {
      let finalInput = input;

      // 🧠 OCR
      if (!input.trim() && image) {
        setOcrLoading(true);
        finalInput = await extractTextFromImage(image);
        setOcrLoading(false);
      }

      const questions = splitQuestions(finalInput);
      const results: SolveResponse[] = [];

      for (const question of questions) {
        const aiResult = await generateSolution(question, finalRole);
        const parsed = parseSolution(aiResult);

        if (parsed) {
          results.push(parsed);
        } else {
          setRawResponse(aiResult);
        }

        // ✅ ✅ ✅ MEMORY TRACKING (SOLVE MODE)
        if (userId && question) {
          const topic = detectTopic(question);

          // optional score logic (basic)
          const score = parsed ? 1 : 0;

          // 🔥 NON-BLOCKING (do NOT await)
          trackUserActivity(userId, "solve", topic, score);
        }
      }

      setSolutions(results);
    } catch (err) {
      console.error(err);
      setError("Failed to solve problem. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">
          Solve Mode
        </h1>
        <Badge>Multimodal AI Solver</Badge>
      </div>

      {/* Empty State */}
      {!solutions.length && !rawResponse && !loading && (
        <Card>
          <p className="text-gray-400 text-sm text-center">
            Enter a problem or upload an image to get started 🚀
          </p>
        </Card>
      )}

      {/* Input Card */}
      <Card>
        <div className="space-y-5">
          
          <div>
            <p className="text-sm text-gray-400 mb-2">
              Enter Problem (optional if using image):
            </p>
            <Input
              placeholder="e.g., Solve 2x + 5 = 15"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-2">
              Upload Image (optional):
            </p>
            <ImageUpload onImageSelect={setImage} />
          </div>

          {ocrLoading && (
            <div className="flex items-center gap-2 text-sm text-cyan-400">
              <Spinner />
              Extracting text from image...
            </div>
          )}

          <div>
            <p className="text-sm text-gray-400 mb-2">
              Select Role:
            </p>
            <RoleSelector selected={role} onChange={setRole} />
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-2">
              Or type custom role:
            </p>

            <Input
              placeholder="e.g., Physics Professor, IELTS Tutor..."
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
            />

            {customRole && (
              <p className="text-xs text-cyan-400 mt-1">
                Custom role will override selected role
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-400/30 p-3 rounded-xl text-sm text-red-400">
              {error}
            </div>
          )}

          <Button
            onClick={handleSolve}
            disabled={loading || (!input.trim() && !image)}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Spinner />
                Solving your problem...
              </div>
            ) : (
              "Solve"
            )}
          </Button>
        </div>
      </Card>

      {(input || image) && (
        <Card>
          <div className="text-sm text-gray-300 space-y-2">
      
            {input && (
              <div>
                <p className="text-cyan-400 font-medium">Your Input:</p>
                <p>{input}</p>
              </div>
            )}

            {image && (
              <div>
                <p className="text-cyan-400 font-medium">Image Selected:</p>
                <p className="text-xs text-gray-400">{image.name}</p>
              </div>
            )}

          </div>
        </Card>
      )}

      <SolutionView solutions={solutions} rawResponse={rawResponse} />
    </div>
  );
}