import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { nextStage, type StageId } from "./progress-rules";

type ProgressState = {
  completed: StageId[];
  justUnlocked: StageId | null;
  starsOpened: string[];
  answers: Record<string, number>;
  huntStep: number;
  giftsOpened: number;
  lettersSeen: string[];
  secretsFound: string[];
  wishMade: boolean;
  completeStage: (id: StageId) => void;
  clearJustUnlocked: () => void;
  openStar: (id: string) => void;
  answer: (questionId: string, option: number) => void;
  advanceHunt: () => void;
  openGift: (index: number) => void;
  seeLetter: (id: string) => void;
  findSecret: (id: string) => void;
  makeWish: () => void;
  reset: () => void;
};

const initial = {
  completed: [] as StageId[],
  justUnlocked: null as StageId | null,
  starsOpened: [] as string[],
  answers: {} as Record<string, number>,
  huntStep: 0,
  giftsOpened: 0,
  lettersSeen: [] as string[],
  secretsFound: [] as string[],
  wishMade: false,
};

const addUnique = <T,>(list: T[], v: T) => (list.includes(v) ? list : [...list, v]);

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initial,
      completeStage: (id) => {
        if (get().completed.includes(id)) return;
        set({ completed: [...get().completed, id], justUnlocked: nextStage(id) });
      },
      clearJustUnlocked: () => set({ justUnlocked: null }),
      openStar: (id) => set({ starsOpened: addUnique(get().starsOpened, id) }),
      answer: (questionId, option) => set({ answers: { ...get().answers, [questionId]: option } }),
      advanceHunt: () => set({ huntStep: get().huntStep + 1 }),
      openGift: (index) => set({ giftsOpened: Math.max(get().giftsOpened, index + 1) }),
      seeLetter: (id) => set({ lettersSeen: addUnique(get().lettersSeen, id) }),
      findSecret: (id) => set({ secretsFound: addUnique(get().secretsFound, id) }),
      makeWish: () => set({ wishMade: true }),
      reset: () => set({ ...initial }),
    }),
    {
      name: "jana-universe-progress-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ justUnlocked: _j, ...rest }) => rest,
    },
  ),
);
