import { motion } from "framer-motion";
import { Camera, History, MessageCircleHeart, PenLine } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/jana/Modal";
import { PhotoFrame } from "@/components/jana/PhotoFrame";
import { SecretSpark } from "@/components/jana/SecretSpark";
import { CompleteButton, StageShell } from "@/components/jana/StageShell";
import { ar } from "@/lib/normalize";
import { useProgress } from "@/lib/progress-store";
import { useContent } from "@/lib/use-content";
import { cn } from "@/lib/utils";
import type { StageProps } from "@/routes/universe.$stage";

const SPOTS: [number, number][] = [
  [18, 12], [70, 8], [45, 30], [82, 40], [15, 52], [58, 62], [30, 82], [78, 80], [48, 92], [8, 30],
];
const ICONS = { message: MessageCircleHeart, memory: History, photo: Camera, note: PenLine };
const KIND = { message: "رسالة", memory: "ذكرى", photo: "صورة", note: "ملحوظة" };

export function StarsStage({ onComplete, done }: StageProps) {
  const { stars } = useContent();
  const opened = useProgress((s) => s.starsOpened);
  const openStar = useProgress((s) => s.openStar);
  const [active, setActive] = useState<string | null>(null);
  const item = stars.items.find((s) => s.id === active);
  const count = stars.items.filter((s) => opened.includes(s.id)).length;
  const all = count === stars.items.length;
  const Icon = item ? ICONS[item.kind] : MessageCircleHeart;
  const pts = stars.items.map((_, i) => SPOTS[i % SPOTS.length]);

  return (
    <StageShell stageId="stars" footer={<CompleteButton ready={all} hint={`فتحتي ${ar(count)} من ${ar(stars.items.length)} نجوم`} onComplete={onComplete} done={done} />}>
      <p className="mt-2 text-center text-sm leading-relaxed text-muted-foreground">{stars.intro}</p>
      <div className="relative mx-auto mt-6 aspect-[3/4] w-full">
        <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          <polyline points={pts.map(([x, y]) => `${x},${y}`).join(" ")} fill="none" stroke="var(--rose-gold)" strokeOpacity="0.25" strokeWidth="0.3" strokeDasharray="1 1.2" vectorEffect="non-scaling-stroke" />
        </svg>
        {stars.items.map((s, i) => {
          const [x, y] = pts[i];
          const isOpen = opened.includes(s.id);
          return (
            <motion.button
              key={s.id}
              type="button"
              aria-label={`نجمة ${ar(i + 1)}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.12, type: "spring" }}
              onClick={() => {
                openStar(s.id);
                setActive(s.id);
              }}
              className={cn("absolute size-14 -translate-x-1/2 -translate-y-1/2", isOpen && "star-opened")}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <span className="star-core animate-twinkle" style={{ animationDelay: `${i * 0.4}s` }} />
            </motion.button>
          );
        })}
        <SecretSpark id="x4" className="absolute bottom-[38%] left-[64%]" />
      </div>

      <Modal open={!!item} onClose={() => setActive(null)} label="نجمة">
        {item && (
          <div className="pt-2 text-center">
            <motion.div initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring" }} className="mx-auto mb-3 grid size-16 place-items-center rounded-full bg-rose-gold/15 shadow-[var(--shadow-glow)]">
              <Icon className="size-7 text-rose-gold" />
            </motion.div>
            <p className="text-xs text-muted-foreground">{KIND[item.kind]}</p>
            <h3 className="mt-1 font-script text-3xl text-cream">{item.title}</h3>
            {(item.kind === "photo" || item.image) && <PhotoFrame src={item.image} className="mt-4" />}
            <p className="mt-4 leading-loose text-foreground/90">{item.text}</p>
          </div>
        )}
      </Modal>
    </StageShell>
  );
}
