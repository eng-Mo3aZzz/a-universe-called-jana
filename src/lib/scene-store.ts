import { useEffect } from "react";
import { create } from "zustand";
import type { StageId } from "./progress-rules";

export type SceneMode = "gate" | "portal" | "hub" | "stage" | "finale";

type SceneState = {
  mode: SceneMode;
  fromPortal: boolean;
  planetHandler: ((id: StageId) => void) | null;
  setMode: (mode: SceneMode) => void;
  setFromPortal: (v: boolean) => void;
  setPlanetHandler: (fn: ((id: StageId) => void) | null) => void;
};

export const useScene = create<SceneState>()((set) => ({
  mode: "gate",
  fromPortal: false,
  planetHandler: null,
  setMode: (mode) => set({ mode }),
  setFromPortal: (fromPortal) => set({ fromPortal }),
  setPlanetHandler: (planetHandler) => set({ planetHandler }),
}));

export function useSceneMode(mode: SceneMode) {
  useEffect(() => {
    useScene.getState().setMode(mode);
  }, [mode]);
}
