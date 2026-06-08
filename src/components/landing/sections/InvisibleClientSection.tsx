import type { BusinessPersonalization } from "@/config/microverticals/types";
import type { SegmentConfig } from "@/config/segments/types";
import { Search } from "lucide-react";
import { searchQueryWithCity } from "@/lib/personalization";
import { Eyebrow } from "../shared/Eyebrow";
import { SectionWrap } from "../shared/SectionWrap";

export function InvisibleClientSection({
  config,
  city,
  personalization,
}: {
  config: SegmentConfig;
  city?: string;
  personalization?: BusinessPersonalization;
}) {
  const { invisibleClient } = config;
  const baseQuery = personalization?.searchExamples[0] ?? invisibleClient.searchQuery;
  const searchQuery = searchQueryWithCity(baseQuery, city);

  return (
    <SectionWrap className="bg-surface/30">
      <div className="mx-auto max-w-4xl text-center">
        <Eyebrow>{invisibleClient.eyebrow}</Eyebrow>
        <h2 className="text-3xl font-bold leading-[1.1] text-balance sm:text-4xl lg:text-5xl">
          {invisibleClient.title}{" "}
          <span className="text-segment">{invisibleClient.titleHighlight}</span>
        </h2>
      </div>

      <div className="mx-auto mt-14 max-w-3xl">
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-10">
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="font-mono text-sm text-foreground">{searchQuery}</span>
            <span className="ml-auto text-xs text-muted-foreground">Google</span>
          </div>

          <div className="space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {invisibleClient.paragraphs.map((p, i) => (
              <p key={i}>
                {i === 0 && (
                  <>
                    Ela <span className="text-foreground">não está navegando</span> por curiosidade.
                  </>
                )}
                {i === 1 && (
                  <>
                    Ela já decidiu que{" "}
                    <span className="text-foreground">quer resolver um problema.</span>
                  </>
                )}
                {i === 2 && (
                  <>
                    Ela está <span className="text-foreground">escolhendo quem vai atender.</span>
                  </>
                )}
              </p>
            ))}
          </div>

          <div className="my-8 h-px bg-border" />

          <p className="text-lg leading-relaxed text-foreground text-balance sm:text-xl">
            {invisibleClient.closingLine.includes("esse contato") ? (
              <>
                {invisibleClient.closingLine.split("esse contato")[0]}
                esse contato{" "}
                <span className="text-segment">
                  {invisibleClient.closingLine.split("esse contato")[1]?.trim()}
                </span>
              </>
            ) : (
              invisibleClient.closingLine
            )}
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {["Sem aviso", "Sem notificação", "Sem perceber"].map((label) => (
              <div key={label} className="rounded-lg border border-border bg-background py-3">
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrap>
  );
}
