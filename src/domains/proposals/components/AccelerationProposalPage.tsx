import type { Proposal, ProposalContent } from "../types";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { ReactNode } from "react";
import { ProposalDemandChart } from "./ProposalDemandChart";
import { ProposalInvestmentSimulator } from "./ProposalInvestmentSimulator";
import { ProposalLandingMockup } from "./ProposalLandingMockup";
import { ProposalPricingCards } from "./ProposalPricingCards";
import {
  ProposalFunnelJourney,
  ProposalHeroMetrics,
  ProposalMechanismFlow,
} from "./ProposalVisualBlocks";

function resolveCtaHref(content: ProposalContent): string | null {
  return buildWhatsAppUrl(content.cta.whatsappMessage, content.cta.whatsappPhone);
}

function SectionBlock({
  number,
  title,
  narrative,
  bullets,
  children,
}: {
  number: string;
  title: string;
  narrative: string;
  bullets: string[];
  children?: ReactNode;
}) {
  return (
    <section className="scroll-mt-24 border-t border-white/8 pt-16 first:border-t-0 first:pt-0">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500/80">{number}</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/75">{narrative}</p>
      {bullets.length > 0 && (
        <ul className="mt-5 max-w-3xl space-y-2">
          {bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex gap-3 text-sm leading-relaxed text-white/70 before:mt-2 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-amber-500/70"
            >
              {bullet}
            </li>
          ))}
        </ul>
      )}
      {children}
    </section>
  );
}

export function AccelerationProposalPage({ proposal }: { proposal: Proposal }) {
  const content = proposal.content as ProposalContent;
  const ctaHref = resolveCtaHref(content);

  return (
    <div className="min-h-screen bg-[#070708] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.08),_transparent_50%)]" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070708]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">
            {content.hero.eyebrow ?? "Raise One Soluções"}
          </p>
          <Button size="sm" asChild className="bg-amber-500 text-black hover:bg-amber-400" disabled={!ctaHref}>
            {ctaHref ? (
              <a href={ctaHref} target="_blank" rel="noreferrer">
                {content.cta.label}
              </a>
            ) : (
              <span>{content.cta.label}</span>
            )}
          </Button>
        </div>
      </header>

      <section className="relative mx-auto max-w-5xl px-6 pb-16 pt-16 sm:pt-20">
        <p className="text-sm font-medium text-amber-400/90">{proposal.company_name}</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
          {content.hero.title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/65">{content.hero.subtitle}</p>
        {proposal.client_name && (
          <p className="mt-3 text-sm text-white/40">Preparado para {proposal.client_name}</p>
        )}
        {content.heroMetrics && <ProposalHeroMetrics metrics={content.heroMetrics} />}
      </section>

      <div className="relative mx-auto max-w-5xl space-y-0 px-6 pb-28">
        {content.sections.map((section) => {
          let extra: ReactNode = null;
          if (section.key === "opportunity" && content.demandKeywords?.length) {
            extra = <ProposalDemandChart keywords={content.demandKeywords} />;
          }
          if (section.key === "behavior" && content.funnelSteps?.length) {
            extra = <ProposalFunnelJourney steps={content.funnelSteps} />;
          }
          if (section.key === "mechanism") {
            extra = (
              <>
                {content.mechanismFlow?.length ? (
                  <ProposalMechanismFlow steps={content.mechanismFlow} />
                ) : null}
                {content.landingMockup ? (
                  <ProposalLandingMockup
                    mockup={content.landingMockup}
                    companyName={proposal.company_name}
                  />
                ) : null}
              </>
            );
          }
          if (section.key === "investment" && content.pricing?.length) {
            extra = <ProposalPricingCards tiers={content.pricing} />;
          }
          if (section.key === "validation" && content.simulator) {
            extra = <ProposalInvestmentSimulator defaults={content.simulator} />;
          }

          return (
            <SectionBlock
              key={section.key}
              number={section.number}
              title={section.title}
              narrative={section.narrative}
              bullets={section.bullets}
            >
              {extra}
            </SectionBlock>
          );
        })}
      </div>

      <footer className="relative border-t border-white/10 bg-black/50 py-14">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <Button size="lg" asChild className="bg-amber-500 px-8 text-black hover:bg-amber-400" disabled={!ctaHref}>
            {ctaHref ? (
              <a href={ctaHref} target="_blank" rel="noreferrer">
                {content.cta.label}
              </a>
            ) : (
              <span>{content.cta.label}</span>
            )}
          </Button>
          <p className="mt-6 text-xs text-white/35">{proposal.title} · Raise One Soluções</p>
        </div>
      </footer>
    </div>
  );
}

export function ProposalDraftBanner() {
  return (
    <div className="bg-amber-500 px-4 py-2 text-center text-xs font-medium text-black">
      Rascunho — visível apenas no OS. Publique para compartilhar o link público.
    </div>
  );
}
