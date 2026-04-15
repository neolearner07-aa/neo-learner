export type ParsedContent = {
  text: string;
  summary: string;
};

export type FileRecord = {
  id: string;
  userId: string;
  filename: string;
  fileType: string;
  fileUrl: string;
  content?: ParsedContent | null;
  createdAt: Date;
};