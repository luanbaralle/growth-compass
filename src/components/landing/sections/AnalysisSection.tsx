import type { SegmentConfig } from "@/config/segments/types";
import { BarChart3, Check, Globe, Search, Target, TrendingUp, Users } from "lucide-react";
import { Eyebrow } from "../shared/Eyebrow";
import { SectionWrap } from "../shared/SectionWrap";
import { TechBackground } from "../shared/TechBackground";

const CARD_ICONS = [Search, Users, Globe, TrendingUp];

export function AnalysisSection({ config }: { config: SegmentConfig }) {
  const { analysis } = config;

  return (
    <SectionWrap techGlow background={<TechBackground />}>
      <div className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>{analysis.eyebrow}</Eyebrow>
          <h2 className="text-3xl font-bold leading-[1.1] text-balance sm:text-4xl lg:text-5xl">
            {analysis.title} <span className="text-brand">{analysis.titleHighlight}</span>
          </h2>
        </div>

        {/* Checklist de credibilidade */}
        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand/30 bg-brand-soft">
              <BarChart3 className="h-5 w-5 text-brand" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">O que mapeamos na sua análise</p>
              <p className="text-xs text-muted-foreground">Inteligência de mercado local</p>
            </div>
            <div className="ml-auto hidden items-center gap-1.5 sm:flex">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-brand" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Análise em tempo real
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {analysis.checklist.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-border bg-background/50 px-4 py-3 transition-colors hover:border-brand/30"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft">
                  <Check className="h-3.5 w-3.5 text-brand" strokeWidth={3} />
                </span>
                <span className="text-sm font-medium text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {analysis.cards.map((c, i) => {
            const Icon = CARD_ICONS[i] ?? Target;
            return (
              <div
                key={c.title}
                className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-all hover:border-brand/40 hover:bg-surface-elevated hover:shadow-[0_0_32px_-8px] hover:shadow-brand/15"
              >
                <div className="mb-12 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background text-segment transition-colors group-hover:border-segment/40">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <div className="absolute right-5 top-5 font-mono text-xs text-muted-foreground">
                  0{i + 1}
                </div>
                <h3 className="text-lg font-semibold text-foreground">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-border bg-surface/50 p-6 text-center sm:p-8">
          <p className="text-base text-foreground sm:text-lg">
            {analysis.footerLine.split("simples e objetivo")[0]}
            <span className="text-brand">simples e objetivo.</span>
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm text-muted-foreground">
            {analysis.footerSub.split(" · ").map((part, i, arr) => (
              <span key={part} className="flex items-center gap-6">
                {part}
                {i < arr.length - 1 && <span className="hidden sm:inline">•</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </SectionWrap>
  );
}
