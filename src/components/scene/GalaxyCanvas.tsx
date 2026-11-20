import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useRef } from "react";
import { useScene } from "@/lib/scene-store";
import { CameraRig } from "./CameraRig";
import { EdgeRoses } from "./EdgeRoses";
import { HeroRose } from "./HeroRose";
import { Moon } from "./Moon";
import { Nebula } from "./Nebula";
import { Petals } from "./Petals";
import { Planets } from "./Planets";
import { Stars } from "./Stars";

function ReadySignal() {
  const done = useRef(false);
  useFrame((state) => {
    if (import.meta.env.DEV) (window as unknown as { __three?: unknown }).__three = state;
    if (done.current) return;
    done.current = true;
    document.getElementById("galaxy-root")?.setAttribute("data-scene-ready", "true");
  });
  return null;
}

function Scene() {
  const mode = useScene((s) => s.mode);
  return (
    <>
      <Nebula />
      <Stars />
      <ambientLight intensity={0.45} color="#e2cdff" />
      <directionalLight position={[4, 6, 6]} intensity={2.4} color="#ffe6d6" />
      <pointLight position={[-5, -3, 4]} intensity={30} color="#ff7aa8" distance={22} />
      <pointLight position={[5, 2, 3]} intensity={18} color="#b896ff" distance={22} />
      <Environment resolution={64}>
        <Lightformer intensity={1.6} position={[0, 5, 2]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} color="#ffdce8" />
        <Lightformer intensity={0.9} color="#b9a0ff" position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 1, 1]} />
        <Lightformer intensity={0.9} color="#ff9fb8" position={[5, 1, -1]} rotation-y={-Math.PI / 2} scale={[20, 1, 1]} />
      </Environment>
      <Moon />
      <EdgeRoses />
      <Petals />
      <Planets />
      {mode === "finale" && <HeroRose />}
      <CameraRig />
      <ReadySignal />
    </>
  );
}

export default function GalaxyCanvas() {
  return (
    <div id="galaxy-root" className="fixed inset-0 z-0">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 10], fov: 50, near: 0.1, far: 400 }} gl={{ antialias: true, powerPreference: "high-performance" }}>
        <color attach="background" args={["#07030c"]} />
        <Scene />
      </Canvas>
    </div>
  );
}
