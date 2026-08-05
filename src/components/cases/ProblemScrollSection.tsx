import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import {
  ScrollDrivenSection,
  ScrollProgressBar,
  ScrollSectionBackdrop,
  ScrollSequenceDot,
  ScrollSequenceWord,
  useIsWideViewport,
} from "@/components/shared/scrollDriven";
import { CaseEyebrow, CaseHeading } from "./shared/CaseSection";

interface ProblemScrollSectionProps {
  id?: string;
  eyebrow: string;
  headline: string;
  pains: string[];
  channels: string[];
  closing?: string;
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

function ProblemScrollStage({
  scrollYProgress,
  isWide,
  eyebrow,
  headline,
  pains,
  channels,
  closing,
}: ProblemScrollSectionProps & { scrollYProgress: MotionValue<number>; isWide: boolean }) {
  const introOpacity = useTransform(scrollYProgress, [0, 0.08, 0.18, 0.28], [0, 1, 1, isWide ? 0.85 : 0.45]);
  const introY = useTransform(scrollYProgress, [0, 0.1], [32, 0]);
  const painsOpacity = useTransform(scrollYProgress, [0.06, 0.14, 0.24], [0, 1, isWide ? 0.75 : 0.35]);
  const channelsWrapOpacity = useTransform(scrollYProgress, [0.16, 0.22, 0.76, 0.82], [0, 1, 1, 0.25]);
  const closingOpacity = useTransform(scrollYProgress, [0.8, 0.9], [0, 1]);
  const closingY = useTransform(scrollYProgress, [0.8, 0.9], [28, 0]);

  return (
    <div className="relative flex h-[100dvh] min-h-[100svh] items-center justify-center overflow-hidden">
      <ScrollSectionBackdrop />

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col items-center text-center lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-12 lg:text-left xl:gap-16">
          <motion.div
            style={{ opacity: introOpacity, y: introY }}
            className="max-w-3xl lg:max-w-none"
          >
            <CaseEyebrow>{eyebrow}</CaseEyebrow>
            <CaseHeading className="mx-auto mt-5 lg:mx-0">{headline}</CaseHeading>

            <motion.ul
              style={{ opacity: painsOpacity }}
              className="mt-8 flex flex-wrap justify-center gap-x-4 gap-y-2 sm:gap-x-6 lg:justify-start"
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
          </motion.div>

          <motion.div
            style={{ opacity: channelsWrapOpacity }}
            className="relative mt-14 h-[clamp(5rem,14vw,8.5rem)] w-full sm:mt-16 lg:mt-0 lg:h-[clamp(6rem,18vw,10rem)]"
            aria-live="polite"
          >
            {channels.map((name, index) => (
              <ScrollSequenceWord
                key={name}
                label={name}
                index={index}
                total={channels.length}
                progress={scrollYProgress}
                className="absolute inset-0 flex items-center justify-center font-display text-[clamp(2.75rem,9vw,6rem)] font-bold tracking-[-0.04em] text-foreground will-change-transform lg:justify-start lg:text-[clamp(3.25rem,4.8vw,7rem)]"
              />
            ))}
          </motion.div>
        </div>

        {closing && (
          <motion.p
            style={{ opacity: closingOpacity, y: closingY }}
            className="mx-auto mt-12 max-w-xl text-center text-lg font-medium leading-snug text-foreground/90 sm:mt-14 sm:text-xl md:text-2xl lg:max-w-2xl"
          >
            {closing}
          </motion.p>
        )}

        {channels.length > 1 && (
          <div
            className="absolute right-0 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
            aria-hidden
          >
            {channels.map((name, index) => (
              <ScrollSequenceDot
                key={name}
                index={index}
                total={channels.length}
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

export function ProblemScrollSection(props: ProblemScrollSectionProps) {
  const reduceMotion = useReducedMotion();
  const isWide = useIsWideViewport();

  if (reduceMotion) {
    return <ProblemScrollSectionStatic {...props} />;
  }

  const { id, eyebrow, headline, pains, channels, closing } = props;

  return (
    <ScrollDrivenSection
      id={id}
      itemCount={channels.length}
      isWide={isWide}
      className="relative bg-surface/40"
    >
      {(scrollYProgress) => (
        <ProblemScrollStage
          scrollYProgress={scrollYProgress}
          isWide={isWide}
          eyebrow={eyebrow}
          headline={headline}
          pains={pains}
          channels={channels}
          closing={closing}
        />
      )}
    </ScrollDrivenSection>
  );
}
