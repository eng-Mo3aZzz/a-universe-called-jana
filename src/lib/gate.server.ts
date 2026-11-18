// Server-only helpers for the password gate. Never import from components.
import { normalizeArabic } from "./normalize";

const enc = new TextEncoder();
const TOKEN_DAYS = 500;

function safeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

function toB64Url(buf: ArrayBuffer): string {
  let s = "";
  for (const x of new Uint8Array(buf)) s += String.fromCharCode(x);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(payload: string): Promise<string> {
  const secret = process.env["SESSION_SECRET"];
  if (!secret) throw new Error("SESSION_SECRET is not set");
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toB64Url(await crypto.subtle.sign("HMAC", key, enc.encode(payload)));
}

export async function passwordMatches(input: string): Promise<boolean> {
  const expected = process.env["SITE_PASSWORD"];
  if (!expected) throw new Error("SITE_PASSWORD is not set");
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(normalizeArabic(input))),
    crypto.subtle.digest("SHA-256", enc.encode(normalizeArabic(expected))),
  ]);
  return safeEqual(new Uint8Array(a), new Uint8Array(b));
}

export async function issueToken(): Promise<string> {
  const exp = Date.now() + TOKEN_DAYS * 86400000;
  return `${exp}.${await sign(`jana-unlocked:${exp}`)}`;
}

export async function verifyToken(token: string | null | undefined): Promise<boolean> {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || !(Number(exp) > Date.now())) return false;
  const expected = await sign(`jana-unlocked:${exp}`);
  return safeEqual(enc.encode(expected), enc.encode(sig));
}
