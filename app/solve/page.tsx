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

type Role =
  | "teacher"
  | "mathematician"
  | "scientist"
  | "programmer";

export default function SolvePage() {
  // 🧠 STATE MANAGEMENT
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [solutions, setSolutions] = useState<SolveResponse[]>([]);
  const [rawResponse, setRawResponse] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [role, setRole] = useState<Role>("teacher");
  const [customRole, setCustomRole] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);

  // 🚀 HANDLE SOLVE CLICK
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

      // 🧠 OCR (if only image is provided)
      if (!input.trim() && image) {
        setOcrLoading(true);

        finalInput = await extractTextFromImage(image);

        setOcrLoading(false);
      }

      // 🧠 MULTI-QUESTION SPLIT
      const questions = splitQuestions(finalInput);

      const results: SolveResponse[] = [];

      // 🔁 LOOP OVER QUESTIONS
      for (const question of questions) {
        const aiResult = await generateSolution(question, finalRole);

        const parsed = parseSolution(aiResult);

        if (parsed) {
          results.push(parsed);
        } else {
          setRawResponse(aiResult); // fallback
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
          
          {/* Problem Input */}
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

          {/* OCR Loading State */}
          {ocrLoading && (
            <div className="flex items-center gap-2 text-sm text-cyan-400">
            <Spinner />
              Extracting text from image...
            </div>
          )}

          {/* Role Selector */}
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

          {/* Error Message */}
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

          {/* Input Preview */}
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

      {/* ✅ FINAL OUTPUT */}
      <SolutionView solutions={solutions} rawResponse={rawResponse} />
    </div>
  );
}