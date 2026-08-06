import { useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";
import { mapScrollRange } from "@/components/shared/scrollDrivenUtils";
import {
  getActiveScrollIndex,
  ScrollDrivenSection,
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
  intro?: string;
  consequence?: string;
  pains: string[];
  channels: string[];
  closing?: string;
}

const CHANNEL_WORD_CLASS =
  "absolute inset-0 flex items-center justify-center font-display text-[clamp(2.75rem,9vw,6rem)] font-bold tracking-[-0.04em] text-foreground will-change-[transform,opacity] lg:justify-start lg:text-[clamp(3.25rem,4.8vw,7rem)]";

function getSupportingText(intro?: string, consequence?: string) {
  if (intro) return intro;
  return consequence;
}

function ProblemPainsGrid({
  pains,
  style,
  className = "mt-8",
}: {
  pains: string[];
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <ul className={`grid gap-3 sm:grid-cols-2 sm:gap-4 ${className}`} style={style}>
      {pains.map((pain) => (
        <li
          key={pain}
          className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-surface/20 px-4 py-3.5 text-left text-sm leading-snug text-muted-foreground sm:px-5 sm:text-base"
        >
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand/70" aria-hidden />
          {pain}
        </li>
      ))}
    </ul>
  );
}

function ChannelProgress({
  progress,
  total,
}: {
  progress: number;
  total: number;
}) {
  const activeIndex = getActiveScrollIndex(progress, total);

  return (
    <div className="mt-5 flex flex-col items-center gap-3 lg:items-start">
      <p className="font-display text-sm font-bold tabular-nums tracking-[0.2em] text-brand sm:text-base">
        {String(activeIndex + 1).padStart(2, "0")}
        <span className="mx-2 font-normal text-muted-foreground/40">/</span>
        {String(total).padStart(2, "0")}
      </p>
      <div className="flex items-center gap-2">
        {Array.from({ length: total }, (_, index) => (
          <ScrollSequenceDot key={index} index={index} total={total} progress={progress} />
        ))}
      </div>
    </div>
  );
}

function ScrollChannelHint({ progress }: { progress: number }) {
  const opacity =
    progress < 0.03 ? 1 : progress < 0.12 ? Math.max(0, 1 - (progress - 0.03) / 0.09) : 0;

  if (opacity <= 0) return null;

  return (
    <p
      className="mt-3 text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground/45 lg:text-left"
      style={{ opacity }}
    >
      Role para ver os canais
    </p>
  );
}

function ProblemClosing({
  closing,
  style,
}: {
  closing: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className="mx-auto mt-20 max-w-2xl border-t border-white/[0.08] pt-12 text-center sm:mt-24 sm:pt-14 lg:max-w-3xl"
      style={style}
    >
      <p className="font-display text-xl font-semibold leading-snug tracking-tight text-foreground sm:text-2xl md:text-[1.65rem]">
        {closing}
      </p>
    </div>
  );
}

function ProblemScrollStatic({
  id,
  eyebrow,
  headline,
  intro,
  consequence,
  pains,
  channels,
  closing,
}: ProblemScrollSectionProps) {
  const supporting = getSupportingText(intro, consequence);

  return (
    <section id={id} className="relative bg-surface/40 py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
          <div className="text-center lg:text-left">
            <CaseEyebrow>{eyebrow}</CaseEyebrow>
            <CaseHeading className="mx-auto mt-5 lg:mx-0">{headline}</CaseHeading>
            {supporting && (
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
                {supporting}
              </p>
            )}
            <ProblemPainsGrid pains={pains} className="mt-8 lg:max-w-xl" />
          </div>

          <div className="lg:pt-4">
            <ul className="space-y-3" aria-label="Canais de aquisição anteriores">
              {channels.map((name) => (
                <li
                  key={name}
                  className="rounded-xl border border-white/[0.08] bg-surface/25 px-5 py-4 text-center font-display text-2xl font-bold tracking-[-0.03em] text-foreground/90 sm:px-6 sm:py-5 sm:text-3xl lg:text-left lg:text-4xl"
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {closing && <ProblemClosing closing={closing} />}
      </div>
    </section>
  );
}

function ProblemScrollStage({
  progress,
  reduceEffects,
  eyebrow,
  headline,
  intro,
  consequence,
  pains,
  channels,
  closing,
}: ProblemScrollSectionProps & { progress: number; reduceEffects: boolean }) {
  const supporting = getSupportingText(intro, consequence);
  const introOpacity = mapScrollRange(progress, [0, 0.08, 0.18, 0.32], [0, 1, 1, 0.35]);
  const introY = reduceEffects ? 0 : mapScrollRange(progress, [0, 0.1], [28, 0]);
  const painsOpacity = mapScrollRange(progress, [0.08, 0.16, 0.28], [0, 1, 0.4]);
  const channelsHintOpacity = mapScrollRange(progress, [0.12, 0.2], [0, 1]);
  const closingOpacity = mapScrollRange(progress, [0.78, 0.88], [0, 1]);
  const closingY = reduceEffects ? 0 : mapScrollRange(progress, [0.78, 0.88], [24, 0]);

  return (
    <div className="relative flex flex-1 flex-col justify-center overflow-hidden py-6 sm:py-8">
      <ScrollSectionBackdrop />

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
          {/* Bloco A — contexto */}
          <div
            className="text-center lg:text-left"
            style={{ opacity: introOpacity, transform: `translate3d(0, ${introY}px, 0)` }}
          >
            <CaseEyebrow>{eyebrow}</CaseEyebrow>
            <CaseHeading className="mx-auto mt-5 lg:mx-0">{headline}</CaseHeading>
            {supporting && (
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
                {supporting}
              </p>
            )}
            <ProblemPainsGrid
              pains={pains}
              className="mt-8 lg:max-w-xl"
              style={{ opacity: painsOpacity }}
            />
          </div>

          {/* Bloco B — tensão (um canal por vez) */}
          <div
            className="relative mt-4 lg:mt-0"
            style={{ opacity: channelsHintOpacity }}
            aria-live="polite"
          >
            <div className="relative mx-auto h-[clamp(5rem,14vw,8.5rem)] w-full max-w-xl lg:mx-0 lg:h-[clamp(6rem,18vw,10rem)] lg:max-w-none">
              {channels.map((name, index) => (
                <ScrollSequenceWord
                  key={name}
                  label={name}
                  index={index}
                  total={channels.length}
                  progress={progress}
                  reduceEffects={reduceEffects}
                  className={CHANNEL_WORD_CLASS}
                />
              ))}
            </div>

            {channels.length > 1 && (
              <ChannelProgress progress={progress} total={channels.length} />
            )}

            <div className="text-center lg:text-left">
              <ScrollChannelHint progress={progress} />
            </div>
          </div>
        </div>

        {closing && (
          <ProblemClosing
            closing={closing}
            style={{
              opacity: closingOpacity,
              transform: `translate3d(0, ${closingY}px, 0)`,
            }}
          />
        )}
      </div>
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
        intro={props.intro}
        consequence={props.consequence}
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
          intro={props.intro}
          consequence={props.consequence}
          pains={pains}
          channels={channels}
          closing={closing}
        />
      )}
    </ScrollDrivenSection>
  );
}
