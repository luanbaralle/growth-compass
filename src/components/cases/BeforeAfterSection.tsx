import type { CaseBeforeAfterItem } from "@/types/case";
import { motion } from "framer-motion";
import { CaseImage } from "./CaseImage";
import { CaseEyebrow, CaseHeading, CaseReveal, CaseSection } from "./shared/CaseSection";
import { fadeUp, scaleIn, viewportOnce } from "./shared/motion";

interface BeforeAfterSectionProps {
  items?: CaseBeforeAfterItem[];
}

function BeforeAfterPair({ item }: { item: CaseBeforeAfterItem }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUp}
      className="space-y-6"
    >
      {item.label && (
        <p className="text-center text-sm font-medium text-muted-foreground">{item.label}</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
        {/* Before */}
        <motion.div variants={scaleIn} className="group">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted-foreground">
              Antes
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/[0.06] opacity-80 transition-opacity duration-500 group-hover:opacity-100">
            <CaseImage
              src={item.before.src}
              alt={item.before.alt}
              className="aspect-[4/3] w-full grayscale-[30%] transition-all duration-700 group-hover:grayscale-0"
            />
          </div>
        </motion.div>

        {/* After */}
        <motion.div variants={scaleIn} className="group">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand">
              Depois
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-brand/20 shadow-[0_20px_60px_-30px_oklch(0.72_0.19_48/0.3)]">
            <CaseImage
              src={item.after.src}
              alt={item.after.alt}
              className="aspect-[4/3] w-full transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div
              className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-brand/10"
              aria-hidden
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function BeforeAfterSection({ items = [] }: BeforeAfterSectionProps) {
  if (items.length === 0) return null;

  return (
    <CaseSection className="py-24 sm:py-32 lg:py-40">
      <CaseReveal className="mx-auto mb-20 max-w-2xl text-center">
        <CaseEyebrow>Transformação</CaseEyebrow>
        <CaseHeading>Antes & Depois</CaseHeading>
      </CaseReveal>

      <div className="space-y-24">
        {items.map((item) => (
          <BeforeAfterPair key={item.label ?? item.before.alt} item={item} />
        ))}
      </div>
    </CaseSection>
  );
}
