"use client";

import { useEffect, useState } from "react";

import Spinner from "@/components/ui/spinner";
import FeedCard from "@/components/feed/feed-card";
import VideoCard from "@/components/feed/video-card";

import { generateFeed } from "@/services/feed/feed-generator";
import { FeedItem } from "@/types/feed";

export default function FeedPage() {
  const [loading, setLoading] = useState(true);
  const [feed, setFeed] = useState<FeedItem[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // 🔥 Generate feed (mock for now)
      const data = generateFeed();
      setFeed(data);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
    
      {/* Title */}
      <h1 className="text-2xl font-semibold text-white">
        📚 Learning Feed
      </h1>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center mt-20">
          <Spinner />
        </div>
      ) : feed.length === 0 ? (
        <div className="text-center mt-20 text-gray-400">
          <p>No content available</p>
          <p className="text-sm mt-2">
            Try refreshing or exploring other sections 🚀
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {feed.map((item) => {
            if (item.type === "post") {
              return (
                <FeedCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  tags={item.tags}
                />
              );
            };

            if (item.type === "video") {
              return (
                <VideoCard
                  key={item.id}
                  title={item.title}
                  thumbnail={item.thumbnail!}
                  videoUrl={item.videoUrl!}
                />
              );
            }

              return null;
           })}
        </div>
      )}
    </div>
  );
}