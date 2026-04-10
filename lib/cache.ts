import redis from "@/lib/redis";

/**
 * Get data from cache
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key);

    if (!data) return null;

    return JSON.parse(data) as T;
  } catch (error) {
    console.error("❌ Cache GET error:", error);
    return null; // fallback safely
  }
}

/**
 * Set data in cache
 */
export async function setCache(
  key: string,
  value: unknown,
  ttl: number
): Promise<void> {
  try {
    // Prevent storing null/undefined unnecessarily
    if (value === null || value === undefined) {
      await redis.del(key);
      return;
    }

    await redis.set(key, JSON.stringify(value), "EX", ttl);
  } catch (error) {
    console.error("❌ Cache SET error:", error);
  }
}

/**
 * 🔒 Acquire Lock (Prevents Cache Stampede)
 */
export async function acquireLock(key: string): Promise<boolean> {
  const lockKey = `lock:${key}`;

  try {
    // Try to set lock
    const isLocked = await redis.setnx(lockKey, "1");

    if (isLocked === 1) {
      // Set expiry (5 seconds)
      await redis.expire(lockKey, 5);
      return true;
    }

    return false;
  } catch (error) {
    console.error("❌ Lock error:", error);
    return false;
  }
}

/**
 * 🔓 Release Lock (optional utility)
 */
export async function releaseLock(key: string): Promise<void> {
  try {
    await redis.del(`lock:${key}`);
  } catch (error) {
    console.error("❌ Unlock error:", error);
  }
}