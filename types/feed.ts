export type FeedItem = {
  id: string;
  type: "post" | "video";
  title: string;
  description: string;
  tags: string[];
  thumbnail?: string;
  videoUrl?: string;
};