import { getWeakTopics } from "./memory.service";
import { Recommendation } from "@/types/memory";
import { UserMemory } from "@prisma/client";

export async function getRecommendations(
  userId: string
): Promise<Recommendation[]> {
  const weakTopics = await getWeakTopics(userId);

  if (!weakTopics.length) return [];

  // Sort: lowest proficiency first, then highest interactions
  const sorted = weakTopics.sort((a: UserMemory, b: UserMemory) => {
    if (a.proficiency === b.proficiency) {
      return b.interactions - a.interactions;
    }
    return a.proficiency - b.proficiency;
  });

  return sorted.slice(0, 5).map((topic: UserMemory) => ({
    topic: topic.topic,
    reason: "You are struggling with this topic",
  }));
}
