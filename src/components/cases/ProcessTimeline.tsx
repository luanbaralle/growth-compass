import type { CaseProcessStep } from "@/types/case";
import { motion } from "framer-motion";
import { CaseEyebrow, CaseHeading, CaseSection } from "./shared/CaseSection";
import { fadeUp, staggerContainer, viewportOnce } from "./shared/motion";

interface ProcessTimelineProps {
  steps?: CaseProcessStep[];
  eyebrow?: string;
  title?: string;
}

export function ProcessTimeline({
  steps = [],
  eyebrow = "Processo",
  title = "Como chegamos lá",
}: ProcessTimelineProps) {
  if (steps.length === 0) return null;

  return (
    <CaseSection className="py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-2xl text-center">
        <CaseEyebrow>{eyebrow}</CaseEyebrow>
        <CaseHeading>{title}</CaseHeading>
      </div>

      {/* Desktop: horizontal timeline */}
      <motion.ol
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="mt-20 hidden lg:grid lg:grid-cols-4 lg:gap-6"
      >
        {steps.map((step, index) => (
          <motion.li key={`${step.phase}-${step.title}`} variants={fadeUp} className="relative">
            {index < steps.length - 1 && (
              <span
                className="absolute left-[calc(50%+1.5rem)] top-5 h-px w-[calc(100%-3rem)] bg-gradient-to-r from-brand/30 to-transparent"
                aria-hidden
              />
            )}
            <div className="flex flex-col items-center text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-brand/30 bg-brand/10 text-xs font-bold text-brand backdrop-blur-sm">
                {step.phase}
              </span>
              <h3 className="mt-5 text-base font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          </motion.li>
        ))}
      </motion.ol>

      {/* Mobile: vertical timeline */}
      <motion.ol
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="mt-16 space-y-0 lg:hidden"
      >
        {steps.map((step, index) => (
          <motion.li
            key={`mobile-${step.phase}-${step.title}`}
            variants={fadeUp}
            className="relative flex gap-6 pb-12 last:pb-0"
          >
            {index < steps.length - 1 && (
              <span
                className="absolute left-[1.125rem] top-10 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-brand/30 to-transparent"
                aria-hidden
              />
            )}
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-brand/10 text-xs font-bold text-brand">
              {step.phase}
            </span>
            <div className="pt-0.5">
              <h3 className="text-lg font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </CaseSection>
  );
}
