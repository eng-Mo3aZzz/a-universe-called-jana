import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, MessageCircleHeart } from "lucide-react";
import { useEffect, useState } from "react";
import { SecretSpark } from "@/components/jana/SecretSpark";
import { CompleteButton, SectionTitle, StageShell } from "@/components/jana/StageShell";
import type { Stat } from "@/content/types";
import { ar } from "@/lib/normalize";
import { useProgress } from "@/lib/progress-store";
import { useContent } from "@/lib/use-content";
import { cn } from "@/lib/utils";
import type { StageProps } from "@/routes/universe.$stage";

function Counting() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setN((v) => v + Math.ceil(Math.random() * 37)), 120);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-display text-2xl tabular-nums text-rose-gold">{ar(n)}</span>
      <span className="animate-pulse text-xs text-muted-foreground">جاري الحساب...</span>
    </div>
  );
}

function StatRow({ stat, index }: { stat: Stat; index: number }) {
  return (
    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.12 }} className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm">{stat.label}</p>
        {stat.kind === "percent" && <span className="font-display text-xl text-rose-gold">{ar(stat.value)}</span>}
        {stat.kind === "infinite" && <span className="font-display text-3xl leading-none text-rose-gold">{stat.value}</span>}
        {stat.kind === "danger" && (
          <motion.span animate={{ scale: [1, 1.12, 1] }} transition={{ repeat: Infinity, duration: 0.9 }} className="flex items-center gap-1 rounded-full bg-destructive/20 px-3 py-1 text-sm font-medium text-destructive">
            <AlertTriangle className="size-4 animate-wiggle" />
            {stat.value}
          </motion.span>
        )}
      </div>
      {stat.kind === "percent" && (
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <motion.div className="bg-cta h-full rounded-full" initial={{ width: 0 }} whileInView={{ width: `${stat.percent ?? 0}%` }} viewport={{ once: true }} transition={{ duration: 1.6, ease: "easeOut", delay: 0.2 }} />
        </div>
      )}
      {stat.kind === "danger" && (
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <motion.div className="h-full rounded-full bg-destructive" initial={{ width: 0 }} whileInView={{ width: "100%" }} viewport={{ once: true }} transition={{ duration: 0.8 }} />
        </div>
      )}
      {stat.kind === "counting" && (
        <div className="mt-2">
          <Counting />
        </div>
      )}
    </motion.div>
  );
}

export function PlayStage({ onComplete, done }: StageProps) {
  const { play, partnerName } = useContent();
  const answers = useProgress((s) => s.answers);
  const answer = useProgress((s) => s.answer);
  const firstOpen = play.questions.findIndex((q) => answers[q.id] === undefined);
  const [index, setIndex] = useState(firstOpen === -1 ? 0 : firstOpen);
  const q = play.questions[index] ?? play.questions[0]!;
  const picked = answers[q.id];
  const answeredAll = play.questions.every((x) => answers[x.id] !== undefined);

  return (
    <StageShell stageId="play" footer={<CompleteButton ready={answeredAll} hint="جاوبي على كل الأسئلة الأول" onComplete={onComplete} done={done} />}>
      <div className="relative text-center">
        <h2 dir="ltr" className="mt-2 font-display text-[2rem] italic text-shimmer">
          What You See In Me
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{play.intro}</p>
        <SecretSpark id="x5" className="absolute -top-1 right-0" />
      </div>

      <div className="mt-5 flex justify-center gap-2">
        {play.questions.map((x, i) => (
          <button key={x.id} type="button" aria-label={`سؤال ${ar(i + 1)}`} onClick={() => setIndex(i)} className={cn("h-2 rounded-full transition-all", i === index ? "w-8 bg-rose-gold" : answers[x.id] !== undefined ? "w-2 bg-rose" : "w-2 bg-cream/25")} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={q.id} initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.4 }} className="glass mt-5 rounded-3xl p-5">
          <p className="text-xs text-rose-gold">
            سؤال {ar(index + 1)} من {ar(play.questions.length)}
          </p>
          <h3 className="mt-2 font-script text-2xl leading-relaxed text-cream">{q.question}</h3>
          <div className="mt-4 grid gap-2">
            {q.options.map((o, i) => (
              <button
                key={i}
                type="button"
                onClick={() => answer(q.id, i)}
                className={cn(
                  "min-h-12 rounded-2xl border px-4 py-3 text-right text-[15px] transition-all active:scale-[0.98]",
                  picked === i ? "border-rose-gold bg-rose-gold/15 text-cream" : "border-border bg-background/30 text-foreground",
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
          <AnimatePresence>
            {picked !== undefined && (
              <motion.div key={picked} initial={{ opacity: 0, y: 14, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", damping: 18 }} className="mt-5 rounded-2xl bg-burgundy/60 p-4">
                <p className="flex items-center gap-1.5 text-xs text-rose-gold">
                  <MessageCircleHeart className="size-4" />
                  رد {partnerName}:
                </p>
                <p className="mt-2 leading-relaxed text-cream">{q.options[picked]?.response}</p>
              </motion.div>
            )}
          </AnimatePresence>
          {picked !== undefined && index < play.questions.length - 1 && (
            <button type="button" onClick={() => setIndex(index + 1)} className="mt-4 w-full rounded-full border border-glass-border py-3 text-sm">
              السؤال اللي بعده
            </button>
          )}
        </motion.div>
      </AnimatePresence>

      <SectionTitle sub="(موثقة ومختومة)">{play.statsTitle}</SectionTitle>
      <div className="grid gap-3">
        {play.stats.map((s, i) => (
          <StatRow key={s.label} stat={s} index={i} />
        ))}
      </div>
    </StageShell>
  );
}
