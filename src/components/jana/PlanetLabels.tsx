import { Check, Lock, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import { planetScreen } from "@/lib/planet-screen";
import { currentStage, isStageUnlocked, STAGE_IDS, type StageId } from "@/lib/progress-rules";
import { useProgress } from "@/lib/progress-store";
import { STAGE_META } from "@/lib/stages";
import { cn } from "@/lib/utils";

/** Tappable planet names that follow the 3D planets on screen. */
export function PlanetLabels({ onSelect }: { onSelect: (id: StageId) => void }) {
  const completed = useProgress((s) => s.completed);
  const refs = useRef<Partial<Record<StageId, HTMLButtonElement | null>>>({});
  const current = currentStage(completed);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const w = window.innerWidth;
      for (const id of STAGE_IDS) {
        const el = refs.current[id];
        const p = planetScreen[id];
        if (!el) continue;
        if (!p) {
          el.style.opacity = "0";
          continue;
        }
        const left = p.x > w / 2;
        const gap = p.r + 8;
        el.style.opacity = "1";
        el.style.transform = left ? `translate(${p.x - gap}px, ${p.y}px) translate(-100%, -50%)` : `translate(${p.x + gap}px, ${p.y}px) translate(0, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0" dir="ltr">
      {STAGE_IDS.map((id) => {
        const unlocked = isStageUnlocked(id, completed);
        const done = completed.includes(id);
        return (
          <button
            key={id}
            type="button"
            ref={(el) => {
              refs.current[id] = el;
            }}
            onClick={() => onSelect(id)}
            dir="rtl"
            style={{ opacity: 0 }}
            className={cn("planet-label pointer-events-auto absolute left-0 top-0 flex items-center gap-1.5 transition-opacity duration-700", current === id && "planet-label-current", !unlocked && "planet-label-locked")}
          >
            {done ? <Check className="size-3.5 text-rose-gold" /> : unlocked ? <Sparkles className="size-3.5 text-rose-gold" /> : <Lock className="size-3.5" />}
            <span>{STAGE_META[id].name}</span>
          </button>
        );
      })}
    </div>
  );
}
