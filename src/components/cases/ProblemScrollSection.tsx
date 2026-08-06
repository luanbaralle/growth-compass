import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import {
  ScrollDrivenSection,
  ScrollProgressBar,
  ScrollSectionBackdrop,
  ScrollSequenceDot,
  ScrollSequenceWord,
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

function ProblemScrollStage({
  scrollYProgress,
  reduceEffects,
  eyebrow,
  headline,
  pains,
  channels,
  closing,
}: ProblemScrollSectionProps & {
  scrollYProgress: MotionValue<number>;
  reduceEffects: boolean;
}) {
  const introOpacity = useTransform(scrollYProgress, [0, 0.08, 0.18, 0.28], [0, 1, 1, 0.45]);
  const introY = useTransform(scrollYProgress, [0, 0.1], reduceEffects ? [0, 0] : [32, 0]);
  const painsOpacity = useTransform(scrollYProgress, [0.06, 0.14, 0.24], [0, 1, 0.35]);
  const closingOpacity = useTransform(scrollYProgress, [0.8, 0.9], [0, 1]);
  const closingY = useTransform(scrollYProgress, [0.8, 0.9], reduceEffects ? [0, 0] : [28, 0]);

  return (
    <div className="relative flex h-full items-center justify-center">
      <ScrollSectionBackdrop />

      <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-8">
        <div className="flex flex-col items-center text-center">
          <motion.div style={{ opacity: introOpacity, y: introY }} className="max-w-3xl">
            <CaseEyebrow>{eyebrow}</CaseEyebrow>
            <CaseHeading className="mx-auto mt-5">{headline}</CaseHeading>

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
          </motion.div>

          <div
            className="relative mt-14 h-[clamp(5rem,14vw,8.5rem)] w-full sm:mt-16"
            aria-live="polite"
          >
            {channels.map((name, index) => (
              <ScrollSequenceWord
                key={name}
                label={name}
                index={index}
                total={channels.length}
                progress={scrollYProgress}
                reduceEffects={reduceEffects}
              />
            ))}
          </div>
        </div>

        {closing && (
          <motion.p
            style={{ opacity: closingOpacity, y: closingY }}
            className="mx-auto mt-12 max-w-xl text-center text-lg font-medium leading-snug text-foreground/90 sm:mt-14 sm:text-xl md:text-2xl"
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
  const reduceEffects = useReducedMotion() ?? false;
  const { id, eyebrow, headline, pains, channels, closing } = props;

  return (
    <ScrollDrivenSection
      id={id}
      itemCount={channels.length}
      className="relative isolate bg-surface/40"
    >
      {(scrollYProgress) => (
        <ProblemScrollStage
          scrollYProgress={scrollYProgress}
          reduceEffects={reduceEffects}
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
