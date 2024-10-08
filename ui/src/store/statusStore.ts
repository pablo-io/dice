import {create} from "zustand";

export const useAppStatusStore = create(() => ({
  tasksStatusCircle: false,
}));
