import * as THREE from "three";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef, type MutableRefObject } from "react";
import { sharedGeometry } from "./geometry";

export type RosePalette = { inner: string; outer: string; sheen: string };

export const ROSE_PALETTES = {
  burgundy: { inner: "#4a0717", outer: "#9c1f3e", sheen: "#ff9db5" },
  blush: { inner: "#b2385a", outer: "#f6b6c4", sheen: "#ffe3ea" },
  champagne: { inner: "#b45c4c", outer: "#f3cdb2", sheen: "#fff0e0" },
  wine: { inner: "#360411", outer: "#7d1430", sheen: "#ff8fab" },
} satisfies Record<string, RosePalette>;

const PETALS = 26;
const GREENS = 7; // 5 sepals + 2 leaves
const GOLDEN = 2.39996;

type RoseProps = ThreeElements["group"] & {
  bloom?: number;
  bloomRef?: MutableRefObject<number>;
  palette?: RosePalette;
  stem?: boolean;
  breathe?: boolean;
  seed?: number;
};

export function Rose({ bloom = 1, bloomRef, palette = ROSE_PALETTES.burgundy, stem = true, breathe = true, seed = 0, ...group }: RoseProps) {
  const petals = useRef<THREE.InstancedMesh>(null);
  const greens = useRef<THREE.InstancedMesh>(null);
  const current = useRef(-1);
  const geo = sharedGeometry();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const petalMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        vertexColors: true,
        side: THREE.DoubleSide,
        roughness: 0.5,
        metalness: 0,
        sheen: 1,
        sheenRoughness: 0.35,
        sheenColor: new THREE.Color(palette.sheen),
        emissive: new THREE.Color(palette.inner).multiplyScalar(0.12),
      }),
    [palette],
  );
  const greenMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#3f5a2e", roughness: 0.7, side: THREE.DoubleSide, emissive: new THREE.Color("#0d1a0a") }),
    [],
  );

  useLayoutEffect(() => {
    const mesh = petals.current;
    if (!mesh) return;
    const a = new THREE.Color(palette.inner);
    const b = new THREE.Color(palette.outer);
    const c = new THREE.Color();
    for (let i = 0; i < PETALS; i++) {
      const t = i / (PETALS - 1);
      c.copy(a).lerp(b, Math.pow(t, 0.8));
      c.offsetHSL(0, 0, Math.sin(i * 12.9898 + seed) * 0.02);
      mesh.setColorAt(i, c);
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [palette, seed]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const target = bloomRef ? bloomRef.current : bloom;
    const breath = breathe ? Math.sin(state.clock.elapsedTime * 0.7 + seed * 3) * 0.035 : 0;
    const goal = THREE.MathUtils.clamp(target + breath, 0, 1.05);
    const next = current.current < 0 ? goal : current.current + (goal - current.current) * (1 - Math.exp(-4 * dt));
    if (Math.abs(next - current.current) < 1e-4) return;
    current.current = next;
    const b = next;

    const mesh = petals.current;
    if (mesh) {
      for (let i = 0; i < PETALS; i++) {
        const t = i / (PETALS - 1);
        const az = i * GOLDEN + seed;
        const closed = 0.04 + 0.3 * t * t;
        const open = 0.2 + 1.32 * Math.pow(t, 0.85);
        const theta = closed + (open - closed) * b * (0.22 + 0.78 * t);
        const len = 0.3 + 0.74 * Math.pow(t, 0.8);
        const r = 0.012 + 0.06 * t * (0.4 + b * 0.6);
        dummy.position.set(Math.sin(az) * r, -0.05 * t, Math.cos(az) * r);
        dummy.rotation.set(theta, az, Math.sin(i * 3.1) * 0.08, "YXZ");
        dummy.scale.set(len * (0.95 + 0.5 * t), len, len * (1.5 - 0.7 * t));
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }
    const g = greens.current;
    if (g) {
      for (let i = 0; i < 5; i++) {
        const az = (i / 5) * Math.PI * 2 + seed;
        dummy.position.set(0, -0.04, 0);
        dummy.rotation.set(0.5 + 1.5 * b, az, 0, "YXZ");
        dummy.scale.set(0.22, 0.46, 0.25);
        dummy.updateMatrix();
        g.setMatrixAt(i, dummy.matrix);
      }
      const leaves: [number, number, number][] = [
        [-0.9, 0.4, 1.0],
        [-1.55, 3.4, 1.15],
      ];
      leaves.forEach(([y, az, tilt], k) => {
        dummy.position.set(0, y, 0);
        dummy.rotation.set(tilt, az, 0, "YXZ");
        dummy.scale.set(0.55, 0.62, 0.5);
        dummy.updateMatrix();
        g.setMatrixAt(5 + k, dummy.matrix);
      });
      g.count = stem ? GREENS : 5;
      g.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group {...group}>
      <instancedMesh ref={petals} args={[geo.petal, petalMat, PETALS]} frustumCulled={false} />
      <instancedMesh ref={greens} args={[geo.petal, greenMat, GREENS]} frustumCulled={false} />
      {stem && <mesh geometry={geo.stem} material={greenMat} />}
    </group>
  );
}
