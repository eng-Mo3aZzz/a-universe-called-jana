export type Elapsed = { days: number; hours: number; minutes: number; seconds: number };

export function elapsedSince(startIso: string, now: Date = new Date()): Elapsed {
  const diff = Math.max(0, now.getTime() - new Date(startIso).getTime());
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

export function daysUntil(iso: string, now: Date = new Date()): number {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - now.getTime()) / 86400000));
}
