import type { SegmentConfig } from "@/config/segments/types";
import { ArrowDown, X } from "lucide-react";
import { Eyebrow } from "../shared/Eyebrow";
import { SectionWrap } from "../shared/SectionWrap";

export function MissedOpportunitySection({ config }: { config: SegmentConfig }) {
  const { missedOpportunity } = config;

  return (
    <SectionWrap className="bg-surface/30">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow>Oportunidade Invisível</Eyebrow>
        <h2 className="text-3xl font-bold leading-[1.1] text-balance sm:text-4xl lg:text-5xl">
          {missedOpportunity.title}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
          {missedOpportunity.subtitle}
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl gap-8 lg:grid-cols-[1fr_auto_1fr] lg:items-start">
        {/* Fluxo do concorrente */}
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <p className="mb-6 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            O que acontece com quem aparece
          </p>
          <div className="space-y-1">
            {missedOpportunity.flowSteps.map((step, i) => (
              <div key={step}>
                <div className="flex items-center gap-3 rounded-xl border border-segment/20 bg-segment-soft/30 px-4 py-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-segment/20 font-mono text-[10px] font-semibold text-segment">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-foreground">{step}</span>
                </div>
                {i < missedOpportunity.flowSteps.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ArrowDown className="h-4 w-4 text-segment/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Divisor central */}
        <div className="hidden flex-col items-center justify-center gap-2 lg:flex">
          <div className="h-16 w-px bg-border" />
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            vs
          </span>
          <div className="h-16 w-px bg-border" />
        </div>

        {/* Sua realidade */}
        <div className="rounded-2xl border-2 border-dashed border-destructive/30 bg-destructive/5 p-6 sm:p-8">
          <p className="mb-6 text-xs font-medium uppercase tracking-wider text-destructive/80">
            Sua realidade
          </p>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10">
              <X className="h-8 w-8 text-destructive" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-semibold text-foreground">{missedOpportunity.sideTitle}</h3>
            {missedOpportunity.sideLines.map((line) => (
              <p key={line} className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {line}
              </p>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-destructive/20 bg-background/50 px-4 py-3 text-center">
            <p className="text-xs text-muted-foreground">
              Cada oportunidade perdida é faturamento que você{" "}
              <span className="text-foreground">nunca soube que existia.</span>
            </p>
          </div>
        </div>
      </div>
    </SectionWrap>
  );
}
