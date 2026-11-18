import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { useScene, type SceneMode } from "@/lib/scene-store";
import { Rose, ROSE_PALETTES } from "./Rose";
import { visibleHalf } from "./layout";

const ROSES = [
  { corner: [-1, 1], palette: ROSE_PALETTES.burgundy, seed: 0.3, rot: [1.05, 0.2, -0.6] },
  { corner: [1, 1], palette: ROSE_PALETTES.blush, seed: 1.7, rot: [1.05, -0.2, 0.6] },
  { corner: [-1, -1], palette: ROSE_PALETTES.champagne, seed: 2.9, rot: [0.75, 0.3, -0.35] },
  { corner: [1, -1], palette: ROSE_PALETTES.wine, seed: 4.1, rot: [0.75, -0.3, 0.35] },
] as const;

const LAYOUT: Record<SceneMode, { z: number; spread: number; scale: number; show: number[] }> = {
  gate: { z: 1, spread: 1, scale: 1, show: [1, 1, 1, 1] },
  portal: { z: 5, spread: 2.6, scale: 1.4, show: [1, 1, 1, 1] },
  hub: { z: -1.5, spread: 1.02, scale: 0.85, show: [0, 1, 1, 0] },
  stage: { z: -3, spread: 1, scale: 0.9, show: [0, 1, 1, 0] },
  finale: { z: -4, spread: 2.4, scale: 0.6, show: [0, 0, 0, 0] },
};

export function EdgeRoses() {
  const refs = useRef<(THREE.Group | null)[]>([]);
  const { size } = useThree();
  const goal = useMemo(() => new THREE.Vector3(), []);
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const mode = useScene.getState().mode;
    const L = LAYOUT[mode];
    const aspect = size.width / size.height;
    const { halfH, halfW } = visibleHalf(mode, L.z, aspect);
    const base = THREE.MathUtils.clamp(Math.min(halfW, halfH) * 0.58, 0.75, 1.9) * L.scale;
    const t = state.clock.elapsedTime;
    ROSES.forEach((r, i) => {
      const g = refs.current[i];
      if (!g) return;
      const spread = L.show[i] ? L.spread : L.spread * 2.2;
      goal.set(r.corner[0] * (halfW - 0.15) * spread, r.corner[1] * (halfH - 0.35) * spread + Math.sin(t * 0.5 + i) * 0.08, L.z);
      const k = 1 - Math.exp(-(mode === "portal" ? 1.8 : 1.1) * dt);
      g.position.lerp(goal, k);
      const s = g.scale.x + (base - g.scale.x) * k;
      g.scale.setScalar(s);
      g.rotation.y = r.rot[1] + Math.sin(t * 0.25 + i) * 0.12;
    });
  });
  return (
    <>
      {ROSES.map((r, i) => (
        <group
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          position={[r.corner[0] * 6, r.corner[1] * 6, 0]}
          rotation={[r.rot[0], r.rot[1], r.rot[2]]}
        >
          <Rose palette={r.palette} seed={r.seed} bloom={0.92} />
        </group>
      ))}
    </>
  );
}
