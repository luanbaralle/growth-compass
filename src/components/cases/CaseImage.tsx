import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CaseImageProps {
  src: string;
  alt: string;
  className?: string;
}

/** Renderiza imagem ou placeholder premium quando o asset ainda não existe. */
export function CaseImage({ src, alt, className }: CaseImageProps) {
  const isPlaceholder = src.includes("placeholder");

  if (isPlaceholder) {
    return (
      <div
        className={cn(
          "relative overflow-hidden bg-gradient-to-br from-surface via-surface-elevated to-surface",
          className,
        )}
        role="img"
        aria-label={alt}
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, oklch(0.72 0.19 48 / 0.15), transparent 45%), radial-gradient(circle at 80% 80%, oklch(0.5 0.1 260 / 0.12), transparent 40%)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(1_0_0/0.03)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="rounded-full border border-white/[0.08] bg-black/20 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground backdrop-blur-sm">
            TODO: {alt}
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn("object-cover", className)}
      loading="lazy"
    />
  );
}

interface CaseParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  yOffset?: number;
}

export function CaseParallaxImage({
  src,
  alt,
  className,
  yOffset = 80,
}: CaseParallaxImageProps) {
  return (
    <motion.div
      className={cn("relative h-full w-full overflow-hidden", className)}
      style={{ willChange: "transform" }}
    >
      <motion.div
        className="h-[115%] w-full"
        initial={{ y: 0 }}
        whileInView={{ y: yOffset * 0.15 }}
        viewport={{ once: false, amount: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      >
        <CaseImage src={src} alt={alt} className="h-full w-full" />
      </motion.div>
    </motion.div>
  );
}
