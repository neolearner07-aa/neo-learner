"use client";

import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";

type VideoCardProps = {
  title: string;
  thumbnail: string;
  videoUrl: string;
};

export default function VideoCard({
  title,
  thumbnail,
  videoUrl,
}: VideoCardProps) {
  const openVideo = () => {
    window.open(videoUrl, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="flex flex-col gap-4">
      
        <div className="relative w-full h-[180px] overflow-hidden rounded-xl">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <Button onClick={openVideo}>
              ▶ Play
            </Button>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-white">
          {title}
        </h2>
      </Card>
    </motion.div>
  );
}