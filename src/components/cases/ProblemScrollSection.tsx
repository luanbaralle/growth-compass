import { useReducedMotion } from "framer-motion";
import { mapScrollRange } from "@/components/shared/scrollDrivenUtils";
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

function ProblemScrollStatic({
  id,
  eyebrow,
  headline,
  pains,
  channels,
  closing,
}: ProblemScrollSectionProps) {
  return (
    <section id={id} className="relative bg-surface/40 py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
        <CaseEyebrow>{eyebrow}</CaseEyebrow>
        <CaseHeading className="mx-auto mt-5">{headline}</CaseHeading>

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
  progress,
  reduceEffects,
  eyebrow,
  headline,
  pains,
  channels,
  closing,
}: ProblemScrollSectionProps & { progress: number; reduceEffects: boolean }) {
  const introOpacity = mapScrollRange(progress, [0, 0.08, 0.18, 0.28], [0, 1, 1, 0.45]);
  const introY = reduceEffects ? 0 : mapScrollRange(progress, [0, 0.1], [32, 0]);
  const painsOpacity = mapScrollRange(progress, [0.06, 0.14, 0.24], [0, 1, 0.35]);
  const closingOpacity = mapScrollRange(progress, [0.8, 0.9], [0, 1]);
  const closingY = reduceEffects ? 0 : mapScrollRange(progress, [0.8, 0.9], [28, 0]);

  return (
    <div className="relative flex flex-1 items-center justify-center">
      <ScrollSectionBackdrop />

      <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-8">
        <div className="flex flex-col items-center text-center">
          <div
            className="max-w-3xl"
            style={{ opacity: introOpacity, transform: `translate3d(0, ${introY}px, 0)` }}
          >
            <CaseEyebrow>{eyebrow}</CaseEyebrow>
            <CaseHeading className="mx-auto mt-5">{headline}</CaseHeading>

            <ul
              className="mt-8 flex flex-wrap justify-center gap-x-4 gap-y-2 sm:gap-x-6"
              style={{ opacity: painsOpacity }}
            >
              {pains.map((pain) => (
                <li
                  key={pain}
                  className="text-sm font-medium text-muted-foreground sm:text-base md:text-lg"
                >
                  {pain}
                </li>
              ))}
            </ul>
          </div>

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
                progress={progress}
                reduceEffects={reduceEffects}
              />
            ))}
          </div>
        </div>

        {closing && (
          <p
            className="mx-auto mt-12 max-w-xl text-center text-lg font-medium leading-snug text-foreground/90 sm:mt-14 sm:text-xl md:text-2xl"
            style={{ opacity: closingOpacity, transform: `translate3d(0, ${closingY}px, 0)` }}
          >
            {closing}
          </p>
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
                progress={progress}
              />
            ))}
          </div>
        )}
      </div>

      <ScrollProgressBar progress={progress} />
    </div>
  );
}

export function ProblemScrollSection(props: ProblemScrollSectionProps) {
  const reduceEffects = useReducedMotion() ?? false;
  const isWide = useIsWideViewport();
  const { id, eyebrow, headline, pains, channels, closing } = props;

  if (reduceEffects) {
    return (
      <ProblemScrollStatic
        id={id}
        eyebrow={eyebrow}
        headline={headline}
        pains={pains}
        channels={channels}
        closing={closing}
      />
    );
  }

  return (
    <ScrollDrivenSection
      id={id}
      itemCount={channels.length}
      isWide={isWide}
      className="relative isolate bg-surface/40"
    >
      {(progress) => (
        <ProblemScrollStage
          progress={progress}
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
