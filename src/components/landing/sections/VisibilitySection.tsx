import type { BusinessPersonalization } from "@/config/microverticals/types";
import type { SegmentConfig } from "@/config/segments/types";
import { ChevronRight, Search } from "lucide-react";
import { Eyebrow } from "../shared/Eyebrow";
import { SectionWrap } from "../shared/SectionWrap";

export function VisibilitySection({
  config,
  personalization,
}: {
  config: SegmentConfig;
  personalization?: BusinessPersonalization;
}) {
  const { visibility } = config;
  const searchExamples = personalization?.searchExamples.length
    ? personalization.searchExamples
    : visibility.searchExamples;

  const ctaQuestion = personalization
    ? `Quando pesquisam, sua ${personalization.businessType} aparece?`
    : visibility.ctaQuestion;

  const closingLine = personalization
    ? `Mas nada disso importa para quem nunca encontrou sua ${personalization.businessType}.`
    : visibility.closingLine;

  return (
    <SectionWrap>
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <Eyebrow>{visibility.eyebrow}</Eyebrow>
          <h2 className="text-3xl font-bold leading-[1.1] text-balance sm:text-4xl lg:text-5xl">
            {visibility.title}
            <br />
            <span className="text-muted-foreground">{visibility.titleMuted}</span>
          </h2>
          <div className="mt-8 space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>Você pode ter:</p>
            <ul className="space-y-2.5">
              {visibility.qualities.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="h-1 w-1 rounded-full bg-segment" />
                  {item}
                </li>
              ))}
            </ul>
            <p>{closingLine}</p>
          </div>
        </div>

        <div className="lg:pl-10">
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <Search className="h-3.5 w-3.5" />
              Todos os dias pessoas pesquisam
            </div>
            <div className="space-y-2">
              {searchExamples.map((q) => (
                <div
                  key={q}
                  className="group flex items-center justify-between rounded-lg border border-border bg-background/40 px-4 py-3 transition-colors hover:border-segment/40"
                >
                  <span className="flex items-center gap-3 text-sm font-medium">
                    <Search className="h-3.5 w-3.5 text-muted-foreground" />
                    {q}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-segment" />
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-segment/30 bg-segment-soft p-5">
              <p className="text-lg font-semibold text-foreground text-balance sm:text-xl">
                {ctaQuestion.includes(",") ? (
                  <>
                    {ctaQuestion.split(",")[0]},{" "}
                    <span className="text-segment">
                      {ctaQuestion.split(",").slice(1).join(",").trim()}
                    </span>
                  </>
                ) : (
                  <span className="text-segment">{ctaQuestion}</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionWrap>
  );
}
