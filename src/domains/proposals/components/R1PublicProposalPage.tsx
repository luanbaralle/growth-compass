import type { Proposal, ProposalContent } from "../types";
import { PROPOSAL_TEMPLATE_LABELS } from "../types";
import { applyAccelerationEnhancements } from "../pricing/r1-pricing";
import { sanitizePublicProposalContent } from "../template/sanitize-public-content";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { ProposalCommercialPipeline } from "./ProposalCommercialPipeline";
import { ProposalDeliverableGroups } from "./ProposalDeliverableGroups";
import { ProposalDemandChart } from "./ProposalDemandChart";
import { ProposalDiagnosisCards } from "./ProposalDiagnosisCards";
import { ProposalInvestmentLayout } from "./ProposalInvestmentLayout";
import { ProposalInvestmentSimulator } from "./ProposalInvestmentSimulator";
import { ProposalLandingMockup } from "./ProposalLandingMockup";
import { ProposalMovementsTimeline } from "./ProposalMovementsTimeline";
import {
  ProposalPositioningBand,
  ProposalScopeBoundaries,
  ProposalStrategicGuidance,
} from "./ProposalScopeBlocks";
import {
  ProposalFunnelJourney,
  ProposalMechanismFlow,
} from "./ProposalVisualBlocks";
import { R1CtaBand, R1SectionBlock } from "../shell/R1SectionBlock";
import { R1ExecutiveScope } from "../shell/R1ExecutiveScope";
import { R1ProposalHero } from "../shell/R1ProposalHero";
import { R1ProposalNav } from "../shell/R1ProposalNav";
import { R1ScrollProgress } from "../shell/R1ScrollProgress";
import { R1SectionNav } from "../shell/R1SectionNav";
import { r1Shell, r1SectionPy } from "../shell/r1-tokens";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

function resolveContent(proposal: Proposal): ProposalContent {
  const raw = (proposal.content ?? {}) as Partial<ProposalContent>;
  const normalized: ProposalContent = {
    ...raw,
    hero: raw.hero ?? {
      eyebrow: "Raise One Soluções",
      title: proposal.title,
      subtitle: `Plano estratégico para ${proposal.company_name}`,
    },
    sections: Array.isArray(raw.sections) ? raw.sections : [],
    cta: raw.cta ?? {
      label: "Quero avançar com este plano",
      whatsappMessage: `Olá! Revisei a proposta para ${proposal.company_name} e gostaria de avançar.`,
    },
  };
  const enhanced = applyAccelerationEnhancements(normalized, {
    companyName: proposal.company_name,
    clientHeroMetrics: normalized.heroMetrics,
  });
  return sanitizePublicProposalContent(enhanced);
}

function sectionNavLabel(title: string | undefined): string {
  const safe = title ?? "Seção";
  const short = safe.split("—")[0]?.trim() ?? safe;
  return short.length > 28 ? `${short.slice(0, 26)}…` : short;
}

export function R1PublicProposalPage({ proposal }: { proposal: Proposal }) {
  const content = resolveContent(proposal);
  const ctaHref = buildWhatsAppUrl(content.cta.whatsappMessage, content.cta.whatsappPhone);
  const isAcceleration = proposal.template === "acceleration";

  const deliverables = content.sections.find((s) => s.key === "deliverables");
  const strategy = content.sections.find((s) => s.key === "strategy");

  const extraNav: Array<{ id: string; label: string }> = [];

  const navSections = [
    ...content.sections.map((section) => ({
      id: section.key,
      label: sectionNavLabel(section.title),
    })),
    ...extraNav,
  ];

  const templateLabel = PROPOSAL_TEMPLATE_LABELS[proposal.template];

  const executiveItems =
    deliverables?.bullets.filter((b) => b.startsWith("Estrutura:")).map((b) => b.replace(/^Estrutura:\s*/, "")) ??
    deliverables?.bullets ??
    [];

  function renderSectionExtra(key: string): ReactNode {
    if (key === "diagnosis" && content.diagnosisCards?.length) {
      return <ProposalDiagnosisCards cards={content.diagnosisCards} />;
    }
    if (key === "opportunity" && content.demandKeywords?.length) {
      return <ProposalDemandChart keywords={content.demandKeywords} />;
    }
    if (key === "behavior") {
      return (
        <>
          {content.funnelSteps?.length ? <ProposalFunnelJourney steps={content.funnelSteps} /> : null}
          {content.commercialPipeline?.length ? (
            <ProposalCommercialPipeline steps={content.commercialPipeline} />
          ) : null}
        </>
      );
    }
    if (key === "mechanism") {
      return (
        <>
          {content.mechanismFlow?.length ? (
            <ProposalMechanismFlow steps={content.mechanismFlow} />
          ) : null}
          {content.landingMockup ? (
            <ProposalLandingMockup mockup={content.landingMockup} companyName={proposal.company_name} />
          ) : null}
        </>
      );
    }
    if (key === "strategy" && content.strategicGuidance?.length) {
      return <ProposalStrategicGuidance items={content.strategicGuidance} />;
    }
    if (key === "deliverables" && isAcceleration) {
      return (
        <>
          {content.deliverableGroups && content.deliverableGroups.length > 0 ? (
            <ProposalDeliverableGroups groups={content.deliverableGroups} />
          ) : null}
          <ProposalScopeBoundaries
            exclusions={content.exclusions}
            expansionOpportunities={content.expansionOpportunities}
          />
        </>
      );
    }
    if (key === "investment" && content.pricing?.length) {
      return <ProposalInvestmentLayout tiers={content.pricing} />;
    }
    if (key === "validation" && content.simulator) {
      return <ProposalInvestmentSimulator defaults={content.simulator} />;
    }
    if (key === "implementation" && content.movements?.length) {
      return <ProposalMovementsTimeline movements={content.movements} />;
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-[#090909] text-white antialiased">
      <R1ScrollProgress />
      <R1ProposalNav ctaHref={ctaHref} ctaLabel={content.cta.label} />

      <main>
        <R1ProposalHero
          companyName={proposal.company_name}
          clientName={proposal.client_name}
          title={content.hero.title}
          subtitle={content.hero.subtitle}
          templateLabel={templateLabel}
          tagline={content.positioningStatement}
          metrics={content.heroMetrics}
        />

        <div className={cn(r1Shell, "space-y-8 pb-10 sm:pb-12")}>
          {isAcceleration && (content.positioningStatement || content.phase1Objective) && (
            <ProposalPositioningBand
              statement={content.positioningStatement}
              phase1Objective={content.phase1Objective}
            />
          )}

          {executiveItems.length > 0 && (
            <R1ExecutiveScope
              title="Escopo executivo — Fase 1"
              subtitle="Estrutura mínima para validar o primeiro canal de aquisição."
              items={executiveItems}
            />
          )}

          <R1CtaBand href={ctaHref} label={content.cta.label} />
        </div>

        <R1SectionNav sections={navSections} />

        {content.sections.map((section, index) => {
          const extra = renderSectionExtra(section.key);
          const narrative =
            section.key === "diagnosis" && content.diagnosisConclusion
              ? content.diagnosisConclusion
              : section.narrative;
          const isWide = section.key === "validation" || section.key === "investment";
          const hideBullets =
            section.key === "deliverables" ||
            section.key === "strategy" ||
            section.key === "implementation" ||
            (section.key === "behavior" && Boolean(content.funnelSteps?.length));
          const tone =
            section.key === "opportunity" || section.key === "mechanism"
              ? "elevated"
              : section.key === "validation" || section.key === "investment"
                ? "muted"
                : index % 2 === 1
                  ? "elevated"
                  : "default";

          return (
            <R1SectionBlock
              key={section.key}
              id={section.key}
              number={section.number}
              title={section.title}
              narrative={narrative}
              bullets={hideBullets ? [] : section.bullets}
              wide={isWide}
              tone={tone}
            >
              {extra}
              {section.key === "strategy" && strategy && strategy.bullets.length > 0 && (
                <div className="mt-8 space-y-0">
                  {strategy.bullets.map((bullet, index) => (
                    <div
                      key={bullet}
                      className={cn(
                        "grid gap-4 border-t border-white/[0.06] py-8 sm:grid-cols-[72px_1fr] sm:gap-8",
                        index === 0 && "border-t-0 pt-0",
                      )}
                    >
                      <p className="font-mono text-[12px] text-white/25">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <p className="text-[14px] leading-relaxed text-white/65">{bullet}</p>
                    </div>
                  ))}
                </div>
              )}
            </R1SectionBlock>
          );
        })}

        {content.gapsForMeeting2 && content.gapsForMeeting2.length > 0 && proposal.template !== "acceleration" && (
          <section className={cn(r1Shell, r1SectionPy, "border-t border-white/[0.06]")}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-400/80">
              Validar na Reunião 2
            </p>
            <ul className="mt-4 max-w-2xl space-y-2 text-sm text-white/60">
              {content.gapsForMeeting2.map((gap) => (
                <li key={gap} className="flex gap-2">
                  <span className="text-amber-500/70">·</span>
                  {gap}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <footer className="border-t border-white/[0.06] bg-black/40 py-16 sm:py-20">
        <div className={cn(r1Shell, "text-center")}>
          <p className="text-sm text-white/45">Pronto para avançar?</p>
          <R1CtaBand href={ctaHref} label={content.cta.label} className="mt-6 flex justify-center" />
          <p className="mt-8 text-[11px] text-white/30">
            {proposal.company_name} × Raise One Soluções
          </p>
        </div>
      </footer>
    </div>
  );
}

export function ProposalDraftBanner() {
  return (
    <div className="bg-amber-500 px-4 py-2 text-center text-xs font-medium text-black">
      Rascunho pós-reunião — requer auditoria comercial antes de publicar. Publique para compartilhar o link público.
    </div>
  );
}
