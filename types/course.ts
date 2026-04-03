/**
 * Lesson Type
 */
export type Lesson = {
  id: string;
  title: string;
  content: string;
};

/**
 * Module Type
 */
export type Module = {
  id: string;
  title: string;
  lessons: Lesson[];
};

/**
 * Course Type
 */
export type Course = {
  id: string;
  title: string;
  description: string;
  modules: Module[];
};