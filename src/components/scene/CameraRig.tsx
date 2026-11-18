import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { useScene } from "@/lib/scene-store";
import { CAMERA } from "./layout";

export function CameraRig() {
  const look = useMemo(() => new THREE.Vector3(), []);
  const goalPos = useMemo(() => new THREE.Vector3(), []);
  const goalLook = useMemo(() => new THREE.Vector3(), []);
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const mode = useScene.getState().mode;
    const shot = CAMERA[mode];
    const t = state.clock.elapsedTime;
    const cam = state.camera as THREE.PerspectiveCamera;
    const px = state.pointer.x * shot.parallax;
    const py = state.pointer.y * shot.parallax * 0.6;
    goalPos.set(shot.pos[0] + px + Math.sin(t * 0.13) * 0.25, shot.pos[1] + py + Math.cos(t * 0.11) * 0.18, shot.pos[2]);
    goalLook.set(...shot.look);
    const k = 1 - Math.exp(-shot.speed * dt);
    cam.position.lerp(goalPos, k);
    look.lerp(goalLook, k);
    cam.lookAt(look);
    const fov = cam.fov + (shot.fov - cam.fov) * k;
    if (Math.abs(fov - cam.fov) > 0.01) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
  });
  return null;
}
