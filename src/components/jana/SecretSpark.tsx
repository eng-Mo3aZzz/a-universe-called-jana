import { motion } from "framer-motion";
import { Sparkle } from "lucide-react";
import { useState } from "react";
import { useProgress } from "@/lib/progress-store";
import { useContent } from "@/lib/use-content";
import { cn } from "@/lib/utils";
import { Modal } from "./Modal";

/** A faint, tappable sparkle hiding one of the secret messages. */
export function SecretSpark({ id, className }: { id: string; className?: string }) {
  const content = useContent();
  const secret = content.secrets.find((s) => s.id === id);
  const found = useProgress((s) => s.secretsFound.includes(id));
  const findSecret = useProgress((s) => s.findSecret);
  const total = content.secrets.length;
  const count = useProgress((s) => s.secretsFound.length);
  const [open, setOpen] = useState(false);
  if (!secret) return null;
  return (
    <>
      <button
        type="button"
        aria-label="سر صغير"
        onClick={() => {
          findSecret(id);
          setOpen(true);
        }}
        className={cn("grid size-10 place-items-center rounded-full", className)}
      >
        <Sparkle className={cn("size-4 animate-twinkle", found ? "fill-rose-gold text-rose-gold" : "text-cream/50")} />
      </button>
      <Modal open={open} onClose={() => setOpen(false)} label="سر صغير">
        <div className="pt-4 text-center">
          <motion.div initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", delay: 0.1 }} className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-rose-gold/15">
            <Sparkle className="size-7 fill-rose-gold text-rose-gold" />
          </motion.div>
          <p className="text-xs tracking-wide text-muted-foreground">لقيتي سر! ({count} من {total})</p>
          <p className="mt-4 font-script text-2xl leading-relaxed text-cream">{secret.text}</p>
        </div>
      </Modal>
    </>
  );
}
