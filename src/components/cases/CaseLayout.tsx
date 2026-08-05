import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { caseSchemas } from "@/lib/seo/pages";
import type { Case } from "@/types/case";
import { BeforeAfterSection } from "./BeforeAfterSection";
import { CaseCTA } from "./CaseCTA";
import { CaseHero } from "./CaseHero";
import { CaseIntro } from "./CaseIntro";
import { ChallengeSection } from "./ChallengeSection";
import { DesignShowcase } from "./DesignShowcase";
import { GallerySection } from "./GallerySection";
import { GoalsSection } from "./GoalsSection";
import { NextProjectsSection } from "./NextProjectsSection";
import { ProcessTimeline } from "./ProcessTimeline";
import { ResultsSection } from "./ResultsSection";
import { NobreCaseContent } from "./NobreCaseContent";
import { Studio21CaseContent } from "./Studio21CaseContent";
import { UnipCaseContent } from "./UnipCaseContent";
import {
  ContentSections,
  DesignDetailsSections,
  DevelopmentSections,
  MarketingSections,
  ResultsExtendedSections,
  StorytellingClosingSections,
  StorytellingOpeningSections,
} from "./sections";
import { TechStackSection } from "./TechStackSection";

interface CaseLayoutProps {
  caseData: Case;
}

export function CaseLayout({ caseData }: CaseLayoutProps) {
  if (caseData.slug === "unip") {
    return (
      <MarketingLayout schemas={caseSchemas("unip")}>
        <UnipCaseContent caseData={caseData} />
      </MarketingLayout>
    );
  }

  if (caseData.slug === "studio21") {
    return (
      <MarketingLayout schemas={caseSchemas("studio21")}>
        <Studio21CaseContent caseData={caseData} />
      </MarketingLayout>
    );
  }

  if (caseData.slug === "nobre") {
    return (
      <MarketingLayout schemas={caseSchemas("nobre")}>
        <NobreCaseContent caseData={caseData} />
      </MarketingLayout>
    );
  }

  return (
    <MarketingLayout schemas={caseSchemas(caseData.slug)}>
      <div className="case-study">
        {/* Abertura */}
        <CaseHero caseData={caseData} />
        <CaseIntro caseData={caseData} />
        <StorytellingOpeningSections caseData={caseData} />

        {/* Desafio & solução (campos base — retrocompatível) */}
        <ChallengeSection caseData={caseData} />

        {/* Objetivos e processo */}
        <GoalsSection goals={caseData.goals} />
        <ProcessTimeline steps={caseData.process} />

        {/* Design visual */}
        <DesignShowcase caseData={caseData} />
        <DesignDetailsSections caseData={caseData} />
        <BeforeAfterSection items={caseData.beforeAfter} />

        {/* Desenvolvimento & marketing */}
        <DevelopmentSections caseData={caseData} />
        <MarketingSections caseData={caseData} />
        <TechStackSection
          technologies={caseData.technologies}
          deliverables={caseData.deliverables}
        />

        {/* Resultados */}
        <ResultsSection
          metrics={caseData.metrics}
          testimonial={caseData.testimonial}
          deliverables={caseData.deliverables}
        />
        <ResultsExtendedSections caseData={caseData} />
        <StorytellingClosingSections caseData={caseData} />

        {/* Conteúdo complementar */}
        <ContentSections caseData={caseData} />

        {/* Galeria & navegação */}
        <GallerySection gallery={caseData.gallery} />
        <NextProjectsSection projects={caseData.nextProjects} currentSlug={caseData.slug} />
        <CaseCTA caseData={caseData} />
      </div>
    </MarketingLayout>
  );
}
