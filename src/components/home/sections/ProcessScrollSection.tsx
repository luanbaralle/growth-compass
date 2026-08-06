import { useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";
import {
  SectionDescription,
  SectionEyebrow,
  SectionTitle,
} from "@/components/home/shared/SectionShell";
import { mapScrollRange } from "@/components/shared/scrollDrivenUtils";
import {
  getActiveScrollIndex,
  ScrollDrivenSection,
  ScrollProgressBar,
  ScrollSectionBackdrop,
  ScrollSequenceDot,
  ScrollSequenceWord,
  useIsWideViewport,
} from "@/components/shared/scrollDriven";

export interface ProcessScrollStep {
  number: string;
  title: string;
  description: string;
}

interface ProcessScrollSectionProps {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  steps: ProcessScrollStep[];
  headerExtra?: ReactNode;
}

function ProcessScrollStatic({
  id,
  eyebrow,
  title,
  description,
  steps,
  headerExtra,
}: ProcessScrollSectionProps) {
  return (
    <section
      id={id}
      className="relative border-b border-border/60 bg-background py-20 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <SectionEyebrow>{eyebrow}</SectionEyebrow>
        <SectionTitle>{title}</SectionTitle>
        {description && <SectionDescription>{description}</SectionDescription>}
        {headerExtra}
        <ol className="mt-10 space-y-3 text-left sm:mt-12">
          {steps.map((step) => (
            <li
              key={step.number}
              className="rounded-xl border border-white/[0.06] bg-surface/25 px-4 py-4 sm:px-5 sm:py-5"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-brand/10 text-[11px] font-bold tabular-nums text-brand">
                  {step.number}
                </span>
                <div>
                  <p className="font-display text-lg font-semibold tracking-tight sm:text-xl">
                    {step.title}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {step.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ProcessScrollStage({
  progress,
  reduceEffects,
  eyebrow,
  title,
  description,
  steps,
  headerExtra,
}: ProcessScrollSectionProps & { progress: number; reduceEffects: boolean }) {
  const introOpacity = mapScrollRange(progress, [0, 0.08, 0.16, 0.24], [0, 1, 1, 0.5]);
  const introY = reduceEffects ? 0 : mapScrollRange(progress, [0, 0.1], [24, 0]);
  const descOpacity = mapScrollRange(progress, [0.14, 0.22], [0, 1]);
  const activeIndex = getActiveScrollIndex(progress, steps.length);
  const activeDescription = steps[activeIndex]?.description ?? "";

  return (
    <div className="relative flex flex-1 items-center justify-center">
      <ScrollSectionBackdrop />

      <div className="relative mx-auto w-full max-w-5xl px-5 text-center sm:px-8">
        <div
          className="mx-auto max-w-3xl"
          style={{ opacity: introOpacity, transform: `translate3d(0, ${introY}px, 0)` }}
        >
          <SectionEyebrow>{eyebrow}</SectionEyebrow>
          <SectionTitle>{title}</SectionTitle>
          {description && <SectionDescription>{description}</SectionDescription>}
          {headerExtra}
          <p
            className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            style={{ opacity: descOpacity }}
          >
            {activeDescription}
          </p>
        </div>

        <div
          className="relative mx-auto mt-10 h-[clamp(4.5rem,12vw,7rem)] w-full max-w-3xl sm:mt-12"
          aria-live="polite"
        >
          {steps.map((step, index) => (
            <ScrollSequenceWord
              key={step.number}
              label={step.title}
              index={index}
              total={steps.length}
              progress={progress}
              reduceEffects={reduceEffects}
            />
          ))}
        </div>

        {steps.length > 1 && (
          <div
            className="absolute right-0 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
            aria-hidden
          >
            {steps.map((step, index) => (
              <ScrollSequenceDot
                key={step.number}
                index={index}
                total={steps.length}
                progress={progress}
              />
            ))}
          </div>
        )}
      </div>

      <ScrollProgressBar progress={progress} />
    </div>
  );
}

export function ProcessScrollSection(props: ProcessScrollSectionProps) {
  const reduceEffects = useReducedMotion() ?? false;
  const isWide = useIsWideViewport();
  const { id, steps } = props;

  if (reduceEffects || !isWide) {
    return <ProcessScrollStatic {...props} />;
  }

  return (
    <ScrollDrivenSection
      id={id}
      itemCount={steps.length}
      isWide={isWide}
      className="relative border-b border-border/60 bg-background"
    >
      {(progress) => (
        <ProcessScrollStage progress={progress} reduceEffects={reduceEffects} {...props} />
      )}
    </ScrollDrivenSection>
  );
}
