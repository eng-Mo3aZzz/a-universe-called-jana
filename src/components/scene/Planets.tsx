import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { planetScreen } from "@/lib/planet-screen";
import { useMemo, useRef } from "react";
import { useProgress } from "@/lib/progress-store";
import { currentStage, isStageUnlocked, STAGE_IDS, type StageId } from "@/lib/progress-rules";
import { STAGE_META } from "@/lib/stages";
import { useScene } from "@/lib/scene-store";
import { makePlanetTexture } from "./textures";
import { visibleHalf } from "./layout";

const atmoVertex = /* glsl */ `
varying vec3 vN; varying vec3 vV;
void main(){ vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position,1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }
`;
const atmoFragment = /* glsl */ `
uniform vec3 uColor; uniform float uIntensity;
varying vec3 vN; varying vec3 vV;
void main(){ float f = pow(1.0 - max(dot(vN, vV), 0.0), 2.4); gl_FragColor = vec4(uColor * 1.4, f * uIntensity); }
`;

function usePlanetLayout() {
  const { size } = useThree();
  return useMemo(() => {
    const aspect = size.width / size.height;
    const { halfH, halfW } = visibleHalf("hub", 0, aspect);
    const top = halfH * 0.58;
    const bottom = -halfH * 0.74;
    const amp = Math.min(halfW * 0.55, 3.6);
    const radius = THREE.MathUtils.clamp(halfW * 0.15, 0.3, 0.55);
    return STAGE_IDS.map((id, i) => {
      const y = top + (bottom - top) * (i / (STAGE_IDS.length - 1));
      const x = Math.sin(i * 1.3 + 0.5) * amp;
      const z = -Math.cos(i * 0.9) * 0.6;
      return { id, pos: new THREE.Vector3(x, y, z), r: radius * STAGE_META[id].size };
    });
  }, [size.width, size.height]);
}

function Planet({ id, pos, r, index }: { id: StageId; pos: THREE.Vector3; r: number; index: number }) {
  const meta = STAGE_META[id];
  const completed = useProgress((s) => s.completed);
  const justUnlocked = useProgress((s) => s.justUnlocked);
  const unlocked = isStageUnlocked(id, completed);
  const done = completed.includes(id);
  const current = currentStage(completed) === id;
  const fresh = justUnlocked === id;
  const group = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const tex = useMemo(() => makePlanetTexture(meta.colors[0], meta.colors[1], index * 97 + 13), [meta, index]);
  const atmo = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: atmoVertex,
        fragmentShader: atmoFragment,
        uniforms: { uColor: { value: new THREE.Color(meta.glow) }, uIntensity: { value: 1 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [meta],
  );
  const appear = useRef(0);
  const { size, camera } = useThree();
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const g = group.current;
    if (!g) return;
    appear.current = Math.min(1, appear.current + dt * 0.9);
    const pop = fresh ? 1 + Math.sin(t * 5) * 0.12 * Math.max(0, Math.sin(t * 1.2)) : 1;
    g.position.set(pos.x, pos.y + Math.sin(t * 0.8 + index) * 0.07, pos.z);
    g.scale.setScalar(appear.current * pop);
    if (body.current) body.current.rotation.y += dt * 0.25;
    g.updateMatrixWorld();
    tmp.setFromMatrixPosition(g.matrixWorld);
    const dist = tmp.distanceTo(camera.position);
    tmp.project(camera);
    const fov = (camera as THREE.PerspectiveCamera).fov;
    planetScreen[id] = {
      x: (tmp.x * 0.5 + 0.5) * size.width,
      y: (-tmp.y * 0.5 + 0.5) * size.height,
      r: (r * g.scale.x * size.height) / (2 * dist * Math.tan((fov * Math.PI) / 360)),
    };
    (atmo.uniforms as { uIntensity: { value: number } }).uIntensity.value = unlocked ? (current ? 1.2 + Math.sin(t * 2.4) * 0.4 : 0.9) : 0.25;
    if (halo.current) {
      const m = halo.current.material as THREE.MeshBasicMaterial;
      const on = current || fresh;
      m.opacity = on ? 0.35 + Math.sin(t * 2.4) * 0.2 : 0;
      halo.current.scale.setScalar(1 + ((t * 0.5) % 1) * 0.5);
    }
  });

  const select = () => {
    const s = useScene.getState();
    if (s.mode === "hub") s.planetHandler?.(id);
  };
  const tint = unlocked ? "#ffffff" : "#4d4352";

  return (
    <group ref={group} position={pos.toArray()}>
      <mesh ref={body} onClick={(e) => (e.stopPropagation(), select())}>
        <sphereGeometry args={[r, 40, 28]} />
        <meshStandardMaterial map={tex} color={tint} roughness={0.85} emissive={meta.glow} emissiveIntensity={unlocked ? 0.08 : 0} />
      </mesh>
      <mesh scale={1.22} material={atmo}>
        <sphereGeometry args={[r, 32, 20]} />
      </mesh>
      {meta.ring && (
        <mesh rotation={[1.25, 0.2, 0.3]}>
          <ringGeometry args={[r * 1.35, r * 1.9, 64]} />
          <meshBasicMaterial color={meta.glow} transparent opacity={unlocked ? 0.35 : 0.12} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      )}
      <mesh ref={halo}>
        <ringGeometry args={[r * 1.3, r * 1.38, 64]} />
        <meshBasicMaterial color="#ffd8c0" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

export function Planets() {
  const layout = usePlanetLayout();
  const visible = useScene((s) => s.mode === "hub");
  const completed = useProgress((s) => s.completed);
  const points = layout.map((p) => p.pos);
  const doneIndex = STAGE_IDS.filter((id) => completed.includes(id)).length;
  return (
    <group visible={visible}>
      <Line points={points} color="#e8c7d8" lineWidth={1} dashed dashSize={0.12} gapSize={0.12} transparent opacity={0.28} />
      {doneIndex > 0 && <Line points={points.slice(0, Math.min(doneIndex + 1, points.length))} color="#f1c59f" lineWidth={1.6} transparent opacity={0.85} />}
      {layout.map((p, i) => (
        <Planet key={p.id} id={p.id} pos={p.pos} r={p.r} index={i} />
      ))}
    </group>
  );
}
