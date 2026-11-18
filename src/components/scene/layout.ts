import type { SceneMode } from "@/lib/scene-store";

export type CameraShot = { pos: [number, number, number]; look: [number, number, number]; fov: number; parallax: number; speed: number };

export const CAMERA: Record<SceneMode, CameraShot> = {
  gate: { pos: [0, 0, 10], look: [0, 0, 0], fov: 50, parallax: 0.5, speed: 1.2 },
  portal: { pos: [0, 0, -1], look: [0, 0, -20], fov: 80, parallax: 0, speed: 1.6 },
  hub: { pos: [0, 0, 12], look: [0, 0, 0], fov: 50, parallax: 0.6, speed: 1.1 },
  stage: { pos: [0, -0.5, 14], look: [0, 0, 0], fov: 50, parallax: 0.3, speed: 1.0 },
  finale: { pos: [0, 0.6, 6.2], look: [0, 0.7, 0], fov: 50, parallax: 0.35, speed: 0.55 },
};

/** Half-size of the visible area at a given depth for the mode's resting camera. */
export function visibleHalf(mode: SceneMode, z: number, aspect: number) {
  const shot = CAMERA[mode];
  const dist = Math.max(0.5, shot.pos[2] - z);
  const halfH = dist * Math.tan((shot.fov * Math.PI) / 360);
  return { halfH, halfW: halfH * aspect };
}
