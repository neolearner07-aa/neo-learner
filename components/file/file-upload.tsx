"use client";

import { useRef, useState } from "react";
import Button from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import Card from "@/components/ui/card";

export default function FileUpload({ userId }: { userId: string }) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (selected: FileList | null) => {
    if (!selected) return;

    const newFiles = Array.from(selected);
    setFiles((prev) => [...prev, ...newFiles]);
    setMessage("");
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!files.length) return;

    setLoading(true);
    setMessage("");

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", userId);

        const res = await fetch("/api/files", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!data.success) {
          throw new Error(data.error || "Upload failed");
        }
      }

      setMessage("✅ All files uploaded");
      setFiles([]);
    } catch (err: unknown) {
      setMessage(
        err instanceof Error ? err.message : "Upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 space-y-4 bg-black/30 border border-gray-700">

      {/* Hidden Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFileChange(e.target.files)}
      />

      {/* Select Button */}
      <Button onClick={handleSelectClick} className="w-full">
        📂 Select Files
      </Button>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex justify-between items-center text-sm text-gray-300 bg-black/40 px-3 py-2 rounded-lg"
            >
              <span className="truncate">{file.name}</span>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </span>

                <button
                  onClick={() => removeFile(index)}
                  className="text-red-400 hover:text-red-300 text-xs"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      <Button
        onClick={handleUpload}
        disabled={!files.length || loading}
        className="w-full"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <Spinner />
            Uploading...
          </div>
        ) : (
          "Upload Files"
        )}
      </Button>

      {/* Message */}
      {message && (
        <p className="text-xs text-gray-400 text-center">
          {message}
        </p>
      )}

    </Card>
  );
}