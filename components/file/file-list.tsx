"use client";

import { useEffect, useState } from "react";
import { FileRecord } from "@/types/file";
import Button from "../ui/button";
import Card from "../ui/card";
import { useFileStore } from "@/store/file-store";

type FileContent = {
  text?: string;
  summary?: string;
};

export default function FileList({
  onSelectionChange,
}: {
  onSelectionChange?: (ids: string[]) => void;
}) {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ✅ Global selection state
  const {
    selectedFileIds,
    toggleFile,
    setSelectedFileIds,
    clearSelection,
  } = useFileStore();

  // ✅ Fetch files
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch("/api/files");
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to fetch files");
        }

        setFiles(data.data || []);
      } catch (error) {
        console.error("Failed to fetch files:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  // ✅ Parent sync
  useEffect(() => {
    onSelectionChange?.(selectedFileIds);
  }, [selectedFileIds, onSelectionChange]);

  if (loading) {
    return (
      <p className="text-gray-400 text-sm">
        Loading files...
      </p>
    );
  }

  if (!files.length) {
    return (
      <p className="text-gray-400 text-sm">
        No files uploaded yet.
      </p>
    );
  }

  // ✅ Delete file
  const handleDelete = async (fileId: string) => {
    try {
      setDeletingId(fileId);

      const res = await fetch(
        `/api/files?fileId=${fileId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Delete failed");
      }

      setFiles((prev) =>
        prev.filter((f) => f.id !== fileId)
      );

      setSelectedFileIds(
        selectedFileIds.filter(
          (id) => id !== fileId
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to delete file");
    } finally {
      setDeletingId(null);
    }
  };

  // ✅ Select all
  const handleSelectAll = () => {
    setSelectedFileIds(
      files.map((file) => file.id)
    );
  };

  // ✅ Clear
  const handleClearSelection = () => {
    clearSelection();
  };

  return (
    <div className="space-y-4 w-full min-w-0 overflow-hidden">
      {/* TOP BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-gray-400">
          {selectedFileIds.length} selected
        </p>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleSelectAll}
            disabled={files.length === 0}
            className="text-xs px-3 py-1 bg-cyan-500/80 hover:bg-cyan-600 text-white rounded-lg disabled:opacity-50"
          >
            Select All
          </Button>

          <Button
            onClick={handleClearSelection}
            disabled={
              selectedFileIds.length === 0
            }
            className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50"
          >
            Clear
          </Button>
        </div>
      </div>

      {files.map((file) => {
        const content =
          (file.content || {}) as FileContent;

        const isSelected =
          selectedFileIds.includes(file.id);

        return (
          <Card
            key={file.id}
            className={`p-4 flex flex-col gap-3 border transition-all duration-200 w-full min-w-0 overflow-hidden ${
              isSelected
                ? "border-cyan-400 bg-cyan-500/5 shadow-lg shadow-cyan-500/10"
                : "border-white/10"
            }`}
          >
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 min-w-0">

              <div className="flex items-start gap-3 min-w-0 flex-1">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() =>
                    toggleFile(file.id)
                  }
                  className="w-4 h-4 mt-1 accent-cyan-500 cursor-pointer shrink-0"
                />

                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="font-medium text-white break-all text-sm">
                    {file.filename}
                  </p>

                  <p className="text-xs text-gray-400 break-all">
                    {file.fileType}
                  </p>
                </div>
              </div>

              {/* DELETE */}
              <Button
                onClick={() =>
                  handleDelete(file.id)
                }
                disabled={
                  deletingId === file.id
                }
                className="bg-red-500/80 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-lg disabled:opacity-50 w-full sm:w-auto"
              >
                {deletingId === file.id
                  ? "Removing..."
                  : "Remove"}
              </Button>
            </div>

            {/* SUMMARY */}
            {content.summary && (
              <p className="text-sm text-gray-300 break-words">
                {content.summary}
              </p>
            )}

            {/* VIEW FILE */}
            <a
              href={file.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 text-xs hover:underline break-all"
            >
              View File →
            </a>
          </Card>
        );
      })}
    </div>
  );
}