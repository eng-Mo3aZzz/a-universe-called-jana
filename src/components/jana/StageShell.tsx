import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { ar } from "@/lib/normalize";
import { STAGE_IDS, type StageId } from "@/lib/progress-rules";
import { STAGE_META } from "@/lib/stages";

type Props = { stageId: StageId; children: ReactNode; footer?: ReactNode };

export function StageShell({ stageId, children, footer }: Props) {
  const meta = STAGE_META[stageId];
  const index = STAGE_IDS.indexOf(stageId);
  return (
    <motion.div className="stage-veil fixed inset-0 z-10 overflow-y-auto overscroll-contain" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      <header className="header-veil sticky top-0 z-20 flex items-center justify-between gap-3 px-4 pb-4 pt-[max(env(safe-area-inset-top),1rem)]">
        <Link to="/universe" className="glass-soft flex h-10 items-center gap-1.5 rounded-full px-3 text-sm text-foreground">
          <ArrowRight className="size-4" />
          المجرة
        </Link>
        <div className="text-center">
          <p className="text-[11px] text-muted-foreground">
            الكوكب {ar(index + 1)} من {ar(STAGE_IDS.length)}
          </p>
          <h1 className="font-script text-2xl leading-tight text-shimmer">{meta.name}</h1>
        </div>
        <div className="w-12" />
      </header>
      <motion.main
        className="mx-auto w-full max-w-lg px-5 pb-44 pt-2"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
      >
        {children}
      </motion.main>
      {footer && (
        <div className="footer-veil fixed inset-x-0 bottom-0 z-20 px-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] pt-10">
          <div className="mx-auto max-w-lg">{footer}</div>
        </div>
      )}
    </motion.div>
  );
}

export function CompleteButton({ ready, hint, label = "خلصت! افتحي الكوكب اللي بعده", onComplete, done }: { ready: boolean; hint: string; label?: string; onComplete: () => void; done?: boolean }) {
  return (
    <div className="text-center">
      {!ready && <p className="mb-2 text-xs text-muted-foreground">{hint}</p>}
      <motion.div animate={ready ? { scale: [1, 1.03, 1] } : {}} transition={{ repeat: Infinity, duration: 2.4 }}>
        <button
          type="button"
          disabled={!ready}
          onClick={onComplete}
          className="bg-cta h-14 w-full rounded-full text-base font-medium text-primary-foreground shadow-[var(--shadow-glow)] transition active:scale-[0.98] disabled:opacity-40"
        >
          {done ? "رجوع للمجرة" : label}
        </button>
      </motion.div>
    </div>
  );
}

export function SectionTitle({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="mb-5 mt-8 text-center">
      <h2 className="font-script text-3xl text-cream">{children}</h2>
      {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
    </div>
  );
}
