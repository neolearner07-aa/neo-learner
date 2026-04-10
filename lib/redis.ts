import Redis from "ioredis";

const redisClient = new Redis(process.env.REDIS_URL as string, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  retryStrategy: (times) => {
    return Math.min(times * 50, 2000);
  },
});

// Optional: Logging (for debugging)
redisClient.on("connect", () => {
  console.log("✅ Redis connected");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

export default redisClient;