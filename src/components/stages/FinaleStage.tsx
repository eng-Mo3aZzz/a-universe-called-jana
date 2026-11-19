import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Mic, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PhotoFrame } from "@/components/jana/PhotoFrame";
import { usePlayer } from "@/lib/player";
import { useProgress } from "@/lib/progress-store";
import { useContent } from "@/lib/use-content";
import type { StageProps } from "@/routes/universe.$stage";

function VoiceNote({ src, label }: { src: string | null; label: string }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  return (
    <div className="glass flex items-center gap-3 rounded-full p-2 pl-5">
      <button
        type="button"
        disabled={!src}
        aria-label={playing ? "وقفي التسجيل" : "شغّلي التسجيل"}
        onClick={() => {
          const a = audio.current;
          if (!a) return;
          if (a.paused) {
            usePlayer.getState().pause();
            void a.play();
          } else a.pause();
        }}
        className="bg-cta grid size-12 shrink-0 place-items-center rounded-full text-primary-foreground disabled:opacity-40"
      >
        {playing ? <Pause className="size-5" /> : <Play className="size-5 translate-x-0.5" />}
      </button>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 truncate text-sm">
          <Mic className="size-3.5 text-rose-gold" />
          {label}
        </p>
        <div className="mt-2 flex h-5 items-end gap-[3px]" dir="ltr" aria-hidden>
          {Array.from({ length: 28 }).map((_, i) => (
            <span key={i} className={i / 28 < progress ? "w-1 rounded-full bg-rose-gold" : "w-1 rounded-full bg-cream/25"} style={{ height: `${30 + Math.abs(Math.sin(i * 1.7)) * 70}%` }} />
          ))}
        </div>
      </div>
      {src && (
        <audio
          ref={audio}
          src={src}
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime / (e.currentTarget.duration || 1))}
        />
      )}
    </div>
  );
}

export function FinaleStage({ onComplete, done }: StageProps) {
  const { finale, herName } = useContent();
  const [line, setLine] = useState(-1);
  const completeStage = useProgress((s) => s.completeStage);
  const reset = useProgress((s) => s.reset);
  const linesDone = line >= finale.lines.length;

  useEffect(() => {
    const t = window.setTimeout(() => setLine((l) => l + 1), line < 0 ? 4500 : 2600);
    if (linesDone) window.clearTimeout(t);
    return () => window.clearTimeout(t);
  }, [line, linesDone]);

  return (
    <motion.div className="fixed inset-0 z-10 overflow-y-auto overscroll-contain" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}>
      <Link to="/universe" className="glass-soft fixed right-4 top-[max(env(safe-area-inset-top),1rem)] z-20 flex h-10 items-center gap-1.5 rounded-full px-3 text-sm">
        <ArrowRight className="size-4" />
        المجرة
      </Link>
      <section className="relative flex min-h-[100svh] flex-col items-center justify-end px-6 pb-[14svh] text-center">
        <div className="h-[22svh]">
          {finale.lines.map((l, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
              animate={i === line ? { opacity: 1, y: 0, filter: "blur(0px)" } : i < line ? { opacity: 0, y: -12, filter: "blur(6px)" } : {}}
              transition={{ duration: 1.2 }}
              className="absolute inset-x-6 font-script text-3xl leading-relaxed text-cream glow-text"
              style={{ bottom: "18svh" }}
            >
              {i === finale.lines.length - 1 ? <span className="text-[3.5rem] text-shimmer">{l}</span> : l}
            </motion.p>
          ))}
        </div>
        {linesDone && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.4 }} className="flex flex-col items-center">
            <p dir="ltr" className="font-display text-2xl italic text-shimmer">
              A Universe Called {herName === "جنى" ? "Jana" : herName}
            </p>
            <ChevronDown className="mt-4 size-6 animate-bounce text-rose-gold" />
          </motion.div>
        )}
      </section>

      <section className="stage-veil px-5 pb-24 pt-16">
        <div className="mx-auto max-w-lg">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.2 }} className="glass rounded-[2rem] p-3">
            {finale.media.type === "video" && finale.media.src ? (
              <video src={finale.media.src} controls playsInline className="w-full rounded-3xl" />
            ) : (
              <PhotoFrame src={finale.media.src} label={finale.media.label} className="aspect-[4/5] rounded-3xl" />
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="mt-8">
            <VoiceNote src={finale.voice.src} label={finale.voice.label} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4 }}
            onViewportEnter={() => completeStage("finale")}
            className="mt-14 text-center"
          >
            <p className="font-script text-[2.4rem] leading-[1.6] text-cream glow-text">{finale.finalMessage}</p>
            <p className="mt-8 font-script text-2xl text-rose-gold">{finale.signature}</p>
          </motion.div>

          <div className="mt-16 flex flex-col items-center gap-3">
            <button type="button" onClick={onComplete} className="bg-cta h-14 w-full rounded-full text-primary-foreground">
              {done ? "رجوع للمجرة" : "رجوع للمجرة"}
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("متأكدة؟ هتبدئي الرحلة من الأول خالص")) reset();
              }}
              className="text-xs text-muted-foreground underline-offset-4"
            >
              ابدئي الرحلة من الأول
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
