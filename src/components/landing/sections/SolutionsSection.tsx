import type { SegmentConfig } from "@/config/segments/types";
import { Eyebrow } from "../shared/Eyebrow";
import { SectionWrap } from "../shared/SectionWrap";

export function SolutionsSection({ config }: { config: SegmentConfig }) {
  const { solutions } = config;

  return (
    <SectionWrap>
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow>{solutions.eyebrow}</Eyebrow>
        <h2 className="text-3xl font-bold leading-[1.1] text-balance sm:text-4xl lg:text-5xl">
          {solutions.title} <span className="text-brand">{solutions.titleHighlight}</span>
        </h2>
      </div>

      <div className="mt-14 grid gap-4 lg:grid-cols-3">
        {solutions.cards.map((c) => (
          <div
            key={c.tag}
            className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-8 transition-all hover:border-brand/40"
          >
            <div className="font-mono text-xs text-brand">{c.tag}</div>
            <h3 className="mt-6 text-xl font-semibold text-foreground">{c.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.description}</p>
            <div className="mt-8 h-px w-full bg-gradient-to-r from-brand/40 via-border to-transparent" />
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-2xl text-center">
        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
          {solutions.footerLine.split("realidade do seu mercado")[0]}
          <span className="text-foreground">realidade do seu mercado.</span>
          <br />
          {solutions.footerHighlight.split("diagnóstico vem primeiro")[0]}
          <span className="text-brand">diagnóstico vem primeiro.</span>
        </p>
      </div>
    </SectionWrap>
  );
}
