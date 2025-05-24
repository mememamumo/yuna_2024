import { create } from "zustand";

type Cursor = [number, number];

interface CursorState {
  cursor: Cursor;
  setCursor: (pos: Cursor) => void;
}

export const useCursorStore = create<CursorState>((set) => ({
  cursor: [0, 0],
  setCursor: (pos: [number, number]) => {
    set({ cursor: pos });
  },
}));
