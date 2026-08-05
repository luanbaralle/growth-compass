import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useState } from "react";
import {
  getItemScrollRange,
  ScrollDrivenSection,
  ScrollProgressBar,
  ScrollSectionBackdrop,
  ScrollSequenceWord,
} from "@/components/shared/scrollDriven";

interface DeliverablesScrollSectionProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  items: string[];
}

function ActiveIndex({ progress, total }: { progress: MotionValue<number>; total: number }) {
  const activeText = useTransform(progress, (value) => {
    const ranges = Array.from({ length: total }, (_, index) => getItemScrollRange(index, total));
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

    return `${String(bestIndex + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  });
  const [label, setLabel] = useState(`01 / ${String(total).padStart(2, "0")}`);

  useMotionValueEvent(activeText, "change", setLabel);

  return (
    <motion.p
      style={{ opacity: useTransform(progress, [0.12, 0.2], [0, 1]) }}
      className="mt-6 font-display text-4xl font-bold tabular-nums tracking-tighter text-brand sm:text-5xl"
    >
      {label}
    </motion.p>
  );
}

function DeliverablesScrollStage({
  scrollYProgress,
  reduceEffects,
  eyebrow,
  title,
  items,
}: {
  scrollYProgress: MotionValue<number>;
  reduceEffects: boolean;
  eyebrow: string;
  title: string;
  items: string[];
}) {
  const introOpacity = useTransform(scrollYProgress, [0, 0.08, 0.16, 0.24], [0, 1, 1, 0.5]);
  const introY = useTransform(scrollYProgress, [0, 0.1], reduceEffects ? [0, 0] : [24, 0]);
  const stageOpacity = useTransform(scrollYProgress, [0.14, 0.2, 0.78, 0.86], [0, 1, 1, 0.25]);

  return (
    <div className="relative flex h-full items-center justify-center">
      <ScrollSectionBackdrop />

      <div className="relative mx-auto w-full max-w-3xl px-5 text-center sm:px-8">
        <motion.div style={{ opacity: introOpacity, y: introY }}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-muted-foreground/45">
            {eyebrow}
          </p>
          <p className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {title}
          </p>
          <ActiveIndex progress={scrollYProgress} total={items.length} />
        </motion.div>

        <motion.div
          style={{ opacity: stageOpacity }}
          className="relative mt-10 h-[clamp(4.5rem,12vw,7.5rem)] w-full sm:mt-12"
          aria-live="polite"
        >
          {items.map((item, index) => (
            <ScrollSequenceWord
              key={item}
              label={item}
              index={index}
              total={items.length}
              progress={scrollYProgress}
              reduceEffects={reduceEffects}
            />
          ))}
        </motion.div>
      </div>

      <ScrollProgressBar progress={scrollYProgress} />
    </div>
  );
}

export function DeliverablesScrollSection(props: DeliverablesScrollSectionProps) {
  const reduceEffects = useReducedMotion() ?? false;
  const { id, eyebrow = "Raise One", title = "O que entregamos", items } = props;

  return (
    <ScrollDrivenSection
      id={id}
      itemCount={items.length}
      className="relative border-y border-white/[0.04] bg-surface/30"
    >
      {(scrollYProgress) => (
        <DeliverablesScrollStage
          scrollYProgress={scrollYProgress}
          reduceEffects={reduceEffects}
          eyebrow={eyebrow}
          title={title}
          items={items}
        />
      )}
    </ScrollDrivenSection>
  );
}
