import { useRef, useSyncExternalStore, type ReactNode } from "react";
import {
  computeScrollWordStyle,
  getItemScrollRange,
  getScrollSectionHeight,
  mapScrollRange,
  scrollWordStyleToCss,
} from "./scrollDrivenUtils";
import { useStickyScrollProgress } from "./useStickyScrollProgress";

export { getItemScrollRange, getScrollSectionHeight } from "./scrollDrivenUtils";

export function useIsWideViewport(breakpoint = 1024) {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia(`(min-width: ${breakpoint}px)`);
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia(`(min-width: ${breakpoint}px)`).matches,
    () => false,
  );
}

interface ScrollDrivenSectionProps {
  id?: string;
  itemCount: number;
  isWide: boolean;
  className?: string;
  children: (progress: number) => ReactNode;
}

export function ScrollDrivenSection({
  id,
  itemCount,
  isWide,
  className,
  children,
}: ScrollDrivenSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progress = useStickyScrollProgress(containerRef);
  const scrollHeight = getScrollSectionHeight(itemCount, isWide);

  return (
    <div
      ref={containerRef}
      id={id}
      className={className}
      style={{ height: `${scrollHeight}vh` }}
      data-scroll-driven=""
    >
      <div className="sticky top-0 flex h-[100svh] min-h-[100dvh] w-full flex-col">
        {children(progress)}
      </div>
    </div>
  );
}

interface ScrollProgressBarProps {
  progress: number;
}

export function ScrollProgressBar({ progress }: ScrollProgressBarProps) {
  return (
    <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 sm:bottom-12">
      <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-muted-foreground/50">
        Scroll
      </span>
      <div className="h-px w-24 overflow-hidden rounded-full bg-white/[0.08] sm:w-32">
        <div
          className="h-full origin-left bg-brand transition-none"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}

interface ScrollSequenceWordProps {
  label: string;
  index: number;
  total: number;
  progress: number;
  className?: string;
  reduceEffects?: boolean;
}

const DEFAULT_WORD_CLASS =
  "absolute inset-0 flex items-center justify-center font-display text-[clamp(2.75rem,9vw,6rem)] font-bold tracking-[-0.04em] text-foreground will-change-[transform,opacity] lg:text-[clamp(3.5rem,5.5vw,7.5rem)]";

export function ScrollSequenceWord({
  label,
  index,
  total,
  progress,
  className,
  reduceEffects = false,
}: ScrollSequenceWordProps) {
  const style = computeScrollWordStyle(progress, index, total, reduceEffects);
  const outer = scrollWordStyleToCss(style);

  return (
    <span
      className={className ?? DEFAULT_WORD_CLASS}
      style={{
        opacity: outer.opacity,
        zIndex: outer.zIndex,
        transform: outer.transform,
        visibility: style.opacity < 0.04 ? "hidden" : "visible",
      }}
    >
      <span
        className="inline-block will-change-[filter]"
        style={style.blur > 0.01 ? { filter: `blur(${style.blur}px)` } : undefined}
      >
        {label}
      </span>
    </span>
  );
}

interface ScrollSequenceDotProps {
  index: number;
  total: number;
  progress: number;
}

export function ScrollSequenceDot({ index, total, progress }: ScrollSequenceDotProps) {
  const { start, end, peak, fade } = getItemScrollRange(index, total);
  const itemFade = fade * 1.25;

  const opacity = mapScrollRange(
    progress,
    [start, peak - itemFade, peak, peak + itemFade, end],
    [0.2, 0.45, 1, 0.45, 0.2],
  );
  const scale = mapScrollRange(progress, [start, peak, end], [1, 1.6, 1]);
  const width = mapScrollRange(progress, [start, peak, end], [6, 20, 6]);

  return (
    <span
      className="inline-block h-1.5 rounded-full bg-brand"
      style={{ opacity, transform: `scale(${scale})`, width }}
    />
  );
}

export function ScrollSectionBackdrop() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 bg-background/95 backdrop-blur-[2px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 42%, oklch(0.72 0.19 48 / 0.1), transparent 55%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,oklch(1_0_0/0.03)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
        aria-hidden
      />
    </>
  );
}

/** Pick the item whose scroll range best matches the current progress */
export function getActiveScrollIndex(progress: number, total: number) {
  const ranges = Array.from({ length: total }, (_, index) => getItemScrollRange(index, total));
  let bestIndex = 0;
  let bestWeight = -1;

  ranges.forEach((range, index) => {
    if (progress >= range.start && progress <= range.end) {
      const distance = Math.abs(progress - range.peak);
      const weight = 1 - distance / (range.end - range.start);
      if (weight > bestWeight) {
        bestWeight = weight;
        bestIndex = index;
      }
    }
  });

  return bestIndex;
}
