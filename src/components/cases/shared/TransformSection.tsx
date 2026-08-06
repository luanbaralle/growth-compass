import type { CaseTransformEntry, CaseTransformItem, CaseTransformSide } from "@/types/case";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import {
  CaseBody,
  CaseEyebrow,
  CaseHeading,
  CaseReveal,
  CaseSection,
} from "./CaseSection";
import { fadeUp, scaleIn, staggerContainer, viewportOnce } from "./motion";

interface TransformSectionProps {
  id?: string;
  intro?: string;
  closing?: string;
  before: CaseTransformSide;
  after: CaseTransformSide;
}

function normalizeItems(items: CaseTransformEntry[]): CaseTransformItem[] {
  return items.map((item) => (typeof item === "string" ? { label: item } : item));
}

function TransformPanel({
  variant,
  outcome,
  items,
}: {
  variant: "before" | "after";
  outcome: string;
  items: CaseTransformItem[];
}) {
  const isBefore = variant === "before";

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={scaleIn}
      className="group"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span
          className={
            isBefore
              ? "text-[11px] font-semibold uppercase tracking-[0.32em] text-muted-foreground"
              : "text-[11px] font-semibold uppercase tracking-[0.32em] text-brand"
          }
        >
          {isBefore ? "Antes" : "Depois"}
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <div
        className={
          isBefore
            ? "rounded-2xl border border-white/[0.06] bg-surface/20 p-6 opacity-90 transition-opacity duration-500 group-hover:opacity-100 sm:p-8"
            : "relative overflow-hidden rounded-2xl border border-brand/20 bg-brand/[0.04] p-6 shadow-[0_12px_40px_-24px_oklch(0.72_0.19_48/0.3)] sm:p-8"
        }
      >
        {!isBefore && (
          <div
            className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-brand/10"
            aria-hidden
          />
        )}

        <p
          className={
            isBefore
              ? "text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground"
              : "text-[10px] font-semibold uppercase tracking-[0.28em] text-brand/80"
          }
        >
          {outcome}
        </p>

        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="relative mt-6 space-y-3 sm:mt-7"
        >
          {items.map((item, index) => (
            <motion.li
              key={item.label}
              variants={fadeUp}
              className={
                isBefore
                  ? "rounded-xl border border-white/[0.06] bg-background/40 px-4 py-3.5 sm:px-5 sm:py-4"
                  : "rounded-xl border border-brand/20 bg-brand/[0.07] px-4 py-3.5 sm:px-5 sm:py-4"
              }
            >
              <div className="flex items-start gap-3">
                <span
                  className={
                    isBefore
                      ? "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted-foreground/15 text-[10px] font-bold tabular-nums text-muted-foreground/70"
                      : "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-brand/10 text-[10px] font-bold tabular-nums text-brand"
                  }
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={
                      isBefore
                        ? "font-display text-base font-semibold tracking-tight text-muted-foreground sm:text-lg"
                        : "font-display text-base font-semibold tracking-tight text-foreground sm:text-lg"
                    }
                  >
                    {item.label}
                  </p>
                  {item.hint && (
                    <p className="mt-1 text-sm leading-snug text-muted-foreground">{item.hint}</p>
                  )}
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </motion.div>
  );
}

export function TransformSection({
  id = "transformacao",
  intro,
  closing,
  before,
  after,
}: TransformSectionProps) {
  const beforeItems = normalizeItems(before.items);
  const afterItems = normalizeItems(after.items);

  return (
    <CaseSection id={id} variant="elevated" className="py-20 sm:py-28 lg:py-32">
      <CaseReveal className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
        <CaseEyebrow>A transformação</CaseEyebrow>
        <CaseHeading>Antes & Depois</CaseHeading>
        {intro && (
          <CaseBody className="mx-auto mt-4 max-w-xl text-sm sm:text-base">{intro}</CaseBody>
        )}
      </CaseReveal>

      <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
        <TransformPanel variant="before" outcome={before.outcome} items={beforeItems} />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportOnce}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center"
          aria-hidden
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-brand/25 bg-brand/10 shadow-[0_0_32px_-12px_oklch(0.72_0.19_48/0.45)] lg:h-16 lg:w-16">
            <ArrowRight className="h-6 w-6 rotate-90 text-brand lg:rotate-0" />
          </div>
        </motion.div>

        <TransformPanel variant="after" outcome={after.outcome} items={afterItems} />
      </div>

      {closing && (
        <CaseReveal delay={0.1} className="mx-auto mt-12 max-w-2xl text-center sm:mt-14">
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{closing}</p>
        </CaseReveal>
      )}
    </CaseSection>
  );
}
