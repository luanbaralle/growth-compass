import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import {
  getItemScrollRange,
  getScrollSectionHeight,
} from "./scrollDrivenUtils";

export { getItemScrollRange, getScrollSectionHeight } from "./scrollDrivenUtils";

export function useIsWideViewport(breakpoint = 1024) {
  const [isWide, setIsWide] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(`(min-width: ${breakpoint}px)`).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${breakpoint}px)`);
    const update = () => setIsWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);

  return isWide;
}

export function useScrollSectionProgress(containerRef: RefObject<HTMLElement | null>) {
  return useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
}

interface ScrollPinViewportProps {
  scrollYProgress: MotionValue<number>;
  className?: string;
  children: ReactNode;
}

/** Pins content to the viewport while the section scroll range is active. */
export function ScrollPinViewport({ scrollYProgress, className, children }: ScrollPinViewportProps) {
  const opacity = useTransform(scrollYProgress, [0, 0.04, 0.96, 1], [0, 1, 1, 0]);
  const visibility = useTransform(scrollYProgress, (value) =>
    value <= 0.005 || value >= 0.995 ? "hidden" : "visible",
  );

  return (
    <motion.div
      style={{ opacity, visibility }}
      className={`pointer-events-none fixed inset-0 z-30 flex items-center justify-center ${className ?? ""}`}
    >
      <div className="pointer-events-auto relative h-full w-full">{children}</div>
    </motion.div>
  );
}

interface ScrollDrivenSectionProps {
  id?: string;
  itemCount: number;
  isWide: boolean;
  className?: string;
  pinClassName?: string;
  children: (progress: MotionValue<number>) => ReactNode;
}

export function ScrollDrivenSection({
  id,
  itemCount,
  isWide,
  className,
  pinClassName,
  children,
}: ScrollDrivenSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScrollSectionProgress(containerRef);
  const scrollHeight = getScrollSectionHeight(itemCount, isWide);

  return (
    <div id={id} className={className}>
      <section ref={containerRef} style={{ height: `${scrollHeight}vh` }} aria-hidden />
      <ScrollPinViewport scrollYProgress={scrollYProgress} className={pinClassName}>
        {children(scrollYProgress)}
      </ScrollPinViewport>
    </div>
  );
}

interface ScrollProgressBarProps {
  progress: MotionValue<number>;
}

export function ScrollProgressBar({ progress }: ScrollProgressBarProps) {
  const progressWidth = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 sm:bottom-12">
      <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-muted-foreground/50">
        Scroll
      </span>
      <div className="h-px w-24 overflow-hidden rounded-full bg-white/[0.08] sm:w-32">
        <motion.div className="h-full origin-left bg-brand" style={{ width: progressWidth }} />
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
}

export function ScrollSequenceWord({
  label,
  index,
  total,
  progress,
  className,
}: ScrollSequenceWordProps) {
  const { start, end, peak, fade } = getItemScrollRange(index, total);

  const opacity = useTransform(
    progress,
    [start, peak - fade, peak, peak + fade, end],
    [0.06, 0.22, 1, 0.22, 0.06],
  );
  const scale = useTransform(progress, [start, peak, end], [0.88, 1.06, 0.88]);
  const y = useTransform(progress, [start, peak, end], [48, 0, -48]);
  const blur = useTransform(progress, [start, peak, end], [6, 0, 6]);
  const filter = useTransform(blur, (value) => `blur(${value}px)`);

  return (
    <motion.span
      style={{ opacity, scale, y, filter }}
      className={
        className ??
        "absolute inset-0 flex items-center justify-center font-display text-[clamp(2.75rem,9vw,6rem)] font-bold tracking-[-0.04em] text-foreground will-change-transform lg:text-[clamp(3.5rem,5.5vw,7.5rem)]"
      }
    >
      {label}
    </motion.span>
  );
}

interface ScrollSequenceDotProps {
  index: number;
  total: number;
  progress: MotionValue<number>;
}

export function ScrollSequenceDot({ index, total, progress }: ScrollSequenceDotProps) {
  const { start, end, peak, fade } = getItemScrollRange(index, total);
  const itemFade = fade * 1.25;

  const opacity = useTransform(
    progress,
    [start, peak - itemFade, peak, peak + itemFade, end],
    [0.2, 0.45, 1, 0.45, 0.2],
  );
  const scale = useTransform(progress, [start, peak, end], [1, 1.6, 1]);
  const width = useTransform(progress, [start, peak, end], [6, 20, 6]);

  return (
    <motion.span
      style={{ opacity, scale, width }}
      className="h-1.5 rounded-full bg-brand"
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
