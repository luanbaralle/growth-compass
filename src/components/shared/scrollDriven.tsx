import { useMotionValueEvent, type MotionValue } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, type ReactNode } from "react";
import {
  computeScrollWordStyle,
  getItemScrollRange,
  getScrollSectionHeight,
  mapScrollRange,
  scrollWordStyleToCss,
  setScrollWordElementStyle,
} from "./scrollDrivenUtils";
import { usePinnedScrollProgress } from "./usePinnedScrollProgress";

export { getItemScrollRange, getScrollSectionHeight } from "./scrollDrivenUtils";

interface ScrollDrivenSectionProps {
  id?: string;
  itemCount: number;
  className?: string;
  children: (progress: MotionValue<number>) => ReactNode;
}

export function ScrollDrivenSection({
  id,
  itemCount,
  className,
  children,
}: ScrollDrivenSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollYProgress = usePinnedScrollProgress(containerRef);
  const scrollHeight = getScrollSectionHeight(itemCount);

  return (
    <div
      ref={containerRef}
      id={id}
      className={className}
      style={{ height: `${scrollHeight}vh` }}
      data-scroll-driven=""
    >
      <div className="sticky top-0 h-[100dvh] min-h-[100svh] w-full overflow-hidden">
        {children(scrollYProgress)}
      </div>
    </div>
  );
}

interface ScrollProgressBarProps {
  progress: MotionValue<number>;
}

export function ScrollProgressBar({ progress }: ScrollProgressBarProps) {
  const barRef = useRef<HTMLDivElement>(null);

  const applyWidth = useCallback((value: number) => {
    if (barRef.current) {
      barRef.current.style.width = `${value * 100}%`;
    }
  }, []);

  useMotionValueEvent(progress, "change", applyWidth);

  useEffect(() => {
    applyWidth(progress.get());
  }, [progress, applyWidth]);

  return (
    <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 sm:bottom-12">
      <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-muted-foreground/50">
        Scroll
      </span>
      <div className="h-px w-24 overflow-hidden rounded-full bg-white/[0.08] sm:w-32">
        <div
          ref={barRef}
          className="h-full origin-left bg-brand will-change-[width]"
          style={{ width: "0%" }}
        />
      </div>
    </div>
  );
}

interface ScrollSequenceWordProps {
  label: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  className?: string;
  reduceEffects?: boolean;
}

export function ScrollSequenceWord({
  label,
  index,
  total,
  progress,
  className,
  reduceEffects = false,
}: ScrollSequenceWordProps) {
  const wordRef = useRef<HTMLSpanElement>(null);

  const initialStyle = useMemo(
    () => scrollWordStyleToCss(computeScrollWordStyle(0, index, total, reduceEffects)),
    [index, total, reduceEffects],
  );

  const applyStyle = useCallback(
    (value: number) => {
      setScrollWordElementStyle(wordRef.current, value, index, total, reduceEffects);
    },
    [index, total, reduceEffects],
  );

  useMotionValueEvent(progress, "change", applyStyle);

  useEffect(() => {
    applyStyle(progress.get());
  }, [progress, applyStyle]);

  const wordClassName =
    className ??
    "absolute inset-0 flex items-center justify-center font-display text-[clamp(2.75rem,9vw,6rem)] font-bold tracking-[-0.04em] text-foreground will-change-[transform,filter,opacity]";

  return (
    <span ref={wordRef} className={wordClassName} style={initialStyle}>
      {label}
    </span>
  );
}

interface ScrollSequenceDotProps {
  index: number;
  total: number;
  progress: MotionValue<number>;
}

export function ScrollSequenceDot({ index, total, progress }: ScrollSequenceDotProps) {
  const dotRef = useRef<HTMLSpanElement>(null);
  const { start, end, peak, fade } = getItemScrollRange(index, total);
  const itemFade = fade * 1.25;

  const applyStyle = useCallback(
    (value: number) => {
      const el = dotRef.current;
      if (!el) return;

      const opacity = mapScrollRange(value, [start, peak - itemFade, peak, peak + itemFade, end], [0.2, 0.45, 1, 0.45, 0.2]);
      const scale = mapScrollRange(value, [start, peak, end], [1, 1.6, 1]);
      const width = mapScrollRange(value, [start, peak, end], [6, 20, 6]);

      el.style.opacity = String(opacity);
      el.style.transform = `scale(${scale})`;
      el.style.width = `${width}px`;
    },
    [start, end, peak, itemFade],
  );

  useMotionValueEvent(progress, "change", applyStyle);

  useEffect(() => {
    applyStyle(progress.get());
  }, [progress, applyStyle]);

  return (
    <span
      ref={dotRef}
      className="h-1.5 rounded-full bg-brand will-change-[transform,width,opacity]"
      style={{ width: 6, opacity: 0.2 }}
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
