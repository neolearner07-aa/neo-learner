export async function trackUserActivity(
  userId: string,
  type: string,
  topic: string,
  score?: number
) {
  try {
    await fetch("/api/memory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        type,
        topic,
        score,
      }),
    });
  } catch (error) {
    console.error("Tracking failed:", error);
    // Silent fail — NEVER break UI
  }
}