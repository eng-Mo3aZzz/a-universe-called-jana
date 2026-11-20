import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { useScene, type SceneMode } from "@/lib/scene-store";
import { makeGlowTexture, makeMoonTexture } from "./textures";

const SPOTS: Record<SceneMode, [number, number, number]> = {
  gate: [0.9, 1.05, -14],
  portal: [1.6, 1.6, -10],
  hub: [-0.85, 0.3, -26],
  stage: [0.8, 0.9, -20],
  finale: [0.85, 1.25, -16],
};

export function Moon() {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const { size } = useThree();
  const { map, glow } = useMemo(() => ({ map: makeMoonTexture(), glow: makeGlowTexture() }), []);
  const goal = useMemo(() => new THREE.Vector3(), []);
  const placed = useRef(false);
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const mode = useScene.getState().mode;
    const [fx, fy, z] = SPOTS[mode];
    // place relative to the visible frame so it stays on screen on phones
    const cam = state.camera.position;
    const half = Math.max(1, cam.z - z) * Math.tan((25 * Math.PI) / 180);
    const aspect = size.width / size.height;
    goal.set(fx * half * aspect * 0.78, fy * half * 0.8, z);
    group.current?.position.lerp(goal, placed.current ? 1 - Math.exp(-0.9 * dt) : 1);
    placed.current = true;
    if (mesh.current) mesh.current.rotation.y += dt * 0.02;
  });
  return (
    <group ref={group} position={[2, 4, -14]}>
      <mesh ref={mesh}>
        <sphereGeometry args={[1.1, 48, 32]} />
        <meshStandardMaterial map={map} emissiveMap={map} emissive="#fff1e6" emissiveIntensity={0.55} roughness={1} />
      </mesh>
      <sprite scale={[7, 7, 1]}>
        <spriteMaterial map={glow} color="#ffd9cf" transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <pointLight color="#ffe6d8" intensity={6} distance={30} />
    </group>
  );
}
