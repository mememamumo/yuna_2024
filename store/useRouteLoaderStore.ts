import { create } from "zustand";

interface RouteLoaderStore {
  isAnimating: boolean;
  startAnimation: (onComplete?: () => void) => void;
  stopAnimation: () => void;
  onComplete?: () => void;
}

export const useRouteLoaderStore = create<RouteLoaderStore>((set) => ({
  isAnimating: false,
  onComplete: undefined,
  startAnimation: (onComplete) => set({ isAnimating: true, onComplete }),
  stopAnimation: () =>
    set((state) => {
      if (state.onComplete) state.onComplete();
      return { isAnimating: false, onComplete: undefined };
    }),
}));
