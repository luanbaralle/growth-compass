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
      className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
    >
      {description}
    </motion.p>
  );
}

function ProcessScrollStage({
  scrollYProgress,
  reduceEffects,
  eyebrow,
  title,
  description,
  steps,
  headerExtra,
}: ProcessScrollSectionProps & {
  scrollYProgress: MotionValue<number>;
  reduceEffects: boolean;
}) {
  const introOpacity = useTransform(scrollYProgress, [0, 0.08, 0.16, 0.24], [0, 1, 1, 0.5]);
  const introY = useTransform(scrollYProgress, [0, 0.1], reduceEffects ? [0, 0] : [24, 0]);

  return (
    <div className="relative flex h-full items-center justify-center">
      <ScrollSectionBackdrop />

      <div className="relative mx-auto w-full max-w-5xl px-5 text-center sm:px-8">
        <motion.div style={{ opacity: introOpacity, y: introY }} className="mx-auto max-w-3xl">
          <SectionEyebrow>{eyebrow}</SectionEyebrow>
          <SectionTitle>{title}</SectionTitle>
          {description && <SectionDescription>{description}</SectionDescription>}
          {headerExtra}
          <StepDescription steps={steps} progress={scrollYProgress} />
        </motion.div>

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
              progress={scrollYProgress}
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
  const reduceEffects = useReducedMotion() ?? false;
  const { id, steps } = props;

  return (
    <ScrollDrivenSection
      id={id}
      itemCount={steps.length}
      className="relative border-b border-border/60 bg-background"
    >
      {(scrollYProgress) => (
        <ProcessScrollStage
          scrollYProgress={scrollYProgress}
          reduceEffects={reduceEffects}
          {...props}
        />
      )}
    </ScrollDrivenSection>
  );
}
