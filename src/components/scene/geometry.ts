import * as THREE from "three";

/** One rose petal: cupped toward the flower's center, tip curling outward. +y = length, +z = outward. */
export function createPetalGeometry({ cup = 0.55, curl = 0.3, segU = 12, segV = 10 } = {}) {
  const positions: number[] = [];
  const colors: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  for (let i = 0; i <= segU; i++) {
    const u = i / segU;
    const taper = THREE.MathUtils.smoothstep(u, 0, 0.4) * 0.78 + 0.22;
    const w = 0.5 * Math.pow(Math.sin(Math.PI * (0.1 + 0.8 * u)), 0.7) * taper;
    for (let j = 0; j <= segV; j++) {
      const v = (j / segV) * 2 - 1;
      const x = v * w;
      const y = u;
      let z = -(v * v) * cup * (0.25 + u * 0.9) * w * 2;
      z += curl * Math.pow(u, 3);
      z += curl * 0.7 * v * v * Math.pow(u, 4);
      z += Math.sin(v * 9 + u * 4) * 0.008 * u;
      positions.push(x, y, z);
      const shade = Math.min(1, 0.38 + 0.62 * Math.pow(u, 0.6) + 0.08 * Math.abs(v) * u);
      colors.push(shade, shade * 0.97, shade * 0.97);
      uvs.push((v + 1) / 2, u);
    }
  }
  const row = segV + 1;
  for (let i = 0; i < segU; i++) {
    for (let j = 0; j < segV; j++) {
      const a = i * row + j;
      const b = a + row;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}

export function createStemGeometry() {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.05, -0.7, 0.03),
    new THREE.Vector3(-0.05, -1.5, 0),
    new THREE.Vector3(0.03, -2.4, -0.02),
  ]);
  return new THREE.TubeGeometry(curve, 24, 0.032, 6, false);
}

let cache: { petal: THREE.BufferGeometry; small: THREE.BufferGeometry; stem: THREE.BufferGeometry } | null = null;
export function sharedGeometry() {
  if (!cache) {
    cache = {
      petal: createPetalGeometry(),
      small: createPetalGeometry({ cup: 0.3, curl: 0.2, segU: 6, segV: 5 }),
      stem: createStemGeometry(),
    };
  }
  return cache;
}
