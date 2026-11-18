import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { useRef } from "react";
import { Rose, ROSE_PALETTES } from "./Rose";

/** The finale rose: blooms slowly from a closed bud. */
export function HeroRose() {
  const bloom = useRef(0);
  const start = useRef<number | null>(null);
  const group = useRef<THREE.Group>(null);
  const { size } = useThree();
  const portrait = size.width < size.height;
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (start.current === null) start.current = t;
    const p = THREE.MathUtils.clamp((t - start.current - 1.2) / 11, 0, 1);
    bloom.current = p * p * (3 - 2 * p);
    if (group.current) {
      group.current.rotation.y += Math.min(delta, 0.05) * 0.12;
      const s = group.current.scale.x + ((portrait ? 1.35 : 1.6) - group.current.scale.x) * (1 - Math.exp(-1.5 * Math.min(delta, 0.05)));
      group.current.scale.setScalar(s);
    }
  });
  return (
    <group position={[0, 1.25, 0]} rotation={[0.55, 0, 0]}>
      <group ref={group} scale={0.2}>
        <Rose bloomRef={bloom} palette={ROSE_PALETTES.burgundy} seed={0.8} breathe={false} />
      </group>
      <Sparkles count={60} scale={[4, 3, 3]} size={3} speed={0.3} color="#ffd8c4" opacity={0.8} />
      <spotLight position={[0, 4, 4]} angle={0.6} penumbra={0.8} intensity={40} color="#ffe3d6" distance={14} />
    </group>
  );
}
