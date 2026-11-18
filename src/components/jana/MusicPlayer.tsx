import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp, Music2, Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { usePlayer } from "@/lib/player";
import { ar } from "@/lib/normalize";
import { cn } from "@/lib/utils";

function fmt(s: number) {
  if (!Number.isFinite(s) || s <= 0) return ar("0:00");
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return ar(`${m}:${String(r).padStart(2, "0")}`);
}

export function MusicPlayer() {
  const p = usePlayer();
  const track = p.tracks[p.index];
  if (!p.tracks.length) return null;
  return (
    <div className="fixed left-4 top-[max(env(safe-area-inset-top),1rem)] z-40" dir="rtl">
      <button
        type="button"
        onClick={() => p.setOpen(!p.open)}
        aria-label="مشغل الأغاني"
        className={cn("glass relative grid size-11 place-items-center rounded-full", p.playing && "animate-pulse-glow")}
      >
        <Music2 className={cn("size-5 text-rose-gold", p.playing && "animate-spin-slow")} />
      </button>
      <AnimatePresence>
        {p.open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="glass absolute left-0 top-14 w-[min(88vw,340px)] rounded-3xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className={cn("grid size-12 shrink-0 place-items-center rounded-full bg-burgundy", p.playing && "animate-spin-slow")}>
                <div className="size-3 rounded-full bg-rose-gold" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{track?.title}</p>
                <p className="truncate text-xs text-muted-foreground">{track?.artist}</p>
              </div>
              <button type="button" onClick={() => p.setOpen(false)} aria-label="صغّري" className="grid size-8 place-items-center rounded-full text-muted-foreground">
                <ChevronUp className="size-4" />
              </button>
            </div>
            <div className="mt-4" dir="ltr">
              <input
                type="range"
                min={0}
                max={p.duration || 0}
                step={0.1}
                value={Math.min(p.current, p.duration || 0)}
                onChange={(e) => p.seek(Number(e.target.value))}
                aria-label="مكان الأغنية"
                className="w-full accent-rose-gold"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>{fmt(p.current)}</span>
                <span>{fmt(p.duration)}</span>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-center gap-4" dir="ltr">
              <button type="button" onClick={p.prev} aria-label="اللي قبلها" className="grid size-11 place-items-center rounded-full text-foreground">
                <SkipBack className="size-5" />
              </button>
              <button type="button" onClick={p.toggle} aria-label={p.playing ? "وقفي" : "شغّلي"} className="bg-cta grid size-14 place-items-center rounded-full text-primary-foreground">
                {p.playing ? <Pause className="size-6" /> : <Play className="size-6 translate-x-0.5" />}
              </button>
              <button type="button" onClick={p.next} aria-label="اللي بعدها" className="grid size-11 place-items-center rounded-full text-foreground">
                <SkipForward className="size-5" />
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2" dir="ltr">
              <Volume2 className="size-4 text-muted-foreground" />
              <input type="range" min={0} max={1} step={0.01} value={p.volume} onChange={(e) => p.setVolume(Number(e.target.value))} aria-label="الصوت" className="w-full accent-rose-gold" />
            </div>
            <ul className="mt-3 space-y-1 border-t border-border pt-3">
              {p.tracks.map((t, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => p.playIndex(i)}
                    className={cn("flex w-full items-center gap-2 rounded-xl px-3 py-2 text-right text-sm", i === p.index ? "bg-muted text-rose-gold" : "text-foreground")}
                  >
                    <span className="w-4 text-xs opacity-60">{ar(i + 1)}</span>
                    <span className="truncate">{t.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
