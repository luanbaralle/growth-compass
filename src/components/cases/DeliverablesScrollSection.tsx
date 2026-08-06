import type { CaseDeliverable, CaseDeliverableItem } from "@/types/case";
import { motion } from "framer-motion";
import {
  CaseBody,
  CaseEyebrow,
  CaseHeading,
  CaseReveal,
  CaseSection,
} from "./shared/CaseSection";
import { fadeUp, staggerContainer, viewportOnce } from "./shared/motion";

interface DeliverablesScrollSectionProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
  items: CaseDeliverable[];
}

function normalizeDeliverables(items: CaseDeliverable[]): CaseDeliverableItem[] {
  return items.map((item) => (typeof item === "string" ? { label: item } : item));
}

export function DeliverablesScrollSection({
  id,
  eyebrow = "Raise One",
  title = "O que entregamos",
  intro,
  items,
}: DeliverablesScrollSectionProps) {
  const deliverables = normalizeDeliverables(items);

  return (
    <CaseSection
      id={id}
      className="border-y border-white/[0.04] bg-surface/30 py-20 sm:py-24"
    >
      <CaseReveal className="mx-auto max-w-2xl text-center">
        <CaseEyebrow>{eyebrow}</CaseEyebrow>
        <CaseHeading className="mt-3 text-2xl sm:text-3xl lg:text-[2rem] lg:leading-[1.12]">
          {title}
        </CaseHeading>
        {intro && (
          <CaseBody className="mx-auto mt-4 max-w-xl text-sm sm:text-base">{intro}</CaseBody>
        )}
      </CaseReveal>

      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4"
      >
        {deliverables.map((item, index) => (
          <motion.li
            key={item.label}
            variants={fadeUp}
            className="rounded-xl border border-white/[0.06] bg-surface/25 px-4 py-4 text-left sm:px-5 sm:py-5"
          >
            <span className="text-[10px] font-bold tabular-nums tracking-wider text-brand/70">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="mt-1 font-display text-base font-semibold tracking-tight text-foreground sm:text-lg">
              {item.label}
            </p>
            {item.hint && (
              <p className="mt-1.5 text-sm leading-snug text-muted-foreground">{item.hint}</p>
            )}
          </motion.li>
        ))}
      </motion.ul>
    </CaseSection>
  );
}
