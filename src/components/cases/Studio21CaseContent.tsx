import type { Case } from "@/types/case";
import { ArrowUpRight } from "lucide-react";
import heroLp from "@/assets/case-studio21/hero-lp.png";
import studio21Logo from "@/assets/case-studio21/logo metálico.png";
import lpDesktop from "@/assets/case-studio21/lp-desktop.png";
import lpMobile from "@/assets/case-studio21/lp-mobile.png";
import { CaseCTA } from "./CaseCTA";
import { CaseHero } from "./CaseHero";
import { DeliverablesScrollSection } from "./DeliverablesScrollSection";
import { ProblemScrollSection } from "./ProblemScrollSection";
import { ProcessTimeline } from "./ProcessTimeline";
import { ResultsSection } from "./ResultsSection";
import { MockupResponsiveShowcase } from "./showcase";
import { LessonsSection } from "./shared/LessonsSection";
import { TransformSection } from "./shared/TransformSection";
import { WhyItWorkedSection } from "./shared/WhyItWorkedSection";
import {
  CaseBody,
  CaseHeading,
  CaseReveal,
  CaseSection,
} from "./shared/CaseSection";

interface Studio21CaseContentProps {
  caseData: Case;
}

function withStudio21Assets(caseData: Case): Case {
  return {
    ...caseData,
    heroImage: heroLp,
    coverImage: heroLp,
    gallery: [
      {
        src: lpDesktop,
        alt: "Landing page Studio 21, página completa",
      },
    ],
    heroExtended: {
      ...caseData.heroExtended,
      logo: studio21Logo,
    },
  };
}

export function Studio21CaseContent({ caseData }: Studio21CaseContentProps) {
  const data = withStudio21Assets(caseData);
  const content = data.content;
  const primaryGallery = data.gallery[0];

  return (
    <div className="case-study">
      <CaseHero caseData={data} />

      <ProblemScrollSection
        id="problema"
        eyebrow="O problema"
        headline={data.challenge}
        intro={content?.problemIntro}
        consequence={content?.problemConsequence}
        pains={data.goals}
        channels={content?.problemChannels ?? []}
        closing={content?.problemClosing}
      />

      <ProcessTimeline steps={data.process} eyebrow="A solução" title={data.solution} />

      <ResultsSection
        metrics={data.metrics}
        deliverables={[]}
        intro={content?.resultsIntro}
      />

      {content?.whyItWorked && content.whyItWorked.length > 0 && (
        <WhyItWorkedSection
          title={content.whyItWorkedTitle}
          intro={content.whyItWorkedIntro}
          items={content.whyItWorked}
          systemFlow={content.systemFlow}
          systemFlowIntro={content.systemFlowIntro}
        />
      )}

      {primaryGallery && (
        <CaseSection id="landing-page" className="overflow-visible py-24 sm:py-32">
          <CaseReveal className="mx-auto max-w-3xl text-center">
            <hr className="border-white/[0.08]" />
            <CaseHeading className="mt-10 text-2xl sm:text-3xl lg:text-4xl">
              {content?.landingTitle}
            </CaseHeading>
            {content?.landingDescription && (
              <CaseBody className="mx-auto mt-6 max-w-2xl">{content.landingDescription}</CaseBody>
            )}
            <hr className="mt-10 border-white/[0.08]" />
          </CaseReveal>

          <div className="mt-14 sm:mt-20">
            <MockupResponsiveShowcase
              desktopSrc={primaryGallery.src}
              desktopAlt={primaryGallery.alt}
              mobileSrc={lpMobile}
              mobileAlt="Landing page Studio 21, versão mobile"
              scrollable
              displayUrl="salaostudio21.com.br"
              scrollHint={content?.landingScrollHint}
            />
          </div>

          {data.website && (
            <CaseReveal delay={0.1} className="mt-10 flex justify-center">
              <a
                href={data.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Ver projeto ao vivo
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </CaseReveal>
          )}
        </CaseSection>
      )}

      {content?.lessonsLearned && content.lessonsLearned.length > 0 && (
        <LessonsSection
          title={content.lessonsTitle}
          intro={content.lessonsIntro}
          items={content.lessonsLearned}
        />
      )}

      {content?.agencyDeliverables && content.agencyDeliverables.length > 0 && (
        <DeliverablesScrollSection
          id="entregaveis"
          items={content.agencyDeliverables}
          intro={content.deliverablesIntro}
        />
      )}

      {content?.transformBefore && content?.transformAfter && (
        <TransformSection
          intro={content.transformIntro}
          closing={content.transformClosing}
          before={content.transformBefore}
          after={content.transformAfter}
        />
      )}

      <CaseCTA caseData={data} />
    </div>
  );
}
