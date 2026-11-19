import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, KeyRound, Lightbulb } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { checkUnlock, unlockSite } from "@/lib/gate.functions";
import { useScene, useSceneMode } from "@/lib/scene-store";
import { readToken, saveToken } from "@/lib/unlock-token";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Secret Place for Jana" },
      { name: "description", content: "في عالم صغير معمول مخصوص عشانك... محتاج كلمة سر." },
      { property: "og:title", content: "A Secret Place for Jana" },
      { property: "og:description", content: "في عالم صغير معمول مخصوص عشانك..." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GatePage,
});

const WRONG = ["تؤ تؤ... مش ده خالص", "قربتي؟ لأ لسه بعيدة شوية", "ركّزي يا جميل... الاسم اللي بحبه أكتر", "لأ يا قلبي، جربي تاني"];

function GatePage() {
  useSceneMode("gate");
  const navigate = useNavigate();
  const unlock = useServerFn(unlockSite);
  const check = useServerFn(checkUnlock);
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [wrong, setWrong] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    const token = readToken();
    if (!token) return;
    void check({ data: { token } }).then((r) => {
      if (r.valid) void navigate({ to: "/universe" });
    });
  }, [check, navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!value.trim() || busy) return;
    setBusy(true);
    try {
      const res = await unlock({ data: { password: value } });
      if (res.ok && res.token) {
        saveToken(res.token);
        setOpening(true);
        useScene.getState().setFromPortal(true);
        useScene.getState().setMode("portal");
        window.setTimeout(() => navigate({ to: "/universe" }), 2300);
      } else {
        setWrong((w) => w + 1);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center px-6">
      <AnimatePresence>
        {!opening && (
          <motion.div
            key="card"
            initial={{ opacity: 0, y: 40, scale: 0.96, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.4, filter: "blur(20px)" }}
            transition={{ duration: 1.4, delay: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            className="w-full max-w-sm"
          >
            <motion.form
              onSubmit={onSubmit}
              key={wrong}
              animate={wrong ? { x: [0, -14, 12, -8, 6, 0] } : {}}
              transition={{ duration: 0.5 }}
              className="glass rounded-[2rem] px-6 pb-7 pt-9 text-center"
            >
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2, type: "spring" }} className="mx-auto mb-5 grid size-12 place-items-center rounded-full bg-rose-gold/15">
                <KeyRound className="size-5 text-rose-gold" />
              </motion.div>
              <h1 dir="ltr" className="font-display text-[2.1rem] italic leading-[1.05] text-shimmer">
                A Secret Place
                <br />
                for Jana
              </h1>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">في عالم صغير معمول مخصوص عشانك...</p>

              <label htmlFor="secret" className="sr-only">
                كلمة السر
              </label>
              <input
                id="secret"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="اكتبي كلمة السر"
                autoComplete="off"
                className="mt-7 h-14 w-full rounded-2xl border border-input bg-background/40 px-4 text-center text-lg text-foreground placeholder:text-muted-foreground/70 focus:border-rose-gold focus:outline-none"
              />

              <AnimatePresence mode="wait">
                {wrong > 0 && (
                  <motion.p
                    key={wrong}
                    initial={{ opacity: 0, y: -6, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 flex items-center justify-center gap-1.5 text-sm text-rose"
                  >
                    <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.1 }}>
                      <Heart className="size-4 fill-rose text-rose" />
                    </motion.span>
                    {WRONG[(wrong - 1) % WRONG.length]}
                  </motion.p>
                )}
              </AnimatePresence>

              <button type="submit" disabled={busy || !value.trim()} className="bg-cta mt-5 h-14 w-full rounded-full text-base font-medium text-primary-foreground shadow-[var(--shadow-glow)] transition active:scale-[0.98] disabled:opacity-50">
                {busy ? "ثانية واحدة..." : "افتحي الباب"}
              </button>

              <button type="button" onClick={() => setShowHint((s) => !s)} className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <Lightbulb className="size-4" />
                محتاجة تلميح؟
              </button>
              <AnimatePresence>
                {showHint && (
                  <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pt-2 font-script text-lg text-cream">
                    إيه أكتر اسم دلع بحبه أناديكي بيه؟
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
      {opening && <PortalOverlay />}
    </div>
  );
}

function PortalOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-20 grid place-items-center overflow-hidden">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute size-40 rounded-full border border-rose-gold/70"
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: 9, opacity: [0, 0.9, 0] }}
          transition={{ duration: 2, delay: 0.2 + i * 0.25, ease: "easeIn" }}
        />
      ))}
      <motion.div className="portal-flash absolute inset-0" initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: [0, 0.3, 1], scale: [0.3, 1, 1.4] }} transition={{ duration: 2.3, ease: "easeIn" }} />
      <motion.p className="relative font-script text-3xl text-primary-foreground" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2.2, delay: 0.4 }}>
        أهلاً بيكي يا جنى
      </motion.p>
    </div>
  );
}
