/**
 * Get progress from localStorage
 */
export function getProgress(courseId: string): string[] {
  try {
    const data = localStorage.getItem(`progress-${courseId}`);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Mark lesson as completed
 */
export function markLessonComplete(
  courseId: string,
  lessonId: string
) {
  const current = getProgress(courseId);

  if (!current.includes(lessonId)) {
    const updated = [...current, lessonId];
    localStorage.setItem(
      `progress-${courseId}`,
      JSON.stringify(updated)
    );
  }
}

/**
 * Calculate progress %
 */
export function calculateProgress(
  totalLessons: number,
  completedLessons: number
): number {
  if (totalLessons === 0) return 0;

  return Math.round((completedLessons / totalLessons) * 100);
}