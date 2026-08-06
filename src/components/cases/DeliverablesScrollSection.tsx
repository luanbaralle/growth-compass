import { useReducedMotion } from "framer-motion";
import { mapScrollRange } from "@/components/shared/scrollDrivenUtils";
import {
  getActiveScrollIndex,
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

function DeliverablesScrollStatic({
  id,
  eyebrow = "Raise One",
  title = "O que entregamos",
  items,
}: DeliverablesScrollSectionProps) {
  return (
    <section id={id} className="border-y border-white/[0.04] bg-surface/30 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-muted-foreground/45">
          {eyebrow}
        </p>
        <p className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </p>
        <ul className="mt-12 space-y-4">
          {items.map((item) => (
            <li key={item} className="font-display text-2xl font-bold sm:text-3xl">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function DeliverablesScrollStage({
  progress,
  reduceEffects,
  eyebrow,
  title,
  items,
}: {
  progress: number;
  reduceEffects: boolean;
  eyebrow: string;
  title: string;
  items: string[];
}) {
  const introOpacity = mapScrollRange(progress, [0, 0.08, 0.16, 0.24], [0, 1, 1, 0.5]);
  const introY = reduceEffects ? 0 : mapScrollRange(progress, [0, 0.1], [24, 0]);
  const indexOpacity = mapScrollRange(progress, [0.12, 0.2], [0, 1]);
  const activeIndex = getActiveScrollIndex(progress, items.length);
  const indexLabel = `${String(activeIndex + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;

  return (
    <div className="relative flex flex-1 items-center justify-center">
      <ScrollSectionBackdrop />

      <div className="relative mx-auto w-full max-w-3xl px-5 text-center sm:px-8">
        <div style={{ opacity: introOpacity, transform: `translate3d(0, ${introY}px, 0)` }}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-muted-foreground/45">
            {eyebrow}
          </p>
          <p className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {title}
          </p>
          <p
            className="mt-6 font-display text-4xl font-bold tabular-nums tracking-tighter text-brand sm:text-5xl"
            style={{ opacity: indexOpacity }}
          >
            {indexLabel}
          </p>
        </div>

        <div
          className="relative mt-10 h-[clamp(4.5rem,12vw,7.5rem)] w-full sm:mt-12"
          aria-live="polite"
        >
          {items.map((item, index) => (
            <ScrollSequenceWord
              key={item}
              label={item}
              index={index}
              total={items.length}
              progress={progress}
              reduceEffects={reduceEffects}
            />
          ))}
        </div>
      </div>

      <ScrollProgressBar progress={progress} />
    </div>
  );
}

export function DeliverablesScrollSection(props: DeliverablesScrollSectionProps) {
  const reduceEffects = useReducedMotion() ?? false;
  const isWide = useIsWideViewport();
  const { id, eyebrow = "Raise One", title = "O que entregamos", items } = props;

  if (reduceEffects) {
    return (
      <DeliverablesScrollStatic id={id} eyebrow={eyebrow} title={title} items={items} />
    );
  }

  return (
    <ScrollDrivenSection
      id={id}
      itemCount={items.length}
      isWide={isWide}
      className="relative border-y border-white/[0.04] bg-surface/30"
    >
      {(progress) => (
        <DeliverablesScrollStage
          progress={progress}
          reduceEffects={reduceEffects}
          eyebrow={eyebrow}
          title={title}
          items={items}
        />
      )}
    </ScrollDrivenSection>
  );
}
