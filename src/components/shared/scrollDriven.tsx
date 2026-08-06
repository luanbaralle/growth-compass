import { motion, useTransform, type MotionValue } from "framer-motion";
import { createContext, useContext, useRef, type ReactNode } from "react";
import {
  computeScrollWordStyle,
  getItemScrollRange,
  getScrollSectionHeight,
  mapScrollRange,
  scrollWordStyleToCss,
} from "./scrollDrivenUtils";
import { useClientMounted } from "./useClientMounted";
import { usePinnedScrollProgress } from "./usePinnedScrollProgress";
import { usePreferMotionScroll } from "./usePreferMotionScroll";

export { getItemScrollRange, getScrollSectionHeight } from "./scrollDrivenUtils";

const ScrollProgressValueContext = createContext(0);

export function useScrollProgressValue() {
  return useContext(ScrollProgressValueContext);
}

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
  const { motion: scrollYProgress, value: progressValue } = usePinnedScrollProgress(containerRef);
  const scrollHeight = getScrollSectionHeight(itemCount);

  return (
    <div
      ref={containerRef}
      id={id}
      className={className}
      style={{ height: `${scrollHeight}vh` }}
      data-scroll-driven=""
    >
      <ScrollProgressValueContext.Provider value={progressValue}>
        <div className="sticky top-0 h-[100dvh] min-h-[100svh] w-full overflow-hidden">
          {children(scrollYProgress)}
        </div>
      </ScrollProgressValueContext.Provider>
    </div>
  );
}

interface ScrollProgressBarProps {
  progress: MotionValue<number>;
}

export function ScrollProgressBar({ progress }: ScrollProgressBarProps) {
  const progressWidth = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 sm:bottom-12">
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
  reduceEffects?: boolean;
}

const DEFAULT_WORD_CLASS =
  "absolute inset-0 flex items-center justify-center font-display text-[clamp(2.75rem,9vw,6rem)] font-bold tracking-[-0.04em] text-foreground";

/** Touch / mobile — useTransform + nested blur (do not change) */
function ScrollSequenceWordMotion({
  label,
  index,
  total,
  progress,
  className,
  reduceEffects = false,
}: ScrollSequenceWordProps) {
  const { start, end, peak, fade } = getItemScrollRange(index, total);

  const opacity = useTransform(
    progress,
    [start, peak - fade, peak, peak + fade, end],
    reduceEffects ? [0.15, 0.3, 1, 0.3, 0.15] : [0.06, 0.2, 1, 0.2, 0.06],
  );
  const scale = useTransform(
    progress,
    [start, peak, end],
    reduceEffects ? [1, 1, 1] : [0.88, 1.06, 0.88],
  );
  const y = useTransform(progress, [start, peak, end], reduceEffects ? [0, 0, 0] : [48, 0, -48]);
  const blur = useTransform(progress, [start, peak, end], reduceEffects ? [0, 0, 0] : [6, 0, 6]);
  const filter = useTransform(blur, (value) => `blur(${value}px)`);
  const zIndex = useTransform(progress, (value) => {
    const distance = Math.abs(value - peak);
    const half = (end - start) / 2;
    if (distance >= half) return 1;
    return Math.round((1 - distance / half) * 10) + 2;
  });

  return (
    <motion.span
      style={{ opacity, scale, y, zIndex }}
      className={className ?? DEFAULT_WORD_CLASS}
    >
      <motion.span style={{ filter }} className="inline-block will-change-[filter]">
        {label}
      </motion.span>
    </motion.span>
  );
}

/** Desktop mouse — plain spans driven by context progress (synced with scroll RAF) */
function ScrollSequenceWordState({
  label,
  index,
  total,
  className,
  reduceEffects = false,
}: Omit<ScrollSequenceWordProps, "progress">) {
  const progressValue = useScrollProgressValue();
  const style = computeScrollWordStyle(progressValue, index, total, reduceEffects);
  const outer = scrollWordStyleToCss(style);

  return (
    <span
      className={`${className ?? DEFAULT_WORD_CLASS} will-change-[transform,opacity]`}
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

function ScrollSequenceWordPlaceholder({
  label,
  index,
  total,
  className,
  reduceEffects = false,
}: Omit<ScrollSequenceWordProps, "progress">) {
  const style = computeScrollWordStyle(0, index, total, reduceEffects);
  const outer = scrollWordStyleToCss(style);

  return (
    <span
      className={`${className ?? DEFAULT_WORD_CLASS} will-change-[transform,opacity]`}
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

export function ScrollSequenceWord(props: ScrollSequenceWordProps) {
  const mounted = useClientMounted();
  const preferMotion = usePreferMotionScroll();

  if (!mounted) {
    const { progress: _progress, ...rest } = props;
    return <ScrollSequenceWordPlaceholder {...rest} />;
  }

  if (preferMotion) {
    return <ScrollSequenceWordMotion {...props} />;
  }

  const { progress: _progress, ...rest } = props;
  return <ScrollSequenceWordState {...rest} />;
}

interface ScrollSequenceDotProps {
  index: number;
  total: number;
  progress: MotionValue<number>;
}

function ScrollSequenceDotMotion({ index, total, progress }: ScrollSequenceDotProps) {
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

function ScrollSequenceDotState({ index, total }: Omit<ScrollSequenceDotProps, "progress">) {
  const progressValue = useScrollProgressValue();
  const { start, end, peak, fade } = getItemScrollRange(index, total);
  const itemFade = fade * 1.25;

  const opacity = mapScrollRange(
    progressValue,
    [start, peak - itemFade, peak, peak + itemFade, end],
    [0.2, 0.45, 1, 0.45, 0.2],
  );
  const scale = mapScrollRange(progressValue, [start, peak, end], [1, 1.6, 1]);
  const width = mapScrollRange(progressValue, [start, peak, end], [6, 20, 6]);

  return (
    <span
      className="inline-block h-1.5 rounded-full bg-brand"
      style={{ opacity, transform: `scale(${scale})`, width }}
    />
  );
}

export function ScrollSequenceDot(props: ScrollSequenceDotProps) {
  const preferMotion = usePreferMotionScroll();
  const mounted = useClientMounted();

  if (!mounted || preferMotion) {
    return <ScrollSequenceDotMotion {...props} />;
  }

  const { progress: _progress, ...rest } = props;
  return <ScrollSequenceDotState {...rest} />;
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
