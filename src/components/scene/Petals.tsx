import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import { sharedGeometry } from "./geometry";
import { mulberry32 } from "./textures";

const COUNT = 34;

export function Petals() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.6, emissive: new THREE.Color("#3a0a18") }),
    [],
  );
  const data = useMemo(() => {
    const r = mulberry32(5);
    return Array.from({ length: COUNT }, () => ({
      x: (r() - 0.5) * 14,
      y: (r() - 0.5) * 14,
      z: -6 + r() * 9,
      vy: 0.18 + r() * 0.3,
      sway: 0.3 + r() * 0.6,
      phase: r() * 10,
      spin: (r() - 0.5) * 1.6,
      s: 0.12 + r() * 0.14,
    }));
  }, []);

  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const palette = ["#9c1f3e", "#f3a7ba", "#d9677f", "#f6cdb8", "#6e1029"].map((c) => new THREE.Color(c));
    data.forEach((_, i) => m.setColorAt(i, palette[i % palette.length] ?? palette[0]!));
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [data]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const m = mesh.current;
    if (!m) return;
    data.forEach((p, i) => {
      p.y -= p.vy * dt;
      if (p.y < -7) p.y = 7;
      dummy.position.set(p.x + Math.sin(t * p.sway + p.phase) * 0.6, p.y, p.z);
      dummy.rotation.set(t * p.spin + p.phase, t * p.spin * 0.7, Math.sin(t + p.phase));
      dummy.scale.setScalar(p.s);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={mesh} args={[sharedGeometry().small, mat, COUNT]} frustumCulled={false} />;
}
