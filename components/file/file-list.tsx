"use client";

import { useEffect, useState } from "react";
import { FileRecord } from "@/types/file";
import Button from "../ui/button";
import Card from "../ui/card";

type FileContent = {
  text?: string;
  summary?: string;
};

export default function FileList({
  userId,
  onSelectionChange, // ✅ NEW (optional)
}: {
  userId: string;
  onSelectionChange?: (ids: string[]) => void;
}) {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ NEW: selected files
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  // ✅ NEW: deleting state (better UX)
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch(`/api/files?userId=${userId}`);
        const data = await res.json();

        if (data.success) {
          setFiles(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch files", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [userId]);

  // ✅ Notify parent (VERY IMPORTANT for File-Aware AI)
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedFiles);
    }
  }, [selectedFiles, onSelectionChange]);

  if (loading)
    return <p className="text-gray-400 text-sm">Loading files...</p>;

  if (!files.length)
    return (
      <p className="text-gray-400 text-sm">
        No files uploaded yet.
      </p>
    );

  const handleDelete = async (fileId: string) => {
    try {
      setDeletingId(fileId);

      await fetch(`/api/files?fileId=${fileId}&userId=${userId}`, {
        method: "DELETE",
      });

      setFiles((prev) => prev.filter((f) => f.id !== fileId));

      // also remove from selected
      setSelectedFiles((prev) => prev.filter((id) => id !== fileId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete file");
    } finally {
      setDeletingId(null);
    }
  };

  // ✅ Toggle selection
  const toggleSelect = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  // ✅ NEW: Select All
  const handleSelectAll = () => {
    setSelectedFiles(files.map((f) => f.id));
  };

  // ✅ NEW: Clear Selection
  const handleClearSelection = () => {
    setSelectedFiles([]);
  };

  return (
    <div className="space-y-4">

      {/* ✅ TOP ACTION BAR */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          {selectedFiles.length} selected
        </p>

        <div className="flex gap-2">
          <Button
            onClick={handleSelectAll}
            className="text-xs px-3 py-1 bg-cyan-500/80 hover:bg-cyan-600 text-white rounded-lg"
          >
            Select All
          </Button>

          <Button
            onClick={handleClearSelection}
            className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
          >
            Clear
          </Button>
        </div>
      </div>

      {files.map((file) => {
        const content = file.content as FileContent | null;
        const isSelected = selectedFiles.includes(file.id);

        return (
          <Card
            key={file.id}
            className={`p-4 flex flex-col gap-3 border transition-all duration-200 ${
              isSelected
                ? "border-cyan-400 bg-cyan-500/5 shadow-lg shadow-cyan-500/10"
                : "border-white/10"
            }`}
          >
            {/* Top Row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">

                {/* ✅ Checkbox */}
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelect(file.id)}
                  className="w-4 h-4 accent-cyan-500 cursor-pointer"
                />

                <div className="max-w-full overflow-hidden">
                  <p className="font-medium text-white break-all text-sm">
                    {file.filename}
                  </p>
                  <p className="text-xs text-gray-400">
                    {file.fileType}
                  </p>
                </div>
              </div>

              {/* ❌ Delete */}
              <Button
                onClick={() => handleDelete(file.id)}
                disabled={deletingId === file.id}
                className="bg-red-500/80 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-lg disabled:opacity-50"
              >
                {deletingId === file.id ? "Removing..." : "Remove"}
              </Button>
            </div>

            {/* 📄 Summary */}
            {content?.summary && (
              <p className="text-sm text-gray-300 line-clamp-3">
                {content.summary}
              </p>
            )}

            {/* 🔗 View */}
            <a
              href={file.fileUrl}
              target="_blank"
              className="text-cyan-400 text-xs hover:underline"
            >
              View File →
            </a>
          </Card>
        );
      })}
    </div>
  );
}