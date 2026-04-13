export interface MemoryRecord {
  id: string;
  userId: string;
  topic: string;
  proficiency: number;
  lastAccessed: Date;
  interactions: number;
}

export interface ActivityRecord {
  id: string;
  userId: string;
  type: string;
  topic: string;
  score?: number | null;
  createdAt: Date;
}

export interface Recommendation {
  topic: string;
  reason: string;
}