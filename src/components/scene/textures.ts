import * as THREE from "three";

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makePlanetTexture(c1: string, c2: string, seed: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const rand = mulberry32(seed);
  const a = new THREE.Color(c1);
  const b = new THREE.Color(c2);
  const tmp = new THREE.Color();
  const f1 = 0.05 + rand() * 0.08;
  const f2 = 0.15 + rand() * 0.2;
  const ph = rand() * 10;
  for (let y = 0; y < 128; y++) {
    const t = 0.5 + 0.5 * Math.sin(y * f1 + ph + Math.sin(y * f2) * 1.6);
    tmp.copy(a).lerp(b, t);
    ctx.fillStyle = `#${tmp.getHexString()}`;
    ctx.fillRect(0, y, 256, 1);
  }
  for (let k = 0; k < 60; k++) {
    ctx.globalAlpha = 0.06 + rand() * 0.12;
    ctx.fillStyle = rand() > 0.5 ? c1 : "#fff4ec";
    ctx.beginPath();
    ctx.ellipse(rand() * 256, rand() * 128, 8 + rand() * 40, 1.5 + rand() * 4, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  return tex;
}

export function makeMoonTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  const rand = mulberry32(42);
  ctx.fillStyle = "#e9dfd6";
  ctx.fillRect(0, 0, 512, 256);
  for (let k = 0; k < 18; k++) {
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = "#a99a9c";
    ctx.beginPath();
    ctx.ellipse(rand() * 512, rand() * 256, 30 + rand() * 70, 20 + rand() * 40, rand() * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let k = 0; k < 140; k++) {
    const x = rand() * 512;
    const y = rand() * 256;
    const r = 1.5 + Math.pow(rand(), 3) * 16;
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = "#9c8d90";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = "#fff7ef";
    ctx.beginPath();
    ctx.arc(x - r * 0.25, y - r * 0.25, r * 0.7, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function makeGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.45)");
  g.addColorStop(0.6, "rgba(255,255,255,0.08)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
