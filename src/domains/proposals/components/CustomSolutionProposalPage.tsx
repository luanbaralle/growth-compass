import type { Proposal, ProposalContent } from "../types";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function CustomSolutionProposalPage({ proposal }: { proposal: Proposal }) {
  const content = proposal.content as ProposalContent;
  const ctaHref = buildWhatsAppUrl(content.cta.whatsappMessage, content.cta.whatsappPhone);

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-[#1a1a1a]">
      <header className="border-b border-black/8 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">
            Raise One · Projeto sob medida
          </p>
          <Button size="sm" variant="default" asChild disabled={!ctaHref}>
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

      <section className="mx-auto max-w-3xl px-6 pb-16 pt-14">
        <p className="text-sm text-black/50">Preparado para {proposal.client_name ?? proposal.company_name}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{content.hero.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-black/65">{content.hero.subtitle}</p>
      </section>

      <div className="mx-auto max-w-3xl space-y-12 px-6 pb-20">
        {content.sections.map((section) => (
          <section key={section.key} className="rounded-2xl border border-black/8 bg-white p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-black/35">
              {section.number}
            </p>
            <h2 className="mt-2 text-xl font-semibold">{section.title}</h2>
            <p className="mt-4 text-sm leading-relaxed text-black/70">{section.narrative}</p>
            {section.bullets.length > 0 && (
              <ul className="mt-4 space-y-2 border-t border-black/6 pt-4">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="text-sm text-black/65 before:mr-2 before:content-['—']">
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <footer className="border-t border-black/8 bg-white py-10">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Button asChild disabled={!ctaHref}>
            {ctaHref ? (
              <a href={ctaHref} target="_blank" rel="noreferrer">
                {content.cta.label}
              </a>
            ) : (
              <span>{content.cta.label}</span>
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
}
