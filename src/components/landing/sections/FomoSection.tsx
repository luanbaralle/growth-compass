import type { BusinessPersonalization } from "@/config/microverticals/types";
import type { SegmentConfig } from "@/config/segments/types";
import { searchQueryWithCity } from "@/lib/personalization";
import { SerpPreview } from "../shared/SerpPreview";
import { SectionWrap } from "../shared/SectionWrap";

export function FomoSection({
  config,
  city,
  personalization,
}: {
  config: SegmentConfig;
  city?: string;
  personalization?: BusinessPersonalization;
}) {
  const { fomo } = config;
  const baseQuery = personalization?.searchExamples[0] ?? fomo.searchQuery;
  const searchQuery = searchQueryWithCity(baseQuery, city);
  const subtitle = personalization?.fomoSubtitle ?? fomo.subtitle;
  const yourBusinessLabel = personalization?.yourBusinessLabel ?? fomo.yourBusinessLabel;

  return (
    <SectionWrap>
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold leading-[1.1] text-balance sm:text-4xl lg:text-5xl">
          {fomo.title}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {subtitle}
        </p>
      </div>

      <div className="mx-auto mt-14 max-w-2xl">
        <SerpPreview
          searchQuery={searchQuery}
          mockCompetitors={fomo.competitors}
          yourBusinessLabel={yourBusinessLabel}
          notFoundLabel={fomo.notFoundLabel}
        />
      </div>
    </SectionWrap>
  );
}
