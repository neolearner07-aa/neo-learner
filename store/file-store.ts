import { create, StateCreator } from "zustand";

type FileStore = {
  selectedFileIds: string[];

  toggleFile: (fileId: string) => void;
  setSelectedFileIds: (ids: string[]) => void;
  clearSelection: () => void;
  clearSelectedFiles: () => void;
};

const fileStoreCreator: StateCreator<FileStore> = (set) => ({
  selectedFileIds: [],

  toggleFile: (fileId: string) =>
    set((state) => ({
      selectedFileIds: state.selectedFileIds.includes(fileId)
        ? state.selectedFileIds.filter((id: string) => id !== fileId)
        : [...state.selectedFileIds, fileId],
    })),

  setSelectedFileIds: (ids: string[]) =>
    set({
      selectedFileIds: ids,
    }),

  clearSelection: () =>
    set({
      selectedFileIds: [],
    }),

  clearSelectedFiles: () =>
    set({
      selectedFileIds: [],
    }),
});

export const useFileStore = create<FileStore>()(fileStoreCreator);