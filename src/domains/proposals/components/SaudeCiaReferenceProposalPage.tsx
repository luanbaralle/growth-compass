import type { Proposal } from "../types";
import { R1_ACCELERATION_PRICING } from "../pricing/r1-pricing";
import { ProposalInvestmentLayout } from "../components/ProposalInvestmentLayout";
import { R1ProposalNav } from "../shell/R1ProposalNav";
import { R1ScrollProgress } from "../shell/R1ScrollProgress";
import {
  r1CardClass,
  r1CardHighlightClass,
  r1LabelClass,
  r1ScrollAnchor,
  r1Shell,
  r1ShellWide,
  r1SectionPy,
} from "../shell/r1-tokens";
import { SAUDE_CIA_NAV, SAUDE_CIA_REFERENCE as C } from "../reference/saude-cia-content";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowRight, Check, X } from "lucide-react";
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

function FunnelSteps({ steps, accent = "emerald" }: { steps: readonly string[]; accent?: "emerald" | "sky" }) {
  const dot = accent === "emerald" ? "bg-emerald-500/60" : "bg-sky-500/60";
  return (
    <div className="space-y-0">
      {steps.map((step, i) => (
        <div key={step} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={cn("h-2.5 w-2.5 rounded-full", dot)} />
            {i < steps.length - 1 && <div className="my-1 w-px flex-1 bg-white/10" />}
          </div>
          <p className={cn("pb-4 text-sm font-medium text-white/80", i === steps.length - 1 && "pb-0")}>
            {step}
          </p>
        </div>
      ))}
    </div>
  );
}

export function SaudeCiaReferenceProposalPage({ proposal }: { proposal: Proposal }) {
  const ctaHref = buildWhatsAppUrl(C.cta.message, proposal.content?.cta?.whatsappPhone);
  const pricing = proposal.content?.pricing ?? R1_ACCELERATION_PRICING;

  return (
    <div className="min-h-screen bg-[#090909] text-white antialiased">
      <R1ScrollProgress />
      <R1ProposalNav ctaHref={ctaHref} ctaLabel={C.cta.label} />

      {/* HERO */}
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

      {/* NAV */}
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
        {/* DESCOBERTAS */}
        <Section id="descobertas" label="01 — O que encontramos" title="Quatro descobertas da reunião">
          <div className="grid gap-4 sm:grid-cols-2">
            {C.discoveries.map((d, i) => (
              <div key={d.title} className={r1CardClass}>
                <p className="font-mono text-xs text-emerald-400/70">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-base font-semibold text-white">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{d.body}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* DIAGNÓSTICO */}
        <Section
          id="diagnostico"
          label="02 — Diagnóstico"
          title={C.diagnosis.headline}
          alt
        >
          <p className="mb-8 text-xl font-semibold text-white/90">{C.diagnosis.subheadline}</p>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {C.diagnosis.strengths.map((s) => (
              <div key={s.label} className={r1CardHighlightClass}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  {s.label}
                </p>
                <p className="mt-2 text-sm font-semibold text-white">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-white/[0.08] bg-white/[0.02] p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Aquisição ainda depende de
            </p>
            <p className="mt-2 font-mono text-sm text-emerald-400/90">{C.diagnosis.dependency}</p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60">{C.diagnosis.insight}</p>
          </div>
        </Section>

        {/* GARGALO */}
        <Section id="gargalo" label="03 — O gargalo" title="De indicação a sistema mensurável">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className={cn(r1CardClass, "border-white/[0.08]")}>
              <p className="text-xs font-bold uppercase tracking-wider text-white/40">{C.bottleneck.today.label}</p>
              <div className="mt-6">
                <FunnelSteps steps={C.bottleneck.today.steps} />
              </div>
              <div className="mt-6 border-t border-white/[0.06] pt-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/35">
                  Pouco controle sobre
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {C.bottleneck.today.lacks.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[11px] text-white/50"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className={cn(r1CardHighlightClass, "border-emerald-500/20")}>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400/80">
                {C.bottleneck.target.label}
              </p>
              <div className="mt-6">
                <FunnelSteps steps={C.bottleneck.target.steps} accent="sky" />
              </div>
              <p className="mt-4 text-xs text-white/45">Sistema Raise One — aquisição com dados.</p>
            </div>
          </div>

          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-white/55">{C.productPriority}</p>
        </Section>

        {/* ESTRATÉGIA — 3 MOVIMENTOS */}
        <Section id="estrategia" label="04 — Estratégia" title="Três movimentos de crescimento" alt>
          <div className="space-y-6">
            {C.movements.map((mov) => (
              <div
                key={mov.number}
                className={cn(
                  r1CardClass,
                  mov.conditional && "border-amber-500/15 bg-amber-500/[0.02]",
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-3xl font-bold text-emerald-400/90">{mov.number}</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">{mov.title}</h3>
                    <p className="mt-1 text-sm text-white/55">{mov.subtitle}</p>
                  </div>
                  {mov.conditional && (
                    <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300/90">
                      Após validação
                    </span>
                  )}
                </div>
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/65">{mov.objective}</p>
                <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                  {mov.items.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-white/60">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400/80" strokeWidth={2.5} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <div className={r1CardClass}>
              <h4 className="text-sm font-semibold text-white">{C.lpStrategy.title}</h4>
              <p className="mt-2 text-sm text-white/55">{C.lpStrategy.now}</p>
              <p className="mt-3 text-xs leading-relaxed text-white/45">{C.lpStrategy.later}</p>
            </div>
            <div className={r1CardClass}>
              <h4 className="text-sm font-semibold text-white">{C.commercialStructure.title}</h4>
              <p className="mt-2 text-sm text-white/55">{C.commercialStructure.body}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {C.commercialStructure.flow.map((step, i) => (
                  <span key={step} className="flex items-center gap-1 text-[11px] text-white/45">
                    {i > 0 && <ArrowRight className="h-3 w-3" />}
                    {step}
                  </span>
                ))}
              </div>
            </div>
            <div className={r1CardClass}>
              <h4 className="text-sm font-semibold text-white">{C.capacity.title}</h4>
              <p className="mt-2 text-sm text-white/55">{C.capacity.body}</p>
            </div>
          </div>

          <div className={cn(r1CardClass, "mt-4")}>
            <h4 className="text-sm font-semibold text-white">{C.authority.title}</h4>
            <p className="mt-2 text-sm text-white/55">{C.authority.body}</p>
          </div>
        </Section>

        {/* MÉTRICAS + EXCLUSÕES */}
        <Section id="metricas" label="05 — Mensuração" title="O que vamos medir">
          <div className="grid gap-4 lg:grid-cols-3">
            {(
              [
                ["Aquisição", C.metrics.acquisition],
                ["Qualidade", C.metrics.quality],
                ["Comercial", C.metrics.commercial],
              ] as const
            ).map(([title, items]) => (
              <div key={title} className={r1CardClass}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400/70">
                  {title}
                </p>
                <ul className="mt-4 space-y-2">
                  {items.map((item) => (
                    <li key={item} className="text-sm text-white/60">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm italic text-white/45">{C.metrics.note}</p>

          <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_auto]">
            <div className={r1CardClass}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                O que não vamos fazer
              </p>
              <ul className="mt-4 space-y-2">
                {C.exclusions.wont.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-white/55">
                    <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400/70" strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className={cn(r1CardHighlightClass, "flex items-center lg:min-w-[240px]")}>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400/70">
                  Nossa abordagem
                </p>
                <p className="mt-3 text-lg font-semibold text-white">{C.exclusions.will}</p>
              </div>
            </div>
          </div>
        </Section>

        {/* ROADMAP */}
        <Section id="roadmap" label="06 — Roadmap" title="Jornada adaptativa" alt>
          <p className="mb-6 text-sm text-white/50">
            O roadmap é adaptativo. As próximas etapas serão definidas pelos dados obtidos na operação.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {C.roadmap.map((phase, i) => (
              <div key={phase.period} className={r1CardClass}>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/35">
                  {phase.period}
                </p>
                <h4 className="mt-2 text-base font-semibold text-white">{phase.title}</h4>
                <ul className="mt-4 space-y-1.5">
                  {phase.items.map((item) => (
                    <li key={item} className="text-xs text-white/50">
                      {item}
                    </li>
                  ))}
                </ul>
                {i < C.roadmap.length - 1 && (
                  <ArrowDown className="mt-4 h-4 w-4 text-white/20 lg:hidden" />
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* ENTREGÁVEIS */}
        <Section id="entregaveis" label="07 — Entregáveis" title="Quatro blocos do projeto">
          <div className="grid gap-4 sm:grid-cols-2">
            {C.deliverables.map((block) => (
              <div key={block.title} className={r1CardHighlightClass}>
                <h4 className="text-base font-semibold text-white">{block.title}</h4>
                <ul className="mt-4 space-y-2">
                  {block.items.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-white/60">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400/70" strokeWidth={2.5} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* INVESTIMENTO */}
        <Section id="investimento" label="08 — Investimento" title="Estrutura de investimento" alt>
          <p className="mb-2 max-w-2xl text-sm text-white/55">
            Implementação única · gestão mensal · mídia paga diretamente ao Google — sem margem R1 sobre verba
            de mídia.
          </p>
          <ProposalInvestmentLayout tiers={pricing} />
        </Section>

        {/* VISÃO + FECHAMENTO */}
        <Section id="visao" label="09 — Visão" title={C.vision.title}>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-white/50">
                Hoje: {C.vision.today}
              </span>
              <ArrowRight className="h-4 w-4 text-emerald-400/60" />
              <span className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-2 text-white/75">
                Próxima etapa: {C.vision.next}
              </span>
            </div>
            <p className="text-sm text-white/45">Futuro: {C.vision.future}</p>
          </div>

          <blockquote className="mt-10 space-y-4 border-l-2 border-emerald-500/50 pl-6">
            {C.closing.map((paragraph) => (
              <p key={paragraph} className="text-base leading-relaxed text-white/75">
                {paragraph}
              </p>
            ))}
          </blockquote>
        </Section>

        {/* PRÓXIMOS PASSOS */}
        <Section id="proximos-passos" label="10 — Próximos passos" title="Como começamos" alt>
          <ol className="space-y-3">
            {C.nextSteps.map((step, index) => (
              <li
                key={step}
                className="flex items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-bold text-emerald-400">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-white/80">{step}</span>
              </li>
            ))}
          </ol>
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
