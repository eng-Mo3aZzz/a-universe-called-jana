import { motion } from "framer-motion";
import { Lock, Play } from "lucide-react";
import { useState, type CSSProperties } from "react";
import { Modal } from "@/components/jana/Modal";
import { PhotoFrame } from "@/components/jana/PhotoFrame";
import { SecretSpark } from "@/components/jana/SecretSpark";
import { CompleteButton, StageShell } from "@/components/jana/StageShell";
import type { Gift } from "@/content/types";
import { ar } from "@/lib/normalize";
import { usePlayer } from "@/lib/player";
import { isGiftUnlocked } from "@/lib/progress-rules";
import { useProgress } from "@/lib/progress-store";
import { useContent } from "@/lib/use-content";
import { cn } from "@/lib/utils";
import type { StageProps } from "@/routes/universe.$stage";

function GiftBox({ index, state, onOpen, big }: { index: number; state: "locked" | "ready" | "opened"; onOpen: () => void; big?: boolean }) {
  const [opening, setOpening] = useState(false);
  const open = state === "opened" || opening;
  const style = { "--box": `var(--gift-${index + 1})`, "--ribbon": `var(--gift-${index + 1}-ribbon)` } as CSSProperties;
  return (
    <button
      type="button"
      aria-label={`هدية ${ar(index + 1)}`}
      disabled={state === "locked" || opening}
      onClick={() => {
        if (state === "opened") return onOpen();
        setOpening(true);
        window.setTimeout(() => {
          setOpening(false);
          onOpen();
        }, 1100);
      }}
      className={cn("gift-scene", big && "gift-scene-lg", state === "locked" && "opacity-45 grayscale-[0.6]")}
      style={style}
    >
      <div className="gift-shadow" />
      {open && <motion.div className="gift-light" initial={{ opacity: 0, scaleY: 0.2 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ duration: 0.8 }} style={{ transformOrigin: "bottom" }} />}
      <motion.div className="gift" animate={state === "ready" && !opening ? { rotateY: [-38, -28, -38], y: [0, -6, 0] } : { rotateY: -38 }} transition={{ repeat: state === "ready" ? Infinity : 0, duration: 3 }} style={{ rotateX: -22 }}>
        <div className="gift-inside" />
        <div className="gift-face gift-back" />
        <div className="gift-face gift-left" />
        <div className="gift-face gift-bottom" />
        <div className="gift-face gift-right" />
        <div className="gift-face gift-front" />
        <motion.div className="gift-lid" initial={false} animate={open ? { y: -70, x: 26, rotateZ: 28, opacity: 0 } : { y: 0, x: 0, rotateZ: 0, opacity: 1 }} transition={{ duration: 0.9, ease: [0.3, 0, 0.2, 1] }}>
          <div className="gift-lid-face gift-lid-side gift-lid-back" />
          <div className="gift-lid-face gift-lid-side gift-lid-left" />
          <div className="gift-lid-face gift-lid-side gift-lid-right" />
          <div className="gift-lid-face gift-lid-side gift-lid-front" />
          <div className="gift-lid-face gift-lid-top" />
          <div className="gift-bow" />
        </motion.div>
      </motion.div>
      {state === "locked" && <Lock className="absolute bottom-2 size-4 text-muted-foreground" />}
    </button>
  );
}

function FlipCard({ front, back }: { front: string; back: string }) {
  const [flip, setFlip] = useState(false);
  return (
    <button type="button" onClick={() => setFlip((f) => !f)} className="relative h-36 w-full [perspective:800px]">
      <motion.div className="relative size-full [transform-style:preserve-3d]" animate={{ rotateY: flip ? 180 : 0 }} transition={{ duration: 0.6 }}>
        <div className="glass absolute inset-0 grid place-items-center rounded-2xl p-3 text-center text-sm [backface-visibility:hidden]">{front}</div>
        <div className="absolute inset-0 grid place-items-center rounded-2xl bg-burgundy p-3 text-center text-sm text-cream [backface-visibility:hidden] [transform:rotateY(180deg)]">{back}</div>
      </motion.div>
    </button>
  );
}

function GiftContent({ gift }: { gift: Gift }) {
  const tracks = usePlayer((s) => s.tracks);
  const playIndex = usePlayer((s) => s.playIndex);
  switch (gift.type) {
    case "letter":
      return (
        <div className="bg-paper mt-4 rounded-2xl p-6 text-ink shadow-inner">
          <p className="font-script text-2xl">{gift.greeting}</p>
          <p className="mt-4 whitespace-pre-line leading-loose">{gift.body}</p>
          <p className="mt-6 text-left font-script text-xl">{gift.signature}</p>
        </div>
      );
    case "gallery":
      return (
        <div className="-mx-6 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2">
          {gift.photos.map((p, i) => (
            <figure key={i} className="w-[78%] shrink-0 snap-center">
              <PhotoFrame src={p.image} className="aspect-[3/4]" />
              <figcaption className="mt-2 text-center text-sm text-muted-foreground">{p.caption}</figcaption>
            </figure>
          ))}
        </div>
      );
    case "music":
      return (
        <div className="mt-4">
          <p className="text-center text-sm leading-relaxed text-muted-foreground">{gift.note}</p>
          <ul className="mt-4 space-y-2">
            {gift.tracks.map((ti) => (
              <li key={ti}>
                <button type="button" onClick={() => playIndex(ti)} className="glass flex w-full items-center gap-3 rounded-2xl p-3 text-right">
                  <span className="bg-cta grid size-10 place-items-center rounded-full text-primary-foreground">
                    <Play className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm">{tracks[ti]?.title}</span>
                    <span className="block truncate text-xs text-muted-foreground">{tracks[ti]?.artist}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      );
    case "memories":
      return (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {gift.cards.map((c, i) => (
            <FlipCard key={i} front={c.front} back={c.back} />
          ))}
        </div>
      );
    case "surprise":
      return (
        <div className="relative mt-4 text-center">
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.span
              key={i}
              className="pointer-events-none absolute left-1/2 top-10 h-3 w-2 rounded-full bg-rose"
              initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
              animate={{ opacity: 0, x: Math.cos(i * 0.4) * 160, y: Math.sin(i * 0.4) * 120 + 80, rotate: 360 }}
              transition={{ duration: 2.2, delay: 0.2 }}
            />
          ))}
          <p className="font-script text-3xl text-shimmer">{gift.heading}</p>
          <PhotoFrame src={gift.image} className="mt-4" />
          <p className="mt-4 leading-loose">{gift.body}</p>
        </div>
      );
  }
}

export function GiftsStage({ onComplete, done }: StageProps) {
  const { gifts } = useContent();
  const opened = useProgress((s) => s.giftsOpened);
  const openGift = useProgress((s) => s.openGift);
  const [active, setActive] = useState<number | null>(null);
  const gift = active !== null ? gifts.items[active] : null;
  const all = opened >= gifts.items.length;

  return (
    <StageShell stageId="gifts" footer={<CompleteButton ready={all} hint={`فتحتي ${ar(Math.min(opened, gifts.items.length))} من ${ar(gifts.items.length)} هدايا`} onComplete={onComplete} done={done} />}>
      <p className="mt-2 text-center text-sm leading-relaxed text-muted-foreground">{gifts.intro}</p>
      <div className="mt-4 grid grid-cols-2 justify-items-center gap-y-2">
        {gifts.items.map((g, i) => {
          const state = i < opened ? "opened" : isGiftUnlocked(i, opened) ? "ready" : "locked";
          const last = i === gifts.items.length - 1;
          return (
            <div key={g.id} className={cn("flex flex-col items-center text-center", last && "col-span-2")}>
              <GiftBox
                index={i}
                state={state}
                big={last}
                onOpen={() => {
                  openGift(i);
                  setActive(i);
                }}
              />
              <p className="text-sm text-cream">{g.title}</p>
              <p className="text-xs text-muted-foreground">{state === "locked" ? "لسه مقفولة" : g.teaser}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-center">
        <SecretSpark id="x6" />
      </div>
      <Modal open={!!gift} onClose={() => setActive(null)} label="هدية">
        {gift && (
          <div className="pt-2">
            <p className="text-center text-xs text-rose-gold">هدية {ar((active ?? 0) + 1)}</p>
            <h3 className="mt-1 text-center font-script text-3xl text-cream">{gift.title}</h3>
            <GiftContent gift={gift} />
          </div>
        )}
      </Modal>
    </StageShell>
  );
}
