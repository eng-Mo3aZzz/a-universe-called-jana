import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { CompleteButton, StageShell } from "@/components/jana/StageShell";
import { SecretSpark } from "@/components/jana/SecretSpark";
import { useProgress } from "@/lib/progress-store";
import { useContent } from "@/lib/use-content";
import type { StageProps } from "@/routes/universe.$stage";

export function WelcomeStage({ onComplete, done }: StageProps) {
  const { welcome, herName } = useContent();
  const wishMade = useProgress((s) => s.wishMade);
  const makeWish = useProgress((s) => s.makeWish);
  const [puff, setPuff] = useState(false);

  return (
    <StageShell stageId="welcome" footer={<CompleteButton ready={wishMade} hint="اتمني أمنيتك الأول" label={welcome.startButton} onComplete={onComplete} done={done} />}>
      <div className="relative pt-6 text-center">
        <SecretSpark id="x2" className="absolute -top-2 left-0" />
        <motion.p initial={{ opacity: 0, letterSpacing: "0.6em" }} animate={{ opacity: 1, letterSpacing: "0.2em" }} transition={{ duration: 1.6 }} className="text-sm text-rose-gold">
          {welcome.eyebrow}
        </motion.p>
        <motion.p dir="ltr" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1.2 }} className="mt-3 font-display text-3xl italic text-cream/90">
          Happy Birthday
        </motion.p>
        <h2 className="mt-1 flex justify-center font-script text-[6.5rem] leading-[1.1] text-shimmer glow-text">
          {herName.split("").map((ch, i) => (
            <motion.span key={i} initial={{ opacity: 0, y: 40, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.9 + i * 0.25, duration: 1.1 }}>
              {ch}
            </motion.span>
          ))}
        </h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 1 }} className="font-script text-2xl text-cream">
          {welcome.title}
        </motion.p>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2, duration: 1 }} className="glass mx-auto mt-6 rounded-3xl p-5 text-[15px] leading-loose text-foreground/90">
          {welcome.message}
        </motion.p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8, duration: 1 }} className="mt-10 flex flex-col items-center">
          <button
            type="button"
            aria-label="طفّي الشمعة"
            disabled={wishMade}
            onClick={() => {
              setPuff(true);
              makeWish();
            }}
            className="relative mt-12 flex flex-col items-center"
          >
            <div className="candle">
              <AnimatePresence>
                {!wishMade && (
                  <motion.div key="flame" exit={{ opacity: 0, scale: 0.2, y: -10 }} transition={{ duration: 0.4 }}>
                    <div className="candle-halo" />
                    <div className="flame" />
                  </motion.div>
                )}
              </AnimatePresence>
              {puff &&
                [0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="absolute bottom-full left-1/2 size-3 rounded-full bg-cream/40 blur-sm"
                    initial={{ opacity: 0.8, y: 0, x: 0, scale: 0.6 }}
                    animate={{ opacity: 0, y: -80 - i * 20, x: (i - 1) * 16, scale: 2.4 }}
                    transition={{ duration: 2, delay: i * 0.15 }}
                  />
                ))}
            </div>
            <div className="candle-stand mt-1" />
          </button>
          <AnimatePresence mode="wait">
            <motion.p key={wishMade ? "done" : "ask"} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {wishMade ? welcome.wishDone : welcome.wishPrompt}
            </motion.p>
          </AnimatePresence>
          {puff && (
            <div className="pointer-events-none relative">
              {Array.from({ length: 14 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute size-1.5 rounded-full bg-rose-gold"
                  initial={{ opacity: 1, x: 0, y: -120 }}
                  animate={{ opacity: 0, x: Math.cos(i * 0.45) * 120, y: -120 + Math.sin(i * 0.45) * 120 - 60 }}
                  transition={{ duration: 1.6, ease: "easeOut" }}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </StageShell>
  );
}
