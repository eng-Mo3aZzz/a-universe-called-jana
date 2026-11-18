import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { src: string | null; label?: string; alt?: string; className?: string };

export function PhotoFrame({ src, label = "[أضف الصورة هنا]", alt = "", className }: Props) {
  if (src) {
    return <img src={src} alt={alt} loading="lazy" className={cn("aspect-[4/3] w-full rounded-2xl object-cover", className)} />;
  }
  return (
    <div className={cn("photo-placeholder flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-2xl text-muted-foreground", className)}>
      <ImageIcon className="size-7 opacity-70" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
