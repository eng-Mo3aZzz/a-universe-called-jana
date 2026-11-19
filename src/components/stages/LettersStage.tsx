import { AnimatePresence, motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/jana/Modal";
import { SecretSpark } from "@/components/jana/SecretSpark";
import { CompleteButton, StageShell } from "@/components/jana/StageShell";
import type { ClientLetter } from "@/content/types";
import { ar } from "@/lib/normalize";
import { useProgress } from "@/lib/progress-store";
import { daysUntil } from "@/lib/time";
import { useContent } from "@/lib/use-content";
import type { StageProps } from "@/routes/universe.$stage";

function Envelope({ letter, onRead }: { letter: ClientLetter; onRead: () => void }) {
  const seeLetter = useProgress((s) => s.seeLetter);
  const [open, setOpen] = useState(false);
  const [shake, setShake] = useState(0);
  const [showWait, setShowWait] = useState(false);
  const days = letter.opensAt ? daysUntil(letter.opensAt) : 0;

  function tap() {
    seeLetter(letter.id);
    if (letter.sealed) {
      setShake((s) => s + 1);
      setShowWait(true);
      return;
    }
    if (open) return onRead();
    setOpen(true);
    window.setTimeout(onRead, 1500);
  }

  return (
    <div>
      <button type="button" onClick={tap} className="envelope block" aria-label={letter.title}>
        <div className="envelope-back" />
        <motion.div className="envelope-letter bg-paper" initial={false} animate={open ? { y: "-45%" } : { y: 0 }} transition={{ delay: 0.5, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }} style={{ zIndex: 1 }}>
          <p className="font-script text-lg">{letter.greeting ?? ""}</p>
          <div className="mt-2 space-y-1.5">
            <div className="h-1 w-4/5 rounded bg-ink/15" />
            <div className="h-1 w-3/5 rounded bg-ink/15" />
          </div>
        </motion.div>
        <div className="envelope-front" style={{ zIndex: 2 }} />
        <motion.div
          className="envelope-flap"
          initial={false}
          animate={open ? { rotateX: 180, zIndex: 0 } : { rotateX: 0, zIndex: 3 }}
          transition={{ duration: 0.7, zIndex: { delay: open ? 0.35 : 0 } }}
        />
        <AnimatePresence>
          {!open && (
            <motion.div key={shake} className="wax-seal" style={{ zIndex: 4 }} exit={{ scale: 0, opacity: 0, rotate: 40 }} animate={shake ? { rotate: [0, -12, 12, -8, 8, 0] } : {}} transition={{ duration: 0.5 }}>
              J
            </motion.div>
          )}
        </AnimatePresence>
      </button>
      <div className="mt-4 text-center">
        <h3 className="font-script text-2xl text-cream">{letter.title}</h3>
        <p className="mt-1 text-xs text-rose-gold">{letter.forLabel}</p>
        <AnimatePresence>
          {letter.sealed && showWait && (
            <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="glass-soft mx-auto mt-3 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm">
              <Clock className="size-4 text-rose-gold" />
              لسه {ar(days)} يوم... الجواب ده مستنيكي لحد ميعاده
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function LettersStage({ onComplete, done }: StageProps) {
  const { letters } = useContent();
  const seen = useProgress((s) => s.lettersSeen);
  const [reading, setReading] = useState<ClientLetter | null>(null);
  const all = letters.items.every((l) => seen.includes(l.id));
  return (
    <StageShell stageId="letters" footer={<CompleteButton ready={all} hint="دوسي على الجوابين" onComplete={onComplete} done={done} />}>
      <p className="mt-2 text-center text-sm leading-relaxed text-muted-foreground">{letters.intro}</p>
      <div className="mt-8 space-y-12">
        {letters.items.map((l) => (
          <Envelope key={l.id} letter={l} onRead={() => setReading(l)} />
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        <SecretSpark id="x7" />
      </div>
      <Modal open={!!reading} onClose={() => setReading(null)} label="جواب" className="bg-paper text-ink">
        {reading && (
          <div className="pt-6">
            <p className="font-script text-2xl">{reading.greeting}</p>
            <p className="mt-4 whitespace-pre-line leading-loose">{reading.body}</p>
            <p className="mt-6 text-left font-script text-xl">{reading.signature}</p>
          </div>
        )}
      </Modal>
    </StageShell>
  );
}
