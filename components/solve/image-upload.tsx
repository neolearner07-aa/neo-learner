"use client";

import React, { useRef, useState } from "react";
import Button from "@/components/ui/button";
import clsx from "clsx";

type ImageUploadProps = {
  onImageSelect: (file: File | null) => void;
};

export default function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("No file selected");
  const [isDragging, setIsDragging] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // 📂 Handle File Selection
  const handleFile = (file: File | null) => {
    if (!file) {
      setPreview(null);
      setFileName("No file selected");
      onImageSelect(null);
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setPreview(imageUrl);
    setFileName(file.name);
    onImageSelect(file);
  };

  // 🖱️ Click Upload
  const handleClick = () => {
    inputRef.current?.click();
  };

  // 📥 Input Change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFile(file);
  };

  // 🖱️ Drag Events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0] || null;
    handleFile(file);
  };

  // ❌ Remove Image
  const handleRemove = () => {
    handleFile(null);
  };

  return (
    <div className="space-y-4">
      
      {/* Hidden Input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />

      {/* Drag & Drop Area */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={clsx(
          "cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all",
          isDragging
            ? "border-cyan-400 bg-cyan-500/10"
            : "border-[var(--glass-border)] hover:bg-white/5"
        )}
      >
        <p className="text-sm text-gray-300">
          Drag & drop an image here, or click to upload
        </p>
      </div>

      {/* File Info */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400 truncate max-w-[200px]">
          {fileName}
        </span>

        {preview && (
          <Button variant="secondary" onClick={handleRemove}>
            Remove
          </Button>
        )}
      </div>

      {/* Preview */}
      {preview && (
        <div>
          <img
            src={preview}
            alt="Preview"
            className="max-h-60 rounded-xl border border-[var(--glass-border)] shadow-md"
          />
        </div>
      )}
    </div>
  );
}