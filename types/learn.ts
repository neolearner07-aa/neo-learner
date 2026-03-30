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

export type LearningModule = {
  title: string;
  explanation: string;
  analogy: string;
  story: string;
  steps: string[];
  summary: string;
  flashcards: Flashcard[];
  mcqs: MCQ[];
};