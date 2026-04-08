export type Flashcard = {
  question: string;
  answer: string;
};

export type MCQ = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

export type LessonContent = {
  explanation: string;
  analogy: string;
  story: string;
  steps: string[];
  summary: string;
  flashcards: Flashcard[];
  mcqs: MCQ[];
};

export type Lesson = {
  id: string;
  title: string;
  content: LessonContent;
};

export type LearningModule = {
  id: string;
  title: string;
  lessons: Lesson[];
};