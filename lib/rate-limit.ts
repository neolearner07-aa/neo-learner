import redis from "@/lib/redis";

/**
 * Rate Limit Config
 */
const WINDOW_SIZE = 60; // seconds
const MAX_REQUESTS = 10;

/**
 * Rate Limit Function
 */
export async function rateLimit(userId: string): Promise<boolean> {
  const key = `rate:${userId}`;

  try {
    const current = await redis.get(key);

    // First request
    if (!current) {
      await redis.set(key, 1, "EX", WINDOW_SIZE);
      return true;
    }

    const count = parseInt(current, 10);

    if (count >= MAX_REQUESTS) {
      return false;
    }

    // Increment count
    await redis.incr(key);

    return true;
  } catch (error) {
    console.error("Rate Limit Error:", error);

    // Fail open (do not block user if Redis fails)
    return true;
  }
}