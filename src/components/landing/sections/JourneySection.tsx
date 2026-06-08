import type { SegmentConfig } from "@/config/segments/types";
import { Instagram, Search } from "lucide-react";
import { Eyebrow } from "../shared/Eyebrow";
import { SectionWrap } from "../shared/SectionWrap";

export function JourneySection({ config }: { config: SegmentConfig }) {
  const { journey } = config;

  return (
    <SectionWrap>
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow>{journey.eyebrow}</Eyebrow>
        <h2 className="text-3xl font-bold leading-[1.1] text-balance sm:text-4xl lg:text-5xl">
          {journey.title} <span className="text-brand">{journey.titleHighlight}</span>
        </h2>
      </div>

      <div className="mx-auto mt-14 max-w-2xl">
        <div className="relative space-y-2">
          {journey.steps.map((step, i) => (
            <div key={step}>
              <div className="flex items-center gap-4 rounded-xl border border-border bg-surface px-5 py-4 transition-all hover:border-brand/40 hover:bg-surface-elevated">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-soft font-mono text-xs font-semibold text-brand">
                  0{i + 1}
                </span>
                <span className="text-sm font-medium text-foreground sm:text-base">{step}</span>
              </div>
              {i < journey.steps.length - 1 && (
                <div className="ml-9 h-3 w-px bg-gradient-to-b from-brand/50 to-transparent" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-4 rounded-2xl border border-border bg-surface/50 p-6 sm:grid-cols-2 sm:p-8">
          <div className="flex items-start gap-3">
            <Instagram className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              {journey.instagramNote.split("apenas no Instagram")[0]}
              <span className="text-foreground">apenas no Instagram.</span>
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Search className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
            <p className="text-sm leading-relaxed text-foreground">
              Mas a maioria dos clientes inicia sua jornada de compra{" "}
              <span className="text-brand">no Google.</span>
            </p>
          </div>
        </div>
      </div>
    </SectionWrap>
  );
}
