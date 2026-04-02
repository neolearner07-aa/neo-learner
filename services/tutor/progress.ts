/**
 * Progress Tracking Service
 */

const STORAGE_KEY = "neoLearner_progress";

/**
 * Progress Type
 */
export type ProgressData = {
  completedTopics: string[];
  completedDays: number[];
};

/**
 * Get Progress from localStorage
 */
export function getProgress(): ProgressData {
  try {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
      return {
        completedTopics: [],
        completedDays: [],
      };
    }

    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading progress:", error);

    return {
      completedTopics: [],
      completedDays: [],
    };
  }
}

/**
 * Save Progress to localStorage
 */
export function saveProgress(progress: ProgressData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error("Error saving progress:", error);
  }
}

/**
 * Toggle Topic Completion
 */
export function toggleTopic(topicId: string) {
  const progress = getProgress();

  const exists = progress.completedTopics.includes(topicId);

  if (exists) {
    progress.completedTopics = progress.completedTopics.filter(
      (id) => id !== topicId
    );
  } else {
    progress.completedTopics.push(topicId);
  }

  saveProgress(progress);

  return progress;
}

/**
 * Toggle Day Completion
 */
export function toggleDay(day: number) {
  const progress = getProgress();

  const exists = progress.completedDays.includes(day);

  if (exists) {
    progress.completedDays = progress.completedDays.filter(
      (d) => d !== day
    );
  } else {
    progress.completedDays.push(day);
  }

  saveProgress(progress);

  return progress;
}
/**
 * Detect Weak Topics
 */
export function getWeakTopics(allTopics: string[]): string[] {
  const progress = getProgress();

  // Topics not completed = weak
  const weakTopics = allTopics.filter(
    (id) => !progress.completedTopics.includes(id)
  );

  return weakTopics;
}