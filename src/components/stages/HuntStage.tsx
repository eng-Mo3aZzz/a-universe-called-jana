import { AnimatePresence, motion } from "framer-motion";
import { Check, Lightbulb, MapPin, Trophy } from "lucide-react";
import { useState, type FormEvent } from "react";
import { CompleteButton, StageShell } from "@/components/jana/StageShell";
import { ar, matchesAny } from "@/lib/normalize";
import { useProgress } from "@/lib/progress-store";
import { useContent } from "@/lib/use-content";
import { cn } from "@/lib/utils";
import type { StageProps } from "@/routes/universe.$stage";

const MISSES = ["لأ مش دي... فكري تاني", "قربتي! بس لأ", "ولا يهمك، جربي التلميح"];

export function HuntStage({ onComplete, done }: StageProps) {
  const { hunt } = useContent();
  const step = useProgress((s) => s.huntStep);
  const advance = useProgress((s) => s.advanceHunt);
  const [value, setValue] = useState("");
  const [hints, setHints] = useState(0);
  const [miss, setMiss] = useState(0);
  const [won, setWon] = useState<string | null>(null);
  const finished = step >= hunt.steps.length;
  const current = hunt.steps[Math.min(step, hunt.steps.length - 1)] ?? hunt.steps[0]!;

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!value.trim() || finished) return;
    if (matchesAny(value, current.answers)) {
      setWon(current.success);
      setMiss(0);
    } else {
      setMiss((m) => m + 1);
    }
  }

  function next() {
    setWon(null);
    setValue("");
    setHints(0);
    advance();
  }

  return (
    <StageShell stageId="hunt" footer={<CompleteButton ready={finished} hint="لاقي الكنز الأول" label="افتحي كوكب الهدايا" onComplete={onComplete} done={done} />}>
      <p className="mt-2 text-center text-sm leading-relaxed text-muted-foreground">{hunt.intro}</p>
      <div className="mt-5 flex items-center justify-center gap-2">
        {hunt.steps.map((s, i) => (
          <div key={s.id} className={cn("grid size-9 place-items-center rounded-full border text-sm transition-all", i < step ? "border-rose-gold bg-rose-gold text-primary-foreground" : i === step ? "border-rose-gold text-rose-gold animate-pulse-glow" : "border-border text-muted-foreground")}>
            {i < step ? <Check className="size-4" /> : ar(i + 1)}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {finished ? (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring" }} className="glass mt-6 rounded-3xl p-8 text-center">
            <motion.div animate={{ rotate: [0, -8, 8, 0], y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2.4 }} className="mx-auto grid size-20 place-items-center rounded-full bg-rose-gold/20 shadow-[var(--shadow-glow)]">
              <Trophy className="size-10 text-rose-gold" />
            </motion.div>
            <p className="mt-5 font-script text-3xl text-cream">{hunt.finalMessage}</p>
          </motion.div>
        ) : (
          <motion.form key={current.id} onSubmit={submit} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="glass mt-6 rounded-3xl p-5">
            <p className="flex items-center gap-1.5 text-sm text-rose-gold">
              <MapPin className="size-4" />
              {current.clue}
            </p>
            <h3 className="mt-3 font-script text-2xl leading-relaxed text-cream">{current.question}</h3>
            <motion.input
              key={miss}
              animate={miss ? { x: [0, -10, 10, -6, 6, 0] } : {}}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={!!won}
              placeholder="اكتبي الإجابة"
              aria-label="الإجابة"
              className={cn("mt-4 h-13 w-full rounded-2xl border bg-background/40 px-4 py-3 text-center text-lg focus:outline-none", miss ? "border-destructive/60" : "border-input focus:border-rose-gold")}
            />
            <AnimatePresence>
              {miss > 0 && !won && (
                <motion.p key={miss} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-center text-sm text-rose">
                  {MISSES[(miss - 1) % MISSES.length]}
                </motion.p>
              )}
            </AnimatePresence>
            {current.hints.slice(0, hints).map((h, i) => (
              <motion.p key={i} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 flex items-start gap-2 rounded-xl bg-muted px-3 py-2 text-sm text-foreground/85">
                <Lightbulb className="mt-0.5 size-4 shrink-0 text-rose-gold" />
                {h}
              </motion.p>
            ))}
            {won ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-4 text-center">
                <p className="font-script text-2xl text-rose-gold">{won}</p>
                <button type="button" onClick={next} className="bg-cta mt-4 h-12 w-full rounded-full text-primary-foreground">
                  {step === hunt.steps.length - 1 ? "افتحي الكنز" : "الدليل اللي بعده"}
                </button>
              </motion.div>
            ) : (
              <div className="mt-4 flex gap-2">
                <button type="submit" className="bg-cta h-12 flex-1 rounded-full text-primary-foreground">
                  تأكيد
                </button>
                {hints < current.hints.length && (
                  <button type="button" onClick={() => setHints((h) => h + 1)} className="h-12 rounded-full border border-glass-border px-4 text-sm">
                    تلميح
                  </button>
                )}
              </div>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </StageShell>
  );
}
