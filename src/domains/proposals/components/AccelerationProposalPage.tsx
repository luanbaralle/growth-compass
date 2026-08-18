import type { Proposal, ProposalContent } from "../types";
import { Button } from "@/components/ui/button";

function buildWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/?text=${encoded}`;
}

export function AccelerationProposalPage({ proposal }: { proposal: Proposal }) {
  const content = proposal.content as ProposalContent;
  const ctaHref = buildWhatsAppUrl(content.cta.whatsappMessage);

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0b]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">
            {content.hero.eyebrow ?? "Raise One Soluções"}
          </p>
          <Button size="sm" asChild className="bg-amber-500 text-black hover:bg-amber-400">
            <a href={ctaHref} target="_blank" rel="noreferrer">
              {content.cta.label}
            </a>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 pb-20 pt-16">
        <p className="text-sm text-amber-400/90">{proposal.company_name}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          {content.hero.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/70">{content.hero.subtitle}</p>
        {proposal.client_name && (
          <p className="mt-2 text-sm text-white/45">Preparado para {proposal.client_name}</p>
        )}
      </section>

      <div className="mx-auto max-w-4xl space-y-16 px-6 pb-24">
        {content.sections.map((section) => (
          <section key={section.key} id={section.key} className="scroll-mt-24">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500/80">
              {section.number}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">{section.title}</h2>
            <p className="mt-4 text-base leading-relaxed text-white/75">{section.narrative}</p>
            {section.bullets.length > 0 && (
              <ul className="mt-5 space-y-2">
                {section.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex gap-3 text-sm leading-relaxed text-white/70 before:mt-2 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-amber-500/70"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <footer className="border-t border-white/10 bg-black/40 py-12">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Button size="lg" asChild className="bg-amber-500 text-black hover:bg-amber-400">
            <a href={ctaHref} target="_blank" rel="noreferrer">
              {content.cta.label}
            </a>
          </Button>
          <p className="mt-6 text-xs text-white/35">
            {proposal.title} · Raise One Soluções
          </p>
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
