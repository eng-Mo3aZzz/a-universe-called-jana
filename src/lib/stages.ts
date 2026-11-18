import type { StageId } from "./progress-rules";

export type StageMeta = {
  id: StageId;
  name: string;
  tagline: string;
  colors: [string, string];
  glow: string;
  ring?: boolean;
  size: number;
};

// Planet look + labels (no private content here).
export const STAGE_META: Record<StageId, StageMeta> = {
  welcome: { id: "welcome", name: "كوكب البداية", tagline: "عيد ميلادك", colors: ["#f6c9cf", "#b8566f"], glow: "#ffb3c7", size: 1 },
  timeline: { id: "timeline", name: "كوكب الحكاية", tagline: "من أول يوم", colors: ["#e9c79b", "#8a4b3a"], glow: "#ffd2a1", ring: true, size: 0.95 },
  stars: { id: "stars", name: "سما الأسرار", tagline: "نجوم مستخبية", colors: ["#c9b8f2", "#4b3a8a"], glow: "#c7b3ff", size: 0.85 },
  play: { id: "play", name: "كوكب الهزار", tagline: "شايفاني إزاي؟", colors: ["#ffd1dc", "#d2607e"], glow: "#ff9cb8", size: 0.9 },
  hunt: { id: "hunt", name: "كوكب الكنز", tagline: "دوري ولاقي", colors: ["#f0d9a8", "#7a5a2b"], glow: "#ffd98a", ring: true, size: 0.9 },
  gifts: { id: "gifts", name: "كوكب الهدايا", tagline: "خمس مفاجآت", colors: ["#f3b8b8", "#7c1f3a"], glow: "#ff8fa8", size: 1 },
  letters: { id: "letters", name: "كوكب الجوابات", tagline: "جوابات مقفولة", colors: ["#e8dcf5", "#6b4f8f"], glow: "#e2ccff", size: 0.85 },
  finale: { id: "finale", name: "مجرة جنى", tagline: "آخر الحكاية", colors: ["#fff1e0", "#c98a6b"], glow: "#ffe0c2", ring: true, size: 1.15 },
};
