import type { Proposal } from "../types";
import { R1_ACCELERATION_PRICING } from "../pricing/r1-pricing";
import { ProposalInvestmentLayout } from "../components/ProposalInvestmentLayout";
import { ProposalMetricsCards } from "../components/ProposalMetricsCards";
import {
  CommercialFlowPills,
  ProposalDeliverableGrid,
  ProposalDiscoveryGrid,
  ProposalExclusionsPanel,
  ProposalFunnelCompare,
  ProposalInsightCallout,
  ProposalInsightGrid,
  ProposalMovementCards,
  ProposalNextStepsList,
  ProposalRoadmapTimeline,
  ProposalStrengthGrid,
  ProposalVisionFlow,
  polishedCard,
} from "../components/ProposalReferenceBlocks";
import { R1ProposalNav } from "../shell/R1ProposalNav";
import { R1ScrollProgress } from "../shell/R1ScrollProgress";
import {
  r1LabelClass,
  r1ScrollAnchor,
  r1Shell,
  r1ShellWide,
  r1SectionPy,
} from "../shell/r1-tokens";
import { SAUDE_CIA_NAV, SAUDE_CIA_REFERENCE as C } from "../reference/saude-cia-content";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

function Section({
  id,
  label,
  title,
  children,
  alt,
}: {
  id: string;
  label: string;
  title: string;
  children: ReactNode;
  alt?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        r1ScrollAnchor,
        r1SectionPy,
        "border-b border-white/[0.06]",
        alt ? "bg-white/[0.012]" : "",
      )}
    >
      <div className={r1Shell}>
        <p className={r1LabelClass}>{label}</p>
        <h2 className="mt-3 max-w-3xl text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {title}
        </h2>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

export function SaudeCiaReferenceProposalPage({ proposal }: { proposal: Proposal }) {
  const ctaHref = buildWhatsAppUrl(C.cta.message, proposal.content?.cta?.whatsappPhone);
  const pricing = proposal.content?.pricing ?? R1_ACCELERATION_PRICING;

  return (
    <div className="min-h-screen bg-[#090909] text-white antialiased">
      <R1ScrollProgress />
      <R1ProposalNav ctaHref={ctaHref} ctaLabel={C.cta.label} />

      <header
        id="top"
        className={cn(
          r1ScrollAnchor,
          "relative flex min-h-[88vh] items-center overflow-hidden border-b border-white/[0.06]",
        )}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 top-0 h-[480px] w-[480px] rounded-full bg-emerald-500/[0.07] blur-3xl" />
          <div className="absolute -left-24 bottom-0 h-[380px] w-[380px] rounded-full bg-sky-500/[0.08] blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-0.5 bg-emerald-500/60" />
        </div>

        <div className={cn(r1ShellWide, "relative z-10 py-16 sm:py-24")}>
          <p className="text-sm font-medium text-emerald-400/90">{C.company}</p>
          <p className="mt-1 text-xs text-white/40">{C.client}</p>

          <span className="mt-6 inline-flex rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white/50">
            {C.hero.eyebrow}
          </span>

          <h1 className="mt-8 max-w-4xl text-balance text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
            {C.hero.headline}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
            {C.hero.lead}
          </p>

          <p className="mt-6 max-w-xl border-l-2 border-emerald-500/60 pl-4 text-sm font-medium text-white/70 sm:pl-5 sm:text-base">
            {C.hero.strategyLine}
          </p>

          <p className="mt-8 text-xs text-white/35">{C.hero.footnote}</p>
        </div>

        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/30">
          <ArrowDown className="h-4 w-4 animate-bounce text-emerald-400/70" />
        </div>
      </header>

      <nav className="sticky top-16 z-40 border-b border-white/[0.06] bg-[#090909]/95 backdrop-blur-xl">
        <div className={cn(r1ShellWide, "flex gap-1 overflow-x-auto py-2")}>
          {SAUDE_CIA_NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-white/45 transition-colors hover:bg-white/[0.04] hover:text-white/80"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <main>
        <Section id="descobertas" label="01. O que encontramos" title="Quatro descobertas da reunião">
          <ProposalDiscoveryGrid items={C.discoveries} />
        </Section>

        <Section id="diagnostico" label="02. Diagnóstico" title={C.diagnosis.headline} alt>
          <p className="mb-8 text-xl font-semibold text-white/90">{C.diagnosis.subheadline}</p>
          <ProposalStrengthGrid items={C.diagnosis.strengths} />
          <ProposalInsightCallout
            eyebrow="Aquisição ainda depende de"
            highlight={C.diagnosis.dependency}
            body={C.diagnosis.insight}
          />
        </Section>

        <Section id="gargalo" label="03. O gargalo" title="De indicação a sistema mensurável">
          <ProposalFunnelCompare
            today={C.bottleneck.today}
            target={C.bottleneck.target}
            lacks={C.bottleneck.today.lacks}
            targetCaption="Sistema Raise One de aquisição com dados."
          />
          <p className="mt-8 max-w-3xl rounded-xl border border-white/[0.06] bg-white/[0.015] px-4 py-3 text-sm leading-relaxed text-white/55">
            {C.productPriority}
          </p>
        </Section>

        <Section id="estrategia" label="04. Estratégia" title="Três movimentos de crescimento" alt>
          <ProposalMovementCards movements={C.movements} />

          <div className="mt-8 space-y-4">
            <ProposalInsightGrid
              items={[
                { title: C.lpStrategy.title, body: C.lpStrategy.now, extra: (
                  <p className="mt-3 text-xs leading-relaxed text-white/45">{C.lpStrategy.later}</p>
                ) },
                {
                  title: C.commercialStructure.title,
                  body: C.commercialStructure.body,
                  extra: <CommercialFlowPills steps={C.commercialStructure.flow} />,
                },
                { title: C.capacity.title, body: C.capacity.body },
              ]}
            />
            <div className={cn(polishedCard, "p-5")}>
              <p className="text-sm font-semibold text-white">{C.authority.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{C.authority.body}</p>
            </div>
          </div>
        </Section>

        <Section id="metricas" label="05. Mensuração" title="O que vamos medir">
          <ProposalMetricsCards
            categories={[
              { title: "Aquisição", items: C.metrics.acquisition },
              { title: "Qualidade", items: C.metrics.quality },
              { title: "Comercial", items: C.metrics.commercial },
            ]}
            note={C.metrics.note}
          />
          <ProposalExclusionsPanel wont={C.exclusions.wont} will={C.exclusions.will} />
        </Section>

        <Section id="roadmap" label="06. Roadmap" title="Jornada adaptativa" alt>
          <ProposalRoadmapTimeline
            phases={C.roadmap}
            caption="O roadmap é adaptativo. As próximas etapas serão definidas pelos dados obtidos na operação."
          />
        </Section>

        <Section id="entregaveis" label="07. Entregáveis" title="Quatro blocos do projeto">
          <ProposalDeliverableGrid blocks={C.deliverables} />
        </Section>

        <Section id="investimento" label="08. Investimento" title="Estrutura de investimento" alt>
          <p className="mb-6 max-w-2xl text-sm text-white/55">
            Implementação única, gestão mensal e mídia paga diretamente ao Google, sem margem R1 sobre verba
            de mídia.
          </p>
          <ProposalInvestmentLayout tiers={pricing} />
        </Section>

        <Section id="visao" label="09. Visão" title={C.vision.title}>
          <ProposalVisionFlow
            today={C.vision.today}
            next={C.vision.next}
            future={C.vision.future}
            closing={C.closing}
          />
        </Section>

        <Section id="proximos-passos" label="10. Próximos passos" title="Como começamos" alt>
          <ProposalNextStepsList steps={C.nextSteps} />
        </Section>
      </main>

      <footer className="border-t border-white/[0.06] bg-black/40 py-16">
        <div className={cn(r1Shell, "text-center")}>
          <p className="text-sm text-white/45">Pronto para avançar?</p>
          {ctaHref && (
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
            >
              {C.cta.label}
              <ArrowRight className="h-4 w-4" />
            </a>
          )}
          <p className="mt-8 text-[11px] text-white/30">
            {C.company} × Raise One Soluções
          </p>
        </div>
      </footer>
    </div>
  );
}

export function isSaudeCiaReferenceProposal(proposal: Proposal): boolean {
  const slug = proposal.slug.toLowerCase();
  const company = proposal.company_name.toLowerCase();
  return (
    slug === "saude-cia" ||
    slug.includes("saude-cia") ||
    company.includes("saúde & cia") ||
    company.includes("saude & cia") ||
    company.includes("saúde e cia")
  );
}
