import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = { open: boolean; onClose: () => void; children: ReactNode; className?: string; label?: string };

export function Modal({ open, onClose, children, className, label }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={label}
        >
          <button type="button" aria-label="قفل" className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className={cn("glass relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-3xl p-6", className)}
            initial={{ y: 60, scale: 0.92, opacity: 0, filter: "blur(8px)" }}
            animate={{ y: 0, scale: 1, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: 40, scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 220 }}
          >
            <button type="button" onClick={onClose} aria-label="قفل" className="absolute left-4 top-4 grid size-9 place-items-center rounded-full bg-muted text-muted-foreground">
              <X className="size-4" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
