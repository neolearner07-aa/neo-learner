"use client";

import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";

type FeedCardProps = {
  title: string;
  description: string;
  tags: string[];
};

export default function FeedCard({
  title,
  description,
  tags,
}: FeedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="flex flex-col gap-4">
      
        <h2 className="text-lg font-semibold text-white">
          {title}
        </h2>

        <p className="text-gray-300 text-sm">
          {description}
        </p>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge key={index}>{tag}</Badge>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}