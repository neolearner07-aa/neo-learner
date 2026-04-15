import { create, StateCreator } from "zustand";

type FileStore = {
  selectedFileIds: string[];

  toggleFile: (fileId: string) => void;
  clearSelection: () => void;
};

const fileStoreCreator: StateCreator<FileStore> = (set) => ({
  selectedFileIds: [],

  toggleFile: (fileId: string) =>
    set((state) => ({
      selectedFileIds: state.selectedFileIds.includes(fileId)
        ? state.selectedFileIds.filter((id: string) => id !== fileId)
        : [...state.selectedFileIds, fileId],
    })),

  clearSelection: () =>
    set({
      selectedFileIds: [],
    }),
});

export const useFileStore = create<FileStore>()(fileStoreCreator);