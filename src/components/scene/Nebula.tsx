import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { useScene } from "@/lib/scene-store";

const noise = /* glsl */ `
vec3 mod289(vec3 x){return x - floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x - floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
float fbm(vec3 p){ float a = 0.5; float s = 0.0; for (int i = 0; i < 4; i++){ s += a * snoise(p); p *= 2.03; a *= 0.5; } return s; }
`;

const vertex = /* glsl */ `
varying vec3 vDir;
void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

const fragment = /* glsl */ `
uniform float uTime;
uniform float uFinale;
varying vec3 vDir;
${noise}
void main(){
  vec3 d = normalize(vDir);
  float t = uTime * 0.012;
  float n = fbm(d * 1.5 + vec3(t, 0.0, -t)) * 0.5 + 0.5;
  float n2 = fbm(d * 3.1 - vec3(0.0, t * 1.4, t) + n) * 0.5 + 0.5;
  vec3 base = mix(vec3(0.018, 0.008, 0.035), vec3(0.05, 0.015, 0.07), d.y * 0.5 + 0.5);
  vec3 purple = mix(vec3(0.16, 0.05, 0.28), vec3(0.32, 0.12, 0.36), uFinale);
  vec3 burgundy = mix(vec3(0.34, 0.035, 0.11), vec3(0.55, 0.16, 0.2), uFinale);
  vec3 pink = mix(vec3(0.9, 0.45, 0.62), vec3(1.0, 0.72, 0.6), uFinale);
  vec3 col = base;
  col = mix(col, purple, smoothstep(0.42, 0.95, n) * 0.85);
  col = mix(col, burgundy, smoothstep(0.5, 1.0, n2) * 0.8);
  col += pink * pow(max(0.0, n2 - 0.58) * 2.4, 3.0) * 0.55;
  float band = exp(-pow(d.y * 2.6 + d.x * 1.1, 2.0) * 2.2);
  col += vec3(0.32, 0.18, 0.32) * band * (0.25 + 0.75 * n) * 0.4;
  col *= 1.0 + uFinale * 0.25;
  gl_FragColor = vec4(col, 1.0);
}
`;

export function Nebula() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: { uTime: { value: 0 }, uFinale: { value: 0 } },
        side: THREE.BackSide,
        depthWrite: false,
        toneMapped: false,
      }),
    [],
  );
  useFrame((state, delta) => {
    const uniforms = mat.uniforms as { uTime: { value: number }; uFinale: { value: number } };
    uniforms.uTime.value = state.clock.elapsedTime;
    const goal = useScene.getState().mode === "finale" ? 1 : 0;
    const u = uniforms.uFinale;
    u.value += (goal - u.value) * (1 - Math.exp(-0.8 * Math.min(delta, 0.05)));
  });
  return (
    <mesh material={mat} renderOrder={-1} frustumCulled={false}>
      <sphereGeometry args={[150, 48, 24]} />
    </mesh>
  );
}
