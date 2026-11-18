// The signed unlock token lives in localStorage (works inside iframes where cookies are blocked).
const KEY = "jana-universe-key";

export function readToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function saveToken(token: string) {
  try {
    window.localStorage.setItem(KEY, token);
  } catch {
    /* private mode: stays unlocked for this visit only */
  }
}

export function clearToken() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
