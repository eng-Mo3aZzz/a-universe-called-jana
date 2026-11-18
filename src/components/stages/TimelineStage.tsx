import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PhotoFrame } from "@/components/jana/PhotoFrame";
import { SecretSpark } from "@/components/jana/SecretSpark";
import { CompleteButton, SectionTitle, StageShell } from "@/components/jana/StageShell";
import { ar } from "@/lib/normalize";
import { elapsedSince, type Elapsed } from "@/lib/time";
import { useContent } from "@/lib/use-content";
import type { StageProps } from "@/routes/universe.$stage";

function useElapsed(start: string): Elapsed {
  const [e, setE] = useState(() => elapsedSince(start));
  useEffect(() => {
    const id = window.setInterval(() => setE(elapsedSince(start)), 1000);
    return () => window.clearInterval(id);
  }, [start]);
  return e;
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="glass flex flex-col items-center rounded-2xl px-1 py-3">
      <motion.span key={value} initial={{ y: -6, opacity: 0.4 }} animate={{ y: 0, opacity: 1 }} className="font-display text-3xl font-medium text-shimmer tabular-nums">
        {ar(value)}
      </motion.span>
      <span className="mt-1 text-[11px] text-muted-foreground">{label}</span>
    </div>
  );
}

export function TimelineStage({ onComplete, done }: StageProps) {
  const { timeline, relationshipStart } = useContent();
  const e = useElapsed(relationshipStart);
  const [reachedEnd, setReachedEnd] = useState(done);
  return (
    <StageShell stageId="timeline" footer={<CompleteButton ready={reachedEnd} hint="انزلي لآخر الحكاية" onComplete={onComplete} done={done} />}>
      <p className="mt-2 text-center text-sm leading-relaxed text-muted-foreground">{timeline.intro}</p>
      <div className="mt-5 grid grid-cols-4 gap-2">
        <Unit value={e.days} label="يوم" />
        <Unit value={e.hours} label="ساعة" />
        <Unit value={e.minutes} label="دقيقة" />
        <Unit value={e.seconds} label="ثانية" />
      </div>
      <p className="mt-3 text-center text-xs text-rose-gold">ولسه العداد شغال...</p>

      <SectionTitle sub="لحظاتنا واحدة واحدة">حكايتنا</SectionTitle>
      <div className="relative">
        <div className="absolute bottom-0 right-4 top-0 w-px bg-gradient-to-b from-rose-gold/70 via-rose/40 to-transparent" />
        {timeline.cards.map((c, i) => (
          <motion.article
            key={c.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8 }}
            onViewportEnter={() => i === timeline.cards.length - 1 && setReachedEnd(true)}
            className="relative mb-6 pr-11"
          >
            <span className="absolute right-[11px] top-5 size-3 rounded-full bg-rose-gold shadow-[var(--shadow-glow)]" />
            <div className="glass rounded-3xl p-4">
              <span className="inline-block rounded-full bg-muted px-3 py-1 text-xs text-rose-gold">{c.date}</span>
              <h3 className="mt-3 font-script text-2xl text-cream">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/85">{c.text}</p>
              <PhotoFrame src={c.image} label={c.imageLabel} className="mt-4" />
            </div>
            {i === 2 && <SecretSpark id="x3" className="absolute -left-2 top-1/2" />}
          </motion.article>
        ))}
      </div>
    </StageShell>
  );
}
