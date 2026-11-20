// Screen positions of the planets, written by the 3D scene every frame and read by the DOM labels.
export type PlanetScreen = { x: number; y: number; r: number };
export const planetScreen: Partial<Record<string, PlanetScreen>> = {};
