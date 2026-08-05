import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import { CaseImage } from "../CaseImage";
import { EASE_OUT, scaleIn, viewportOnce } from "../shared/motion";

interface ReputationShowcaseProps {
  businessName: string;
  location: string;
  rating: string;
  reviewCount: string;
  title?: string;
  hint?: string;
  imageSrc?: string;
  imageAlt?: string;
  mapsHref?: string;
  displayUrl?: string;
  className?: string;
}

function BrowserChrome({ displayUrl }: { displayUrl?: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-white/[0.06] bg-[#141414]/95 px-4 py-3 backdrop-blur-md sm:px-5">
      <div className="flex items-center gap-1.5" aria-hidden>
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
      </div>
      <div className="mx-auto flex min-w-0 max-w-md flex-1 items-center justify-center gap-2 rounded-lg border border-white/[0.06] bg-black/40 px-3 py-1.5">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/70" aria-hidden />
        <span className="truncate text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
          {displayUrl ?? "google.com/maps"}
        </span>
      </div>
      <span className="hidden w-[52px] sm:block" aria-hidden />
    </div>
  );
}

function ReputationPanel({
  businessName,
  location,
  rating,
  reviewCount,
}: Pick<ReputationShowcaseProps, "businessName" | "location" | "rating" | "reviewCount">) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center bg-gradient-to-b from-[#fafafa] to-[#f0f0ee] px-8 py-12 text-center sm:min-h-[320px] sm:px-12">
      <p className="font-display text-xl font-bold tracking-tight text-[#1a1211] sm:text-2xl">
        {businessName}
      </p>
      <p className="mt-1 text-sm text-[#5c534f]">{location}</p>
      <div className="mt-8 flex items-center gap-2">
        <span className="font-display text-4xl font-bold tracking-tight text-[#1a1211] sm:text-5xl">
          {rating}
        </span>
        <div className="flex gap-0.5" aria-hidden>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400 sm:h-6 sm:w-6" />
          ))}
        </div>
      </div>
      <p className="mt-3 text-sm font-medium text-[#5c534f]">{reviewCount} avaliações no Google</p>
      <p className="mt-8 max-w-xs text-xs leading-relaxed text-[#8a817c]">
        Referência local em confiança — reputação construída com pós-venda, respostas e presença
        ativa no Google Meu Negócio.
      </p>
    </div>
  );
}

export function ReputationShowcase({
  businessName,
  location,
  rating,
  reviewCount,
  imageSrc,
  imageAlt,
  mapsHref,
  displayUrl = "google.com/maps",
  className,
}: ReputationShowcaseProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={scaleIn}
      className={cn("relative mx-auto w-full max-w-3xl px-1 sm:px-0", className)}
    >
      <div
        className="pointer-events-none absolute -inset-x-[10%] -bottom-[20%] h-[60%] rounded-full bg-brand/10 blur-[80px]"
        aria-hidden
      />

      <div className="relative pb-10">
        <div className="relative overflow-hidden rounded-[1.15rem] border border-white/[0.1] bg-[#0a0a0a]/90 shadow-[0_60px_140px_-40px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.04),inset_0_1px_0_rgba(255,255,255,0.06)] ring-1 ring-white/[0.04] backdrop-blur-xl sm:rounded-[1.25rem]">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
            aria-hidden
          />
          <BrowserChrome displayUrl={displayUrl} />
          {imageSrc ? (
            <CaseImage src={imageSrc} alt={imageAlt ?? businessName} className="w-full" />
          ) : (
            <ReputationPanel
              businessName={businessName}
              location={location}
              rating={rating}
              reviewCount={reviewCount}
            />
          )}
        </div>
        <div
          className="pointer-events-none absolute -bottom-10 left-[8%] right-[8%] h-16 opacity-[0.12] [mask-image:linear-gradient(to_bottom,black,transparent)]"
          aria-hidden
        >
          <div className="h-full rounded-[1.25rem] bg-gradient-to-b from-white/20 via-white/5 to-transparent blur-md" />
        </div>
      </div>

      {mapsHref && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ delay: 0.15, duration: 0.5, ease: EASE_OUT }}
          className="mt-10 flex justify-center"
        >
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Ver no Google Maps
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </motion.div>
      )}
    </motion.div>
  );
}
