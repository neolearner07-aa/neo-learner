"use client";

import { useState } from "react";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import Spinner from "@/components/ui/spinner";
import RoleSelector from "@/components/solve/role-selector";
import ImageUpload from "@/components/solve/image-upload";

import FileUpload from "@/components/file/file-upload";
import FileList from "@/components/file/file-list";

import { extractTextFromImage } from "@/services/solve/ocr";
import { generateSolution } from "@/services/solve/solve-generator";
import { parseSolution } from "@/services/solve/parse-solution";
import { SolveResponse } from "@/types/solve";
import SolutionView from "@/components/solve/solution-view";
import { splitQuestions } from "@/services/solve/split-questions";
import { trackUserActivity } from "@/services/memory/client-tracking";

// ✅ NEW: Zustand store
import { useFileStore } from "@/store/file-store";

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

  const userId = "temp-user";

  // ✅ NEW: selected files
  const { selectedFileIds } = useFileStore();

  function detectTopic(question: string): string {
    if (!question) return "General";

    const q = question.toLowerCase();

    if (q.includes("integral") || q.includes("derivative")) return "Calculus";
    if (q.includes("equation") || q.includes("x")) return "Algebra";
    if (q.includes("force") || q.includes("velocity")) return "Physics";
    if (q.includes("reaction")) return "Chemistry";
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

      // ✅ DEBUG (important for File-Aware AI)
      console.log("Selected Files:", selectedFileIds);

      const questions = splitQuestions(finalInput);
      const results: SolveResponse[] = [];

      for (const question of questions) {
        // ✅ FUTURE READY: attach file context in input
        const enrichedQuestion = `
${question}

${
  selectedFileIds.length
    ? `Use context from uploaded files if relevant.`
    : ""
}
`;

        const aiResult = await generateSolution(enrichedQuestion, finalRole);
        const parsed = parseSolution(aiResult);

        if (parsed) {
          results.push(parsed);
        } else {
          setRawResponse(aiResult);
        }

        // ✅ MEMORY
        if (userId && question) {
          const topic = detectTopic(question);
          const score = parsed ? 1 : 0;

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
    <div className="max-w-3xl mx-auto space-y-6 py-6">

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
            Enter a problem, upload an image, or attach study files 🚀
          </p>
        </Card>
      )}

      {/* 🔥 MAIN CARD */}
      <Card>
        <div className="space-y-6">

          {/* Input */}
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

          {/* Image Upload */}
          <div>
            <p className="text-sm text-gray-400 mb-2">
              Upload Image (optional):
            </p>
            <ImageUpload onImageSelect={setImage} />
          </div>

          {/* 📂 FILE SYSTEM (CLEAN INTEGRATION) */}
          <div className="border-t border-gray-700 pt-4 space-y-4">
            <p className="text-sm text-gray-400">
              Attach Study Material (PDF, Notes, Images):
            </p>

            <FileUpload userId={userId} />
            <FileList userId={userId} />
          </div>

          {ocrLoading && (
            <div className="flex items-center gap-2 text-sm text-cyan-400">
              <Spinner />
              Extracting text from image...
            </div>
          )}

          {/* Role */}
          <div>
            <p className="text-sm text-gray-400 mb-2">
              Select Role:
            </p>
            <RoleSelector selected={role} onChange={setRole} />
          </div>

          {/* Custom Role */}
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

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-400/30 p-3 rounded-xl text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Solve Button */}
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

      {/* Preview */}
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