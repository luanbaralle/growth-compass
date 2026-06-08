import type { SegmentConfig } from "@/config/segments/types";
import { Globe, Sparkles, Target, Users } from "lucide-react";
import { Eyebrow } from "../shared/Eyebrow";
import { SectionWrap } from "../shared/SectionWrap";

const ICONS = [Target, Users, Globe, Sparkles];

export function AnalysisSection({ config }: { config: SegmentConfig }) {
  const { analysis } = config;

  return (
    <SectionWrap>
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow>{analysis.eyebrow}</Eyebrow>
        <h2 className="text-3xl font-bold leading-[1.1] text-balance sm:text-4xl lg:text-5xl">
          {analysis.title} <span className="text-brand">{analysis.titleHighlight}</span>
        </h2>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {analysis.cards.map((c, i) => {
          const Icon = ICONS[i] ?? Target;
          return (
            <div
              key={c.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-all hover:border-brand/40 hover:bg-surface-elevated"
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
    </SectionWrap>
  );
}
