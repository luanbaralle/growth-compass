import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useState, type ReactNode } from "react";
import {
  SectionDescription,
  SectionEyebrow,
  SectionTitle,
} from "@/components/home/shared/SectionShell";
import {
  getItemScrollRange,
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

interface StepDescriptionProps {
  steps: ProcessScrollStep[];
  progress: MotionValue<number>;
}

function StepDescription({ steps, progress }: StepDescriptionProps) {
  const activeDescription = useTransform(progress, (value) => {
    const ranges = steps.map((_, index) => getItemScrollRange(index, steps.length));
    let bestIndex = 0;
    let bestWeight = -1;

    ranges.forEach((range, index) => {
      if (value >= range.start && value <= range.end) {
        const distance = Math.abs(value - range.peak);
        const weight = 1 - distance / (range.end - range.start);
        if (weight > bestWeight) {
          bestWeight = weight;
          bestIndex = index;
        }
      }
    });

    return steps[bestIndex]?.description ?? "";
  });
  const [description, setDescription] = useState(steps[0]?.description ?? "");

  useMotionValueEvent(activeDescription, "change", setDescription);

  return (
    <motion.p
      style={{ opacity: useTransform(progress, [0.14, 0.22], [0, 1]) }}
      className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0"
    >
      {description}
    </motion.p>
  );
}

function ProcessScrollSectionStatic({
  id,
  eyebrow,
  title,
  description,
  steps,
  headerExtra,
}: ProcessScrollSectionProps) {
  return (
    <section id={id} className="relative overflow-hidden border-b border-border/60 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <SectionEyebrow>{eyebrow}</SectionEyebrow>
          <SectionTitle>{title}</SectionTitle>
          {description && <SectionDescription>{description}</SectionDescription>}
          {headerExtra}
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-5">
          {steps.map((step) => (
            <article
              key={step.number}
              className="h-full rounded-[1.35rem] border border-border bg-surface/30 p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">
                {step.number}
              </p>
              <h3 className="mt-3 text-lg font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessScrollStage({
  scrollYProgress,
  eyebrow,
  title,
  description,
  steps,
  headerExtra,
}: ProcessScrollSectionProps & { scrollYProgress: MotionValue<number> }) {
  const introOpacity = useTransform(scrollYProgress, [0, 0.08, 0.16, 0.24], [0, 1, 1, 0.9]);
  const introY = useTransform(scrollYProgress, [0, 0.1], [24, 0]);
  const stageOpacity = useTransform(scrollYProgress, [0.14, 0.2, 0.78, 0.86], [0, 1, 1, 0.2]);

  return (
    <div className="relative flex h-[100dvh] min-h-[100svh] items-center justify-center overflow-hidden">
      <ScrollSectionBackdrop />

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col items-center text-center lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-10 lg:text-left xl:gap-14">
          <motion.div style={{ opacity: introOpacity, y: introY }} className="max-w-2xl lg:max-w-none">
            <SectionEyebrow>{eyebrow}</SectionEyebrow>
            <SectionTitle>{title}</SectionTitle>
            {description && <SectionDescription>{description}</SectionDescription>}
            {headerExtra}
            <StepDescription steps={steps} progress={scrollYProgress} />
          </motion.div>

          <motion.div
            style={{ opacity: stageOpacity }}
            className="relative mt-10 h-[clamp(4.5rem,12vw,7rem)] w-full lg:mt-0 lg:h-[clamp(5rem,14vw,8.5rem)]"
            aria-live="polite"
          >
            {steps.map((step, index) => (
              <ScrollSequenceWord
                key={step.number}
                label={step.title}
                index={index}
                total={steps.length}
                progress={scrollYProgress}
                className="absolute inset-0 flex items-center justify-center font-display text-[clamp(2.25rem,8vw,5rem)] font-bold tracking-[-0.04em] text-foreground will-change-transform lg:justify-start lg:text-[clamp(2.75rem,4vw,5.5rem)]"
              />
            ))}
          </motion.div>
        </div>

        {steps.length > 1 && (
          <div
            className="absolute right-5 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-3 sm:right-8 lg:flex"
            aria-hidden
          >
            {steps.map((step, index) => (
              <ScrollSequenceDot
                key={step.number}
                index={index}
                total={steps.length}
                progress={scrollYProgress}
              />
            ))}
          </div>
        )}
      </div>

      <ScrollProgressBar progress={scrollYProgress} />
    </div>
  );
}

export function ProcessScrollSection(props: ProcessScrollSectionProps) {
  const reduceMotion = useReducedMotion();
  const isWide = useIsWideViewport();

  if (reduceMotion) {
    return <ProcessScrollSectionStatic {...props} />;
  }

  const { id, steps } = props;

  return (
    <ScrollDrivenSection
      id={id}
      itemCount={steps.length}
      isWide={isWide}
      className="relative border-b border-border/60 bg-background"
    >
      {(scrollYProgress) => <ProcessScrollStage scrollYProgress={scrollYProgress} {...props} />}
    </ScrollDrivenSection>
  );
}
