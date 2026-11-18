import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkle } from "lucide-react";
import { useEffect, useState } from "react";
import { SecretSpark } from "@/components/jana/SecretSpark";
import { ar } from "@/lib/normalize";
import { completedCount, isStageUnlocked, STAGE_IDS } from "@/lib/progress-rules";
import { useProgress } from "@/lib/progress-store";
import { useScene, useSceneMode } from "@/lib/scene-store";
import { STAGE_META } from "@/lib/stages";
import { useContent } from "@/lib/use-content";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/universe/")({
  head: () => ({
    meta: [
      { title: "المجرة — A Universe Called Jana" },
      { name: "description", content: "اختاري كوكب وابدئي الرحلة." },
      { property: "og:title", content: "A Universe Called Jana — المجرة" },
      { property: "og:description", content: "اختاري كوكب وابدئي الرحلة." },
    ],
  }),
  component: Hub,
});

function Hub() {
  useSceneMode("hub");
  const navigate = useNavigate();
  const content = useContent();
  const completed = useProgress((s) => s.completed);
  const justUnlocked = useProgress((s) => s.justUnlocked);
  const secretsFound = useProgress((s) => s.secretsFound.length);
  const [toast, setToast] = useState<string | null>(null);
  const [fromPortal] = useState(() => useScene.getState().fromPortal);
  const done = completedCount(completed);

  useEffect(() => {
    useScene.getState().setFromPortal(false);
    useScene.getState().setPlanetHandler((id) => {
      if (isStageUnlocked(id, useProgress.getState().completed)) {
        navigate({ to: "/universe/$stage", params: { stage: id } });
      } else {
        setToast("الكوكب ده لسه مقفول... خلّصي اللي قبله الأول");
      }
    });
    return () => useScene.getState().setPlanetHandler(null);
  }, [navigate]);

  useEffect(() => {
    if (!justUnlocked) return;
    setToast(`اتفتح كوكب جديد: ${STAGE_META[justUnlocked].name}`);
    const t = window.setTimeout(() => useProgress.getState().clearJustUnlocked(), 7000);
    return () => window.clearTimeout(t);
  }, [justUnlocked]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(t);
  }, [toast]);

  return (
    <div className="pointer-events-none fixed inset-0 z-10 flex flex-col justify-between">
      {fromPortal && <motion.div className="portal-flash fixed inset-0" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 1.8 }} />}
      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 1 }} className="header-veil px-5 pb-6 pt-[max(env(safe-area-inset-top),1.1rem)] text-center">
        <h1 dir="ltr" className="font-display text-[1.75rem] italic leading-none text-shimmer">
          A Universe Called {content.herNameEn}
        </h1>
        <div className="mt-3 flex items-center justify-center gap-1.5" aria-label={`خلصتي ${done} من ${STAGE_IDS.length}`}>
          {STAGE_IDS.map((id) => (
            <span key={id} className={cn("h-1.5 rounded-full transition-all duration-700", completed.includes(id) ? "w-6 bg-rose-gold" : isStageUnlocked(id, completed) ? "w-3 animate-pulse bg-rose" : "w-1.5 bg-cream/25")} />
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {done === STAGE_IDS.length ? "خلصتي الرحلة كلها... بس تقدري ترجعي لأي كوكب" : `${ar(done)} من ${ar(STAGE_IDS.length)} كواكب — دوسي على الكوكب المنوّر`}
        </p>
      </motion.header>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="glass mx-auto rounded-full px-5 py-3 text-sm">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="footer-veil flex items-center justify-between px-5 pb-[max(env(safe-area-inset-bottom),1rem)] pt-8">
        <div className="glass-soft pointer-events-auto flex items-center gap-1.5 rounded-full px-3 py-2 text-xs text-muted-foreground">
          <Sparkle className="size-3.5 fill-rose-gold text-rose-gold" />
          أسرار لقيتيها: {ar(secretsFound)} من {ar(content.secrets.length)}
        </div>
        <SecretSpark id="x1" className="pointer-events-auto" />
      </div>
    </div>
  );
}
