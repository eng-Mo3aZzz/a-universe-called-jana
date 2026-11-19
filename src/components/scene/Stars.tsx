import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { mulberry32 } from "./textures";

const vertex = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uPixelRatio;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    float tw = 0.55 + 0.45 * sin(uTime * (0.6 + aPhase * 1.7) + aPhase * 30.0);
    vAlpha = tw;
    vColor = aColor;
    gl_PointSize = aSize * uPixelRatio * (60.0 / -mv.z);
  }
`;
const fragment = /* glsl */ `
  uniform float uSoft;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float core = smoothstep(0.5, 0.0, d);
    float a = mix(pow(core, 3.0), pow(core, 1.6) * 0.35, uSoft);
    gl_FragColor = vec4(vColor * (1.0 + core * 0.4), a * vAlpha);
  }
`;

function build(count: number, rMin: number, rMax: number, sizeMin: number, sizeMax: number, seed: number, palette: string[]) {
  const rand = mulberry32(seed);
  const pos = new Float32Array(count * 3);
  const size = new Float32Array(count);
  const phase = new Float32Array(count);
  const col = new Float32Array(count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const u = rand() * 2 - 1;
    const th = rand() * Math.PI * 2;
    const r = rMin + (rMax - rMin) * Math.pow(rand(), 0.6);
    const s = Math.sqrt(1 - u * u);
    pos.set([Math.cos(th) * s * r, u * r * 0.8, Math.sin(th) * s * r - 10], i * 3);
    size[i] = sizeMin + (sizeMax - sizeMin) * Math.pow(rand(), 3);
    phase[i] = rand();
    c.set(palette[Math.floor(rand() * palette.length)] ?? "#ffffff");
    col.set([c.r, c.g, c.b], i * 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
  g.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
  g.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
  return g;
}

export function Stars() {
  const group = useRef<THREE.Group>(null);
  const { stars, dust, starMat, dustMat } = useMemo(() => {
    const pr = Math.min(window.devicePixelRatio, 1.5);
    const mk = (soft: number) =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: { uTime: { value: 0 }, uPixelRatio: { value: pr }, uSoft: { value: soft } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
    return {
      stars: build(1600, 12, 80, 6, 30, 7, ["#fff6ea", "#ffd9e4", "#e5d6ff", "#ffffff", "#ffe2c4"]),
      dust: build(28, 14, 40, 500, 1100, 11, ["#7a1f45", "#4a2a7a", "#a8476c", "#3b1d5c"]),
      starMat: mk(0),
      dustMat: mk(1),
    };
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    (starMat.uniforms as { uTime: { value: number } }).uTime.value = t;
    (dustMat.uniforms as { uTime: { value: number } }).uTime.value = t * 0.15;
    if (group.current) group.current.rotation.y += Math.min(delta, 0.05) * 0.004;
  });

  return (
    <group ref={group}>
      <points geometry={dust} material={dustMat} frustumCulled={false} />
      <points geometry={stars} material={starMat} frustumCulled={false} />
    </group>
  );
}
