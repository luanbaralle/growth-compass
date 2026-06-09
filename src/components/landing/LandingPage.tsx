import type { BusinessMatch } from "@/config/microverticals/types";
import type { BusinessPersonalization } from "@/config/microverticals/types";
import type { SegmentConfig } from "@/config/segments/types";
import type { LeadFormContext } from "./shared/CTAForm";
import { AnalysisSection } from "./sections/AnalysisSection";
import { CTAForm } from "./shared/CTAForm";
import { DemandSection } from "./sections/DemandSection";
import { FomoSection } from "./sections/FomoSection";
import { Footer } from "./shared/Footer";
import { HeroSection } from "./sections/HeroSection";
import { InvisibleClientSection } from "./sections/InvisibleClientSection";
import { JourneySection } from "./sections/JourneySection";
import { MissedOpportunitySection } from "./sections/MissedOpportunitySection";
import { MissionSection } from "./sections/MissionSection";
import { Nav } from "./shared/Nav";
import { SegmentTheme } from "./shared/SegmentTheme";
import { SolutionsSection } from "./sections/SolutionsSection";
import { StickyCta } from "./shared/StickyCta";
import { VisibilitySection } from "./sections/VisibilitySection";

export interface LandingContext {
  city?: string;
  cityState?: string;
  services?: string[];
  personalization?: BusinessPersonalization;
  match?: BusinessMatch;
  fromHub?: boolean;
}

interface LandingPageProps {
  config: SegmentConfig;
  context?: LandingContext;
}

function buildLeadContext(
  config: SegmentConfig,
  context?: LandingContext,
): LeadFormContext {
  const p = context?.personalization;
  const m = context?.match;
  return {
    city: context?.city,
    cityState: context?.cityState,
    defaultBusiness: p?.displayLabel ?? m?.displayLabel,
    templateSlug: m?.templateSlug ?? config.slug,
    negocio: m?.userTerm ?? p?.userTerm,
    displayLabel: p?.displayLabel ?? m?.displayLabel,
    microverticalId: m?.microverticalId || undefined,
    matchLevel: m?.tier ?? p?.tier,
    source: context?.fromHub ? "hub" : "lp",
    fromHub: context?.fromHub,
    searchExamples: p?.searchExamples,
    yourBusinessLabel: p?.yourBusinessLabel ?? m?.yourBusinessLabel,
  };
}

export function LandingPage({ config, context }: LandingPageProps) {
  const city = context?.city;
  const personalization = context?.personalization;
  const fromHub = context?.fromHub ?? false;
  const leadContext = buildLeadContext(config, context);

  return (
    <SegmentTheme accentColor={config.accentColor} accentSoft={config.accentSoft}>
      <Nav homeHref="/" />
      <HeroSection config={config} city={city} personalization={personalization} />
      <VisibilitySection config={config} personalization={personalization} />
      <InvisibleClientSection config={config} city={city} personalization={personalization} />
      <JourneySection config={config} />
      <DemandSection config={config} city={city} personalization={personalization} />
      <FomoSection config={config} city={city} personalization={personalization} />
      <MissedOpportunitySection config={config} />
      <AnalysisSection config={config} />
      <MissionSection config={config} />
      <SolutionsSection config={config} />
      <CTAForm config={config} leadContext={leadContext} />
      {fromHub && <StickyCta label="Receber análise gratuita" />}
      <Footer />
    </SegmentTheme>
  );
}
