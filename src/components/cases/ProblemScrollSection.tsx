import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";
import { CaseEyebrow, CaseHeading } from "./shared/CaseSection";

interface ProblemScrollSectionProps {
  id?: string;
  eyebrow: string;
  headline: string;
  pains: string[];
  channels: string[];
  closing?: string;
}

interface ScrollChannelWordProps {
  name: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}

function ScrollChannelWord({ name, index, total, progress }: ScrollChannelWordProps) {
  const start = 0.2 + (index / total) * 0.52;
  const end = 0.2 + ((index + 1) / total) * 0.52;
  const peak = (start + end) / 2;
  const fade = (end - start) * 0.28;

  const opacity = useTransform(
    progress,
    [start, peak - fade, peak, peak + fade, end],
    [0.06, 0.2, 1, 0.2, 0.06],
  );
  const scale = useTransform(progress, [start, peak, end], [0.88, 1.06, 0.88]);
  const y = useTransform(progress, [start, peak, end], [48, 0, -48]);
  const blur = useTransform(progress, [start, peak, end], [6, 0, 6]);
  const filter = useTransform(blur, (value) => `blur(${value}px)`);

  return (
    <motion.span
      style={{ opacity, scale, y, filter }}
      className="absolute inset-0 flex items-center justify-center font-display text-[clamp(2.75rem,9vw,6rem)] font-bold tracking-[-0.04em] text-foreground will-change-transform"
    >
      {name}
    </motion.span>
  );
}

interface ChannelProgressDotProps {
  index: number;
  total: number;
  progress: MotionValue<number>;
}

function ChannelProgressDot({ index, total, progress }: ChannelProgressDotProps) {
  const start = 0.2 + (index / total) * 0.52;
  const end = 0.2 + ((index + 1) / total) * 0.52;
  const peak = (start + end) / 2;
  const fade = (end - start) * 0.35;

  const opacity = useTransform(progress, [start, peak - fade, peak, peak + fade, end], [0.2, 0.4, 1, 0.4, 0.2]);
  const scale = useTransform(progress, [start, peak, end], [1, 1.6, 1]);
  const width = useTransform(progress, [start, peak, end], [6, 20, 6]);

  return (
    <motion.span
      style={{ opacity, scale, width }}
      className="h-1.5 rounded-full bg-brand"
    />
  );
}

function ProblemScrollSectionStatic({
  id,
  eyebrow,
  headline,
  pains,
  channels,
  closing,
}: ProblemScrollSectionProps) {
  return (
    <section id={id} className="relative overflow-hidden bg-surface/40 py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
        <CaseEyebrow>{eyebrow}</CaseEyebrow>
        <CaseHeading className="mx-auto">{headline}</CaseHeading>

        <ul className="mt-10 flex flex-wrap justify-center gap-x-5 gap-y-2">
          {pains.map((pain) => (
            <li key={pain} className="text-base font-medium text-muted-foreground sm:text-lg">
              {pain}
            </li>
          ))}
        </ul>

        <div className="mt-16 flex flex-col items-center gap-4 sm:mt-20 sm:gap-6">
          {channels.map((name) => (
            <p
              key={name}
              className="font-display text-4xl font-bold tracking-[-0.03em] text-foreground/35 sm:text-5xl lg:text-6xl"
            >
              {name}
            </p>
          ))}
        </div>

        {closing && (
          <p className="mx-auto mt-16 max-w-xl text-xl font-medium text-foreground/90 sm:mt-20 sm:text-2xl">
            {closing}
          </p>
        )}
      </div>
    </section>
  );
}

export function ProblemScrollSection(props: ProblemScrollSectionProps) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  if (reduceMotion) {
    return <ProblemScrollSectionStatic {...props} />;
  }

  const { id, eyebrow, headline, pains, channels, closing } = props;
  const scrollHeight = 160 + channels.length * 75;

  const introOpacity = useTransform(scrollYProgress, [0, 0.08, 0.18, 0.28], [0, 1, 1, 0.45]);
  const introY = useTransform(scrollYProgress, [0, 0.1], [32, 0]);
  const painsOpacity = useTransform(scrollYProgress, [0.06, 0.14, 0.24], [0, 1, 0.35]);
  const channelsWrapOpacity = useTransform(scrollYProgress, [0.16, 0.22, 0.76, 0.82], [0, 1, 1, 0.25]);
  const closingOpacity = useTransform(scrollYProgress, [0.8, 0.9], [0, 1]);
  const closingY = useTransform(scrollYProgress, [0.8, 0.9], [28, 0]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={containerRef}
      id={id}
      className="relative bg-surface/40"
      style={{ height: `${scrollHeight}vh` }}
    >
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 42%, oklch(0.72 0.19 48 / 0.06), transparent 55%)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,oklch(1_0_0/0.02)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
          aria-hidden
        />

        <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-8">
          <div className="flex flex-col items-center text-center">
            <motion.div style={{ opacity: introOpacity, y: introY }} className="max-w-3xl">
              <CaseEyebrow>{eyebrow}</CaseEyebrow>
              <CaseHeading className="mx-auto mt-5">{headline}</CaseHeading>
            </motion.div>

            <motion.ul
              style={{ opacity: painsOpacity }}
              className="mt-8 flex flex-wrap justify-center gap-x-4 gap-y-2 sm:gap-x-6"
            >
              {pains.map((pain) => (
                <li
                  key={pain}
                  className="text-sm font-medium text-muted-foreground sm:text-base md:text-lg"
                >
                  {pain}
                </li>
              ))}
            </motion.ul>

            <motion.div
              style={{ opacity: channelsWrapOpacity }}
              className="relative mt-14 h-[clamp(5rem,14vw,8.5rem)] w-full sm:mt-16"
              aria-live="polite"
            >
              {channels.map((name, index) => (
                <ScrollChannelWord
                  key={name}
                  name={name}
                  index={index}
                  total={channels.length}
                  progress={scrollYProgress}
                />
              ))}
            </motion.div>

            {closing && (
              <motion.p
                style={{ opacity: closingOpacity, y: closingY }}
                className="mx-auto mt-12 max-w-xl text-lg font-medium leading-snug text-foreground/90 sm:mt-14 sm:text-xl md:text-2xl"
              >
                {closing}
              </motion.p>
            )}
          </div>

          {channels.length > 1 && (
            <div
              className="absolute right-0 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
              aria-hidden
            >
              {channels.map((name, index) => (
                <ChannelProgressDot
                  key={name}
                  index={index}
                  total={channels.length}
                  progress={scrollYProgress}
                />
              ))}
            </div>
          )}
        </div>

        <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 sm:bottom-12">
          <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-muted-foreground/50">
            Scroll
          </span>
          <div className="h-px w-24 overflow-hidden rounded-full bg-white/[0.08] sm:w-32">
            <motion.div className="h-full origin-left bg-brand" style={{ width: progressWidth }} />
          </div>
        </div>
      </div>
    </section>
  );
}
