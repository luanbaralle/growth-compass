import type { BusinessPersonalization } from "@/config/microverticals/types";
import type { SegmentConfig } from "@/config/segments/types";
import { Eyebrow } from "../shared/Eyebrow";
import { SectionWrap } from "../shared/SectionWrap";

export function DemandSection({
  config,
  city,
  personalization,
}: {
  config: SegmentConfig;
  city?: string;
  personalization?: BusinessPersonalization;
}) {
  const { demand } = config;

  const demandBars =
    personalization?.searchExamples.length && personalization.searchExamples.length >= 3
      ? personalization.searchExamples.slice(0, 5).map((label, i) => ({
          label: label.length > 28 ? `${label.slice(0, 26)}…` : label,
          value: Math.max(35, 92 - i * 12),
        }))
      : demand.bars;

  return (
    <SectionWrap className="bg-surface/30">
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20">
        <div>
          <Eyebrow>{demand.eyebrow}</Eyebrow>
          <h2 className="text-3xl font-bold leading-[1.1] text-balance sm:text-4xl lg:text-5xl">
            {demand.title}
            <br />
            <span className="text-muted-foreground">{demand.titleMuted}</span>
          </h2>
          <div className="mt-8 space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {demand.paragraphs.map((p, i) => (
              <p
                key={i}
                className={i === demand.paragraphs.length - 1 ? "text-foreground" : undefined}
              >
                {i === demand.paragraphs.length - 1 ? (
                  <>
                    Não porque você é pior.{" "}
                    <span className="text-brand">Mas porque você não apareceu.</span>
                  </>
                ) : (
                  p
                )}
              </p>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="rounded-2xl border border-border bg-background p-6 sm:p-8">
            <div className="mb-6 flex items-baseline justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Demanda regional{city ? ` — ${city}` : ""} · últimos 30 dias
              </span>
              <span className="font-mono text-xs text-brand">{demand.totalSearches}</span>
            </div>
            <div className="space-y-4">
              {demandBars.map((row) => (
                <div key={row.label}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{row.label}</span>
                    <span className="font-mono text-muted-foreground">{row.value}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-elevated">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-segment to-segment/60"
                      style={{ width: `${row.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border bg-surface px-4 py-3">
                <div className="text-xs text-muted-foreground">{demand.capturedLabel}</div>
                <div className="mt-1 text-lg font-semibold text-muted-foreground">?</div>
              </div>
              <div className="rounded-lg border border-segment/30 bg-segment-soft px-4 py-3">
                <div className="text-xs text-segment">{demand.availableLabel}</div>
                <div className="mt-1 text-lg font-semibold text-segment">100%</div>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-segment/5 blur-3xl" />
        </div>
      </div>
    </SectionWrap>
  );
}
