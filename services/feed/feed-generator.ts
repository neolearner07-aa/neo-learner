import { FeedItem } from "@/types/feed";
import { getCache, setCache } from "@/lib/cache";

/**
 * Shuffle array (Fisher-Yates)
 */
function shuffle(array: FeedItem[]): FeedItem[] {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

/**
 * Generate Feed with Basic Ranking (CACHED)
 */
export async function generateFeed(
  topic?: string
): Promise<FeedItem[]> {
  const cacheKey = `feed:${topic || "default"}`;

  // 1. Check cache
  const cached = await getCache<FeedItem[]>(cacheKey);

  if (cached) {
    console.log("⚡ Feed Cache HIT");
    return cached;
  }

  console.log("🐢 Feed Cache MISS → Generating");

  const baseTopics = [
    topic || "JavaScript",
    "Python",
    "AI Basics",
    "React",
    "Data Structures",
  ];

  let feed: FeedItem[] = [];

  baseTopics.forEach((t, index) => {
    // 📚 Post
    feed.push({
      id: `post-${index}`,
      type: "post",
      title: `Learn ${t} in 5 Minutes`,
      description: `A quick and beginner-friendly guide to understand ${t}.`,
      tags: [t, "Beginner", "Quick Learn"],
    });

    // 🎥 Video
    feed.push({
      id: `video-${index}`,
      type: "video",
      title: `${t} Explained Visually`,
      description: `Watch this simple breakdown of ${t}.`,
      tags: [t, "Video", "Visual Learning"],
      thumbnail: "https://via.placeholder.com/300x180",
      videoUrl: "https://youtube.com",
    });
  });

  /**
   * 🔥 RANKING LOGIC
   */

  // 1. Prioritize topic (if provided)
  if (topic) {
    const prioritized = feed.filter((item) =>
      item.tags.includes(topic)
    );

    const others = feed.filter(
      (item) => !item.tags.includes(topic)
    );

    feed = [...prioritized, ...others];
  }

  // 2. Shuffle slightly to avoid monotony
  feed = shuffle(feed);

  // 3. Store in cache (TTL: 10 minutes)
  await setCache(cacheKey, feed, 600);

  return feed;
}