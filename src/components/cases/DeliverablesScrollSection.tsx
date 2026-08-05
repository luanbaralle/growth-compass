import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Check } from "lucide-react";
import { useState } from "react";
import {
  getItemScrollRange,
  ScrollDrivenSection,
  ScrollProgressBar,
  ScrollSectionBackdrop,
  ScrollSequenceWord,
  useIsWideViewport,
} from "@/components/shared/scrollDriven";

interface DeliverablesScrollSectionProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  items: string[];
}

interface DeliverableRailItemProps {
  label: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}

function DeliverableRailItem({ label, index, total, progress }: DeliverableRailItemProps) {
  const { start, end, peak, fade } = getItemScrollRange(index, total);
  const itemFade = fade * 1.1;

  const opacity = useTransform(
    progress,
    [start, peak - itemFade, peak, peak + itemFade, end],
    [0.25, 0.5, 1, 0.5, 0.25],
  );
  const x = useTransform(progress, [start, peak, end], [0, 6, 0]);
  const checkOpacity = useTransform(
    progress,
    [start, peak - itemFade, peak, peak + itemFade, end],
    [0.15, 0.35, 1, 0.35, 0.15],
  );

  return (
    <motion.li style={{ opacity, x }} className="flex items-center gap-3 py-2.5">
      <motion.span
        style={{ opacity: checkOpacity }}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-brand/10"
      >
        <Check className="h-3 w-3 text-brand" strokeWidth={2.5} />
      </motion.span>
      <span className="font-display text-sm font-semibold tracking-tight text-foreground/90 sm:text-base">
        {label}
      </span>
    </motion.li>
  );
}

function DeliverablesScrollSectionStatic({
  id,
  eyebrow = "Raise One",
  title = "O que entregamos",
  items,
}: DeliverablesScrollSectionProps) {
  return (
    <section
      id={id}
      className="relative overflow-hidden border-y border-white/[0.04] bg-surface/30 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-md px-5 text-center sm:px-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-muted-foreground/45">
          {eyebrow}
        </p>
        <p className="mt-3 text-sm text-muted-foreground/65">{title}</p>
        <ul className="mt-8 space-y-2.5">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-center justify-center gap-2.5 text-sm text-muted-foreground/75"
            >
              <Check className="h-3.5 w-3.5 shrink-0 text-brand/50" strokeWidth={2.5} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
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
      className="mt-6 font-display text-4xl font-bold tabular-nums tracking-tighter text-brand sm:text-5xl lg:text-6xl"
    >
      {label}
    </motion.p>
  );
}

function DeliverablesScrollStage({
  scrollYProgress,
  eyebrow,
  title,
  items,
}: {
  scrollYProgress: MotionValue<number>;
  eyebrow: string;
  title: string;
  items: string[];
}) {
  const introOpacity = useTransform(scrollYProgress, [0, 0.08, 0.16, 0.24], [0, 1, 1, 0.9]);
  const introY = useTransform(scrollYProgress, [0, 0.1], [24, 0]);
  const stageOpacity = useTransform(scrollYProgress, [0.14, 0.2, 0.78, 0.86], [0, 1, 1, 0.2]);
  const railOpacity = useTransform(scrollYProgress, [0.1, 0.18], [0, 1]);

  return (
    <div className="relative flex h-[100dvh] min-h-[100svh] items-center justify-center overflow-hidden">
      <ScrollSectionBackdrop />

      <div
        className="pointer-events-none absolute inset-x-[8%] top-[18%] hidden h-px bg-gradient-to-r from-transparent via-brand/35 to-transparent lg:block"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col items-center text-center lg:grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-10 lg:text-left xl:gap-14">
          <motion.div style={{ opacity: introOpacity, y: introY }} className="lg:max-w-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-brand/70">
              {eyebrow}
            </p>
            <p className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              {title}
            </p>
            <ActiveIndex progress={scrollYProgress} total={items.length} />

            <motion.ul style={{ opacity: railOpacity }} className="mt-8 hidden space-y-1 lg:block">
              {items.map((item, index) => (
                <DeliverableRailItem
                  key={item}
                  label={item}
                  index={index}
                  total={items.length}
                  progress={scrollYProgress}
                />
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            style={{ opacity: stageOpacity }}
            className="relative mt-10 h-[clamp(4.5rem,12vw,7.5rem)] w-full lg:mt-0 lg:h-[clamp(5.5rem,14vw,9rem)]"
            aria-live="polite"
          >
            {items.map((item, index) => (
              <ScrollSequenceWord
                key={item}
                label={item}
                index={index}
                total={items.length}
                progress={scrollYProgress}
                className="absolute inset-0 flex items-center justify-center font-display text-[clamp(2rem,7.5vw,5rem)] font-bold tracking-[-0.04em] text-foreground will-change-transform lg:justify-start lg:text-[clamp(2.75rem,4.5vw,6rem)]"
              />
            ))}
          </motion.div>
        </div>
      </div>

      <ScrollProgressBar progress={scrollYProgress} />
    </div>
  );
}

export function DeliverablesScrollSection(props: DeliverablesScrollSectionProps) {
  const reduceMotion = useReducedMotion();
  const isWide = useIsWideViewport();

  if (reduceMotion) {
    return <DeliverablesScrollSectionStatic {...props} />;
  }

  const { id, eyebrow = "Raise One", title = "O que entregamos", items } = props;

  return (
    <ScrollDrivenSection
      id={id}
      itemCount={items.length}
      isWide={isWide}
      className="relative border-y border-brand/10 bg-surface/40"
    >
      {(scrollYProgress) => (
        <DeliverablesScrollStage
          scrollYProgress={scrollYProgress}
          eyebrow={eyebrow}
          title={title}
          items={items}
        />
      )}
    </ScrollDrivenSection>
  );
}
