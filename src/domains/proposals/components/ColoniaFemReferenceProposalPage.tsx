import type { Proposal } from "../types";
import {
  COLONIA_FEM_INVESTMENT,
  COLONIA_FEM_NAV,
  COLONIA_FEM_PRICING,
  COLONIA_FEM_REFERENCE as C,
} from "../reference/colonia-fem-content";
import { ProposalMetricsCards } from "../components/ProposalMetricsCards";
import {
  ProposalDeliverableGrid,
  ProposalExclusionsPanel,
  ProposalExpansionCard,
  ProposalMovementCards,
  ProposalRoadmapTimeline,
  ProposalStrengthGrid,
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
import heroVisual from "@/assets/proposals/colonia-fem/hero-visual.png";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  BedDouble,
  Building2,
  CalendarCheck,
  Camera,
  Check,
  CircleDollarSign,
  Clock3,
  Eye,
  Facebook,
  FileCheck2,
  Gift,
  Handshake,
  Instagram,
  LayoutTemplate,
  LineChart,
  MapPin,
  Megaphone,
  MessageCircle,
  MousePointerClick,
  Radio,
  Search,
  Sparkles,
  Target,
  Users,
  UtensilsCrossed,
  Waves,
  Clapperboard,
} from "lucide-react";
import type { ReactNode } from "react";

const CLOSING_FLOW_ICONS = [Search, Megaphone, LayoutTemplate, MessageCircle, CalendarCheck] as const;

function OperationFlowDiagram({
  label,
  steps,
}: {
  label: string;
  steps: readonly { label: string; hint: string }[];
}) {
  return (
    <div className="colonia-flow mt-10 w-full" aria-label={label}>
      <p className="mb-5 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400/70">
        {label}
      </p>

      {/* Mobile: vertical */}
      <ol className="mx-auto flex max-w-[220px] flex-col items-center gap-0 sm:hidden">
        {steps.map((step, i) => {
          const Icon = CLOSING_FLOW_ICONS[i] ?? Sparkles;
          const isLast = i === steps.length - 1;
          return (
            <li key={step.label} className="flex w-full flex-col items-center">
              <div
                className="colonia-flow-node flex w-full flex-col items-center rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.07] px-3 py-3.5"
                style={{ animationDelay: `${i * 0.35}s` }}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/30 bg-[#0c0c0c] text-emerald-400">
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </span>
                <p className="mt-2 text-sm font-semibold text-white">{step.label}</p>
                <p className="mt-0.5 text-[11px] text-white/45">{step.hint}</p>
              </div>
              {!isLast && (
                <div className="relative my-1.5 flex h-8 w-px items-center justify-center overflow-hidden bg-emerald-500/20">
                  <span className="colonia-flow-travel-y absolute inset-x-0 h-3 w-full bg-gradient-to-b from-transparent via-emerald-400 to-transparent" />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {/* Desktop / tablet: horizontal */}
      <ol className="mx-auto hidden max-w-4xl items-stretch justify-center gap-0 sm:flex">
        {steps.map((step, i) => {
          const Icon = CLOSING_FLOW_ICONS[i] ?? Sparkles;
          const isLast = i === steps.length - 1;
          return (
            <li key={step.label} className="flex min-w-0 flex-1 items-center">
              <div
                className="colonia-flow-node flex w-full flex-col items-center rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/[0.1] to-white/[0.02] px-2.5 py-4 text-center sm:px-3"
                style={{ animationDelay: `${i * 0.35}s` }}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-emerald-500/30 bg-[#0c0c0c] text-emerald-400">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                </span>
                <p className="mt-2.5 text-[13px] font-semibold leading-tight text-white sm:text-sm">
                  {step.label}
                </p>
                <p className="mt-1 text-[10px] leading-snug text-white/45 sm:text-[11px]">
                  {step.hint}
                </p>
              </div>
              {!isLast && (
                <div className="relative mx-1 flex h-px w-6 shrink-0 items-center overflow-hidden sm:mx-1.5 sm:w-8 md:w-10">
                  <span className="absolute inset-0 bg-emerald-500/25" />
                  <span className="absolute inset-y-0 left-0 h-full w-1/2 animate-flow bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
                  <ArrowRight
                    className="relative z-10 mx-auto h-3 w-3 text-emerald-400/50"
                    aria-hidden
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function IconPill({
  icon: Icon,
  className,
}: {
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]",
        className,
      )}
    >
      <Icon className="h-4 w-4 text-emerald-400/85" strokeWidth={2} />
    </span>
  );
}

function Section({
  id,
  label,
  title,
  children,
  alt,
  icon: Icon,
}: {
  id: string;
  label: string;
  title: string;
  children: ReactNode;
  alt?: boolean;
  icon?: LucideIcon;
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
        <div className="flex items-start gap-3">
          {Icon && <IconPill icon={Icon} />}
          <div className="min-w-0">
            <p className={r1LabelClass}>{label}</p>
            <h2 className="mt-2 max-w-3xl text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {title}
            </h2>
          </div>
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

function FlowSteps({
  steps,
  numbered = false,
}: {
  steps: readonly string[];
  numbered?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-stretch gap-2">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          {i > 0 && <ArrowRight className="hidden h-4 w-4 shrink-0 text-emerald-400/40 sm:block" />}
          <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5">
            {numbered && (
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 font-mono text-[10px] font-bold text-emerald-400">
                {String(i + 1).padStart(2, "0")}
              </span>
            )}
            <span className="text-sm font-medium text-white/80">{step}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

const CHANNEL_ICONS: Record<string, LucideIcon> = {
  Instagram,
  Facebook,
  Rádio: Radio,
  WhatsApp: MessageCircle,
  "Parceiros e agências": Handshake,
  "Sindicatos filiados e parceiros": Users,
};

const GAP_ICONS: Record<string, LucideIcon> = {
  "Landing Page": LayoutTemplate,
  "Presença no Google": Search,
  "Google Maps": MapPin,
  "Aquisição por busca": Megaphone,
};

const ANSWER_ICONS: Record<string, LucideIcon> = {
  "Onde fica?": MapPin,
  "O que oferece?": BedDouble,
  "Para quem?": Users,
  "Quanto custa?": CircleDollarSign,
  "Como reservar?": CalendarCheck,
};

const ADS_ICONS: Record<string, LucideIcon> = {
  "Hospedagem em Itanhaém": Building2,
  "Pensão completa": UtensilsCrossed,
  "Grupos e excursões": Users,
  "Baixa temporada": CalendarCheck,
  "Ofertas e pacotes": Sparkles,
};

const AVAIL_ICONS = [Eye, Sparkles, Target, Users] as const;

const FUNNEL_ICONS = [
  Search,
  Eye,
  MessageCircle,
  CircleDollarSign,
  CalendarCheck,
  FileCheck2,
  Check,
] as const;

const SCHEDULE_ICONS: Record<string, LucideIcon> = {
  "Check-in": Clock3,
  "Check-out": Clock3,
  Recepção: Building2,
  Piscina: Waves,
};

const WHY_ICONS: Record<string, LucideIcon> = {
  Marketing: Megaphone,
  Tecnologia: LayoutTemplate,
  Dados: BarChart3,
  Estratégia: Target,
};

const OFFER_ICONS = [
  BedDouble,
  UtensilsCrossed,
  Waves,
  MapPin,
  Handshake,
  Users,
  Building2,
  CircleDollarSign,
] as const;

export function ColoniaFemReferenceProposalPage({ proposal }: { proposal: Proposal }) {
  const ctaHref = buildWhatsAppUrl(C.cta.message, proposal.content?.cta?.whatsappPhone);
  const inv = COLONIA_FEM_INVESTMENT;
  const implTier = COLONIA_FEM_PRICING.find((t) => t.id === "implementation")!;
  const mgmtTier = COLONIA_FEM_PRICING.find((t) => t.id === "management")!;
  const mediaTier = COLONIA_FEM_PRICING.find((t) => t.id === "media")!;

  return (
    <div className="min-h-screen bg-[#090909] text-white antialiased">
      <R1ScrollProgress />
      <R1ProposalNav ctaHref={ctaHref} ctaLabel={C.cta.label} />

      <header
        id="top"
        className={cn(r1ScrollAnchor, "relative overflow-hidden border-b border-white/[0.06]")}
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -right-24 top-8 h-[420px] w-[420px] rounded-full bg-emerald-500/[0.06] blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-[320px] w-[320px] rounded-full bg-sky-500/[0.05] blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-0.5 bg-emerald-500/60" />
        </div>

        <div className={cn(r1ShellWide, "relative z-10 w-full py-12 sm:py-14 lg:max-w-7xl lg:py-16")}>
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.95fr)] lg:gap-8 xl:gap-10">
            <div className="relative z-10 max-w-xl lg:pl-6 xl:pl-10 2xl:pl-12">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="text-sm font-medium text-emerald-400/90">{C.company}</p>
                <span className="hidden h-1 w-1 rounded-full bg-white/25 sm:inline-block" aria-hidden />
                <p className="text-xs text-white/45">{C.client}</p>
              </div>

              <span className="mt-5 inline-flex rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white/55">
                {C.hero.eyebrow}
              </span>

              <h1 className="mt-5 text-balance text-3xl font-bold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-[2.5rem] xl:text-[2.7rem]">
                <span className="block">{C.hero.headlineLines[0]}</span>
                <span className="block">{C.hero.headlineLines[1]}</span>
              </h1>

              <p className="mt-4 max-w-md text-base leading-relaxed text-white/68 sm:text-[1.05rem]">
                {C.hero.lead}
              </p>

              <p className="mt-5 border-l-2 border-emerald-500/60 pl-4 text-sm font-medium text-white/75 sm:pl-5">
                {C.hero.strategyLine}
              </p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {C.hero.pillars.map((item) => (
                  <li
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-1.5 text-xs font-medium text-emerald-100/85"
                  >
                    <Check className="h-3 w-3 text-emerald-400/80" strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mt-6 max-w-md text-[13px] leading-relaxed text-white/48">
                {C.hero.footnote}
              </p>

              <a
                href="#partida"
                className="mt-7 inline-flex items-center gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-300 transition-colors hover:bg-emerald-500/15"
              >
                Ver a proposta
                <ArrowDown className="h-3.5 w-3.5" />
              </a>
            </div>

            <figure className="relative mx-auto flex w-full max-w-xl items-center justify-center lg:mx-0 lg:max-w-none">
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/[0.07] blur-3xl"
                aria-hidden
              />
              <img
                src={heroVisual}
                alt="Visualização da estrutura digital Raise One para captação de reservas"
                width={1920}
                height={1080}
                decoding="async"
                fetchPriority="high"
                draggable={false}
                className="relative z-10 h-auto w-full max-h-[min(520px,70vh)] object-contain select-none drop-shadow-[0_28px_60px_rgba(0,0,0,0.45)] lg:max-h-[min(600px,72vh)]"
              />
            </figure>
          </div>
        </div>

        <div className="flex justify-center pb-5 pt-2 text-white/30 lg:pb-6">
          <ArrowDown className="h-4 w-4 animate-bounce text-emerald-400/60" />
        </div>
      </header>

      <nav className="sticky top-16 z-40 border-b border-white/[0.06] bg-[#090909]/95 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <div className="mx-auto flex w-max gap-1 px-4 py-2 sm:px-6">
            {COLONIA_FEM_NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-white/45 transition-colors hover:bg-white/[0.04] hover:text-white/80"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <main>
        <Section id="partida" label="01. O ponto de partida" title={C.diagnosis.headline} icon={Building2}>
          <p className="mb-8 max-w-3xl text-lg leading-relaxed text-white/80 sm:text-xl">
            {C.diagnosis.subheadline}
          </p>
          <ProposalStrengthGrid items={C.diagnosis.strengths} />
          <ul className="mt-8 grid gap-2 sm:grid-cols-2">
            {C.diagnosis.offerItems.map((item, i) => {
              const Icon = OFFER_ICONS[i] ?? Check;
              return (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-3 text-[13px] font-medium text-white/75"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                    <Icon className="h-3.5 w-3.5 text-emerald-400/85" strokeWidth={2} />
                  </span>
                  {item}
                </li>
              );
            })}
          </ul>
          <div className={cn(polishedCard, "mt-8")}>
            <div className="h-1 bg-gradient-to-r from-emerald-500/60 to-transparent" />
            <div className="flex gap-4 p-5 sm:p-6">
              <IconPill icon={Users} className="mt-0.5 bg-emerald-500/10" />
              <div>
                <p className="text-sm leading-relaxed text-white/70">{C.diagnosis.capacityNote}</p>
                <p className="mt-3 text-base font-semibold text-white">{C.diagnosis.closing}</p>
              </div>
            </div>
          </div>
        </Section>

        <Section id="desafio" label="02. O desafio" title={C.challenge.headline} alt icon={Eye}>
          <p className="mb-8 max-w-3xl text-base leading-relaxed text-white/65">{C.challenge.body}</p>

          <div className="grid gap-5 lg:grid-cols-2">
            <article className={polishedCard}>
              <div className="h-1 bg-gradient-to-r from-white/20 to-transparent" />
              <div className="p-5 sm:p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/38">
                  Divulgação atual
                </p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {C.challenge.channels.map((ch) => {
                    const Icon = CHANNEL_ICONS[ch] ?? Megaphone;
                    return (
                      <div
                        key={ch}
                        className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5"
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0 text-white/45" strokeWidth={2} />
                        <span className="text-xs font-medium text-white/65">{ch}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-4 rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2.5 text-xs leading-relaxed text-white/50">
                  {C.challenge.pastAds}
                </p>
              </div>
            </article>

            <article className={cn(polishedCard, "border-emerald-500/15")}>
              <div className="h-1 bg-gradient-to-r from-emerald-500/70 to-transparent" />
              <div className="p-5 sm:p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400/70">
                  {C.challenge.gapTitle}
                </p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {C.challenge.gap.map((item) => {
                    const Icon = GAP_ICONS[item] ?? Sparkles;
                    return (
                      <div
                        key={item}
                        className="flex items-center gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-2.5"
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0 text-emerald-400/85" strokeWidth={2} />
                        <span className="text-xs font-medium text-emerald-100/85">{item}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>
          </div>

          <p className="mt-8 max-w-3xl rounded-xl border border-emerald-500/15 bg-emerald-500/[0.04] px-4 py-3.5 text-base font-semibold leading-relaxed text-white/85">
            {C.challenge.opportunityLine}
          </p>
        </Section>

        <Section
          id="oportunidade"
          label="03. A oportunidade"
          title={C.opportunity.headline}
          icon={Search}
        >
          <p className="mb-8 max-w-3xl text-base leading-relaxed text-white/65">{C.opportunity.lead}</p>
          <div className="mb-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {C.opportunity.keywords.map((kw) => (
              <div
                key={kw}
                className="flex items-center gap-2.5 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.04] px-3.5 py-3"
              >
                <Search className="h-3.5 w-3.5 shrink-0 text-emerald-400/70" strokeWidth={2} />
                <span className="font-mono text-[12px] text-emerald-100/85">{kw}</span>
              </div>
            ))}
          </div>
          <p className="mb-4 max-w-3xl text-sm leading-relaxed text-white/60">{C.opportunity.insight}</p>
          <p className="mb-8 max-w-3xl rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 text-base font-medium text-white/80">
            {C.opportunity.proposal}
          </p>
          <FlowSteps steps={C.opportunity.flow} numbered />
        </Section>

        <Section
          id="solucao"
          label="04. O que vamos construir"
          title="Uma estrutura digital enxuta, pensada para gerar reservas."
          alt
          icon={Sparkles}
        >
          <div className="mb-8 flex flex-wrap gap-2">
            {(["Estruturar", "Apresentar", "Atrair", "Converter"] as const).map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                {i > 0 && <ArrowRight className="h-3.5 w-3.5 text-emerald-400/40" />}
                <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-300/90">
                  {String(i + 1).padStart(2, "0")} · {step}
                </span>
              </div>
            ))}
          </div>
          <ProposalMovementCards movements={C.pillars} />
        </Section>

        <Section
          id="landing"
          label="05. A landing page"
          title={C.landingPage.headline}
          icon={LayoutTemplate}
        >
          <p className="mb-8 max-w-3xl text-base leading-relaxed text-white/65">{C.landingPage.lead}</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {C.landingPage.answers.map((item) => {
              const Icon = ANSWER_ICONS[item.q] ?? Sparkles;
              return (
                <article key={item.q} className={polishedCard}>
                  <div className="h-1 bg-gradient-to-r from-emerald-500/50 to-transparent" />
                  <div className="p-4 sm:p-5">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                        <Icon className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2} />
                      </span>
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-400/70">
                        {item.q}
                      </p>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">{item.a}</p>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="mt-10">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.16em] text-white/38">
              Estrutura prevista
            </p>
            <ol className="relative grid gap-2 sm:grid-cols-2">
              {C.landingPage.structure.map((item, i) => (
                <li
                  key={item.title}
                  className="flex gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 font-mono text-[11px] font-semibold text-emerald-400/80">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white/80">{item.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-white/45">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Section>

        <Section
          id="conteudo"
          label="06. Conteúdo comercial"
          title={C.content.headline}
          alt
          icon={Camera}
        >
          <p className="mb-8 max-w-3xl text-base leading-relaxed text-white/65">{C.content.lead}</p>
          <div className="grid gap-5 lg:grid-cols-2">
            <article className={polishedCard}>
              <div className="h-1 bg-gradient-to-r from-sky-500/60 to-transparent" />
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <IconPill icon={Camera} className="bg-sky-500/10" />
                  <h3 className="text-base font-semibold text-white">{C.content.photoTitle}</h3>
                </div>
                <ul className="mt-5 space-y-2">
                  {C.content.photoAreas.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-white/65">
                      <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400/80" strokeWidth={2.5} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
            <article className={polishedCard}>
              <div className="h-1 bg-gradient-to-r from-violet-500/50 to-transparent" />
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <IconPill icon={Clapperboard} className="bg-violet-500/10" />
                  <h3 className="text-base font-semibold text-white">{C.content.videoTitle}</h3>
                </div>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {C.content.videoFlow.split(" → ").map((part, i, arr) => (
                    <span key={part} className="inline-flex items-center gap-1.5">
                      <span className="rounded-md border border-violet-500/20 bg-violet-500/[0.06] px-2 py-1 text-[11px] text-white/65">
                        {part.replace(/\.$/, "")}
                      </span>
                      {i < arr.length - 1 && (
                        <ArrowRight className="h-3 w-3 text-violet-400/40" />
                      )}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-white/60">{C.content.videoBody}</p>
                <p className="mt-4 text-sm leading-relaxed text-white/55">{C.content.derivatives}</p>
              </div>
            </article>
          </div>
          <p className="mt-8 max-w-3xl rounded-xl border border-emerald-500/15 bg-emerald-500/[0.04] px-4 py-3.5 text-sm font-medium leading-relaxed text-white/75">
            {C.content.closing}
          </p>
        </Section>

        <Section id="aquisicao" label="07. Aquisição" title={C.ads.headline} icon={Megaphone}>
          <p className="mb-8 max-w-3xl text-base leading-relaxed text-white/65">{C.ads.lead}</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {C.ads.fronts.map((front) => {
              const Icon = ADS_ICONS[front.title] ?? Megaphone;
              return (
                <article key={front.title} className={polishedCard}>
                  <div className="h-1 bg-gradient-to-r from-emerald-500/50 to-transparent" />
                  <div className="p-4 sm:p-5">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                        <Icon className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2} />
                      </span>
                      <h4 className="text-sm font-semibold text-white">{front.title}</h4>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-white/55">{front.body}</p>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="mt-8 max-w-3xl rounded-xl border border-emerald-500/15 bg-emerald-500/[0.04] px-4 py-3.5 text-sm font-medium leading-relaxed text-white/75">
            {C.ads.closing}
          </p>

          <div className={cn(polishedCard, "mt-10")}>
            <div className="h-1 bg-gradient-to-r from-amber-500/50 to-transparent" />
            <div className="p-5 sm:p-6 lg:p-7">
              <div className="flex items-center gap-3">
                <IconPill icon={CalendarCheck} className="bg-amber-500/10" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-300/70">
                    Estratégia orientada pela disponibilidade
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-white">{C.availability.headline}</h3>
                </div>
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/60">
                {C.availability.lead}
              </p>
              <p className="mt-2 text-sm text-white/50">{C.availability.body}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {C.availability.rules.map((rule, i) => {
                  const Icon = AVAIL_ICONS[i] ?? Target;
                  return (
                    <div
                      key={rule.when}
                      className="flex gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                    >
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                        <Icon className="h-3.5 w-3.5 text-amber-300/80" strokeWidth={2} />
                      </span>
                      <div>
                        <p className="text-xs text-white/45">{rule.when}</p>
                        <p className="mt-1 text-sm font-medium text-white/80">{rule.then}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-5 text-sm font-medium text-emerald-400/80">{C.availability.closing}</p>
            </div>
          </div>
        </Section>

        <Section
          id="conversao"
          label="08. Do clique à reserva"
          title={C.funnel.headline}
          alt
          icon={MousePointerClick}
        >
          <p className="mb-8 max-w-3xl text-base leading-relaxed text-white/65">{C.funnel.lead}</p>
          <ol className="space-y-0">
            {C.funnel.steps.map((step, i) => {
              const Icon = FUNNEL_ICONS[i] ?? Check;
              const isLast = i === C.funnel.steps.length - 1;
              return (
                <li key={step} className="relative flex gap-4">
                  <div className="flex w-9 shrink-0 flex-col items-center">
                    <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-emerald-500/30 bg-[#0c0c0c] text-emerald-400 shadow-[0_0_0_4px_#0c0c0c]">
                      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                    </span>
                    {!isLast && (
                      <span
                        className="mt-1 w-px flex-1 min-h-[0.75rem] bg-gradient-to-b from-emerald-500/40 to-emerald-500/15"
                        aria-hidden
                      />
                    )}
                  </div>
                  <div
                    className={cn(
                      "min-w-0 flex-1 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3.5",
                      !isLast && "mb-2",
                    )}
                  >
                    <span className="font-mono text-[10px] text-white/30">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm font-medium text-white/80">{step}</p>
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="mt-6 flex gap-3 rounded-xl border border-white/[0.06] bg-white/[0.015] px-4 py-3.5">
            <IconPill icon={Users} />
            <p className="text-sm leading-relaxed text-white/55">{C.funnel.opsNote}</p>
          </div>

          <div className="mt-12">
            <div className="flex items-start gap-3">
              <IconPill icon={Target} />
              <div>
                <p className={r1LabelClass}>Filtrar também é converter</p>
                <h3 className="mt-2 max-w-3xl text-xl font-bold tracking-tight text-white sm:text-2xl">
                  {C.expectations.headline}
                </h3>
              </div>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/60">{C.expectations.lead}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {C.expectations.schedule.map((item) => {
                const Icon = SCHEDULE_ICONS[item.label] ?? Clock3;
                return (
                  <div
                    key={item.label}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4"
                  >
                    <Icon className="h-4 w-4 text-emerald-400/70" strokeWidth={2} />
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/38">
                      {item.label}
                    </p>
                    <p className="mt-1.5 text-sm font-semibold text-white">{item.value}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {C.expectations.rules.map((rule) => (
                <span
                  key={rule}
                  className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/50"
                >
                  {rule}
                </span>
              ))}
            </div>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-white/55">
              {C.expectations.closing}
            </p>
          </div>
        </Section>

        <Section id="medicao" label="09. Medição" title={C.metrics.headline} icon={LineChart}>
          <ProposalMetricsCards
            categories={[
              { title: "Aquisição", items: C.metrics.acquisition },
              { title: "Interesse", items: C.metrics.interest },
              { title: "Comercial", items: C.metrics.commercial },
              { title: "Negócio", items: C.metrics.result },
            ]}
            note={C.metrics.note}
          />
          <div className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/38">
              {C.metrics.businessLabel}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {C.metrics.businessLine.split(" → ").map((part, i, arr) => (
                <span key={part} className="inline-flex items-center gap-2">
                  <span className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-1.5 text-xs font-semibold text-white/80">
                    {part}
                  </span>
                  {i < arr.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-emerald-400/40" />}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/55">{C.metrics.optimization}</p>
          </div>
        </Section>

        <Section id="projeto" label="10. O projeto" title="O que está incluído" alt icon={FileCheck2}>
          <ProposalDeliverableGrid blocks={C.project} />
          <div className="mt-12">
            <div className="flex items-start gap-3">
              <IconPill icon={Sparkles} />
              <div>
                <p className={r1LabelClass}>Modelo de trabalho</p>
                <h3 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Começamos enxutos. Evoluímos conforme os resultados.
                </h3>
              </div>
            </div>
            <div className="mt-8">
              <ProposalRoadmapTimeline phases={C.roadmap} />
            </div>
            <ProposalExpansionCard
              number={C.expansion.number}
              title={C.expansion.title}
              subtitle={C.expansion.subtitle}
              items={C.expansion.items}
            />
          </div>
        </Section>

        <Section
          id="investimento"
          label="11. Investimento"
          title={inv.title}
          icon={CircleDollarSign}
        >
          <p className="mb-8 max-w-3xl text-base leading-relaxed text-white/65">{inv.intro}</p>

          {/* Condição especial UNIP */}
          <div className="overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/[0.12] via-white/[0.03] to-transparent">
            <div className="h-1 bg-gradient-to-r from-emerald-500/80 to-emerald-500/20" />
            <div className="p-5 sm:p-6 lg:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400/80">
                {inv.specialCondition.eyebrow}
              </p>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/65 sm:text-[15px]">
                {inv.specialCondition.body}
              </p>

              <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/40">
                    {inv.specialCondition.originalLabel}
                  </p>
                  <p className="mt-1 text-2xl font-bold tracking-tight text-white/35 line-through decoration-white/30 sm:text-3xl">
                    {inv.specialCondition.originalAmount}
                  </p>
                </div>

                <div className="hidden sm:flex sm:items-center sm:pb-2" aria-hidden>
                  <ArrowRight className="h-5 w-5 text-emerald-400/70" />
                </div>

                <div className="min-w-0 flex-1 sm:text-right">
                  <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-emerald-400/70">
                    {inv.specialCondition.offerLabel}
                  </p>
                  <p className="mt-1 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                    {inv.specialCondition.offerAmount}
                  </p>
                  <p className="mt-1.5 text-sm text-white/50">{inv.specialCondition.paymentNote}</p>
                </div>
              </div>

              <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-2">
                <Gift className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2.5} />
                <span className="text-xs font-semibold text-emerald-200/90">
                  {inv.specialCondition.badge}
                </span>
              </div>
            </div>
          </div>

          {/* 01 Implantação */}
          <div className={cn(polishedCard, "mt-6")}>
            <div className="h-1 bg-emerald-500/60" />
            <div className="p-5 sm:p-6 lg:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
                    {inv.implementation.code} · Implantação
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-white">{inv.implementation.title}</h3>
                  <p className="mt-2 text-sm text-white/55">{inv.implementation.lead}</p>
                </div>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.08] px-4 py-3 text-right">
                  <p className="text-lg font-bold tracking-tight text-white sm:text-xl">
                    {inv.implementation.priceLine}
                  </p>
                </div>
              </div>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {implTier.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-[13px] font-medium text-white/75"
                  >
                    <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400/85" strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 02 + 03 */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
              <div className="h-1 bg-amber-500/50" />
              <div className="flex h-full flex-col p-5 sm:p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
                  {inv.management.code} · Gestão
                </p>
                <h3 className="mt-1 text-lg font-bold text-white">{inv.management.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{inv.management.lead}</p>

                <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3.5">
                  <p className="text-2xl font-bold tracking-tight text-white">{inv.management.priceLine}</p>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-md border border-amber-500/25 bg-amber-500/10 px-2.5 py-1.5">
                    <Gift className="h-3 w-3 text-amber-300/90" strokeWidth={2.5} />
                    <span className="text-xs font-semibold text-amber-100/90">
                      {inv.management.firstCycleBadge}
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-white/45">
                    {inv.management.firstCycleNote}
                  </p>
                </div>

                <ul className="mt-5 space-y-2">
                  {mgmtTier.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-[13px] font-medium leading-snug text-white/70"
                    >
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400/70" strokeWidth={2.5} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
              <div className="h-1 bg-sky-500/50" />
              <div className="flex h-full flex-col p-5 sm:p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
                  {inv.media.code} · Mídia
                </p>
                <h3 className="mt-1 text-lg font-bold text-white">{inv.media.title}</h3>

                <div className="mt-5 rounded-xl border border-sky-500/20 bg-sky-500/[0.06] px-4 py-3.5">
                  <p className="text-2xl font-bold tracking-tight text-white">{inv.media.dailyAmount}</p>
                  <p className="mt-1 text-sm font-semibold text-sky-300/90">{inv.media.monthlyApprox}</p>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-white/55">{inv.media.lead}</p>
                <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-400/70">
                  {inv.media.recommendLabel}
                </p>
                <ul className="mt-3 space-y-2">
                  {mediaTier.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-[13px] font-medium leading-snug text-white/70"
                    >
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-400/70" strokeWidth={2.5} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Resumo */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04]">
            <div className="h-1 bg-emerald-500/60" />
            <div className="p-5 sm:p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400/70">
                {inv.summary.title}
              </p>
              <dl className="mt-4 space-y-3">
                {inv.summary.rows.map((row) => (
                  <div
                    key={row.label}
                    className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/[0.06] pb-3 last:border-0 last:pb-0"
                  >
                    <dt className="text-sm text-white/55">{row.label}</dt>
                    <dd
                      className={cn(
                        "shrink-0 text-sm font-semibold",
                        row.value === "R$ 0" ? "text-emerald-400" : "text-white/90",
                      )}
                    >
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-4 sm:px-6">
            <p className="text-sm font-semibold text-white/85">{inv.leanTitle}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-white/55">{inv.leanBody}</p>
            <p className="mt-3 text-xs leading-relaxed text-white/40">{inv.footer}</p>
          </div>
        </Section>

        <Section
          id="escopo"
          label="12. Escopo"
          title="O que não está incluído neste momento"
          alt
          icon={Target}
        >
          <ProposalExclusionsPanel wont={C.exclusions.wont} will={C.exclusions.will} />
        </Section>

        <Section
          id="visao"
          label="13. Por que a Raise One"
          title={C.whyRaiseOne.headline}
          icon={Handshake}
        >
          <p className="mb-8 max-w-3xl text-base leading-relaxed text-white/65">{C.whyRaiseOne.lead}</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {C.whyRaiseOne.pillars.map((p) => {
              const Icon = WHY_ICONS[p.title] ?? Sparkles;
              return (
                <div
                  key={p.title}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
                    <Icon className="h-4 w-4 text-emerald-400" strokeWidth={2} />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-white">{p.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/55">{p.body}</p>
                </div>
              );
            })}
          </div>

          <div className={cn(polishedCard, "mt-12")}>
            <div className="h-1 bg-gradient-to-r from-emerald-500/70 to-transparent" />
            <div className="p-5 sm:p-6 lg:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400/70">
                Resultado esperado
              </p>
              <h3 className="mt-2 text-xl font-bold text-white">{C.outcome.headline}</h3>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-white/70">{C.outcome.body}</p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {C.outcome.via.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.05] px-3 py-2 text-xs font-medium text-white/70"
                  >
                    <Check className="h-3 w-3 shrink-0 text-emerald-400/80" strokeWidth={2.5} />
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-5 text-xs text-white/40">{C.outcome.caution}</p>
            </div>
          </div>
        </Section>

        <Section
          id="proximos-passos"
          label="14. Próximos passos"
          title="Se fizermos sentido para a Colônia FEM"
          alt
          icon={FileCheck2}
        >
          <ol className="space-y-0">
            {C.nextSteps.map((step, index) => {
              const isLast = index === C.nextSteps.length - 1;
              return (
                <li key={step.title} className="relative flex gap-4">
                  <div className="flex w-9 shrink-0 flex-col items-center">
                    <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-emerald-500/30 bg-[#0c0c0c] text-sm font-bold text-emerald-400 shadow-[0_0_0_4px_#0c0c0c]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {!isLast && (
                      <span
                        className="mt-1 w-px flex-1 min-h-[0.75rem] bg-gradient-to-b from-emerald-500/40 to-emerald-500/15"
                        aria-hidden
                      />
                    )}
                  </div>
                  <div
                    className={cn(
                      "min-w-0 flex-1 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3.5 transition-colors hover:border-white/12 hover:bg-white/[0.03]",
                      !isLast && "mb-2",
                    )}
                  >
                    <p className="text-sm font-medium text-white/85">{step.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-white/50">{step.detail}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </Section>

        <section className={cn(r1ScrollAnchor, r1SectionPy, "border-b border-white/[0.06]")}>
          <div className={cn(r1Shell, "max-w-4xl text-center")}>
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
              <Sparkles className="h-5 w-5 text-emerald-400" strokeWidth={2} />
            </div>
            <h2 className="mx-auto max-w-3xl text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {C.closing.title}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/65">
              {C.closing.body}
            </p>

            <OperationFlowDiagram label={C.closing.flowLabel} steps={C.closing.flowSteps} />

            <p className="mt-10 text-sm font-medium text-emerald-400/80">{C.closing.brandLine}</p>
          </div>
        </section>
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
            {C.company} e Raise One Soluções
          </p>
        </div>
      </footer>
    </div>
  );
}

export function isColoniaFemReferenceProposal(proposal: Proposal): boolean {
  const slug = proposal.slug.toLowerCase();
  const company = proposal.company_name.toLowerCase();

  return (
    slug === "colonia-fem" ||
    slug === "colonia-fem-pousada" ||
    company.includes("colônia fem") ||
    company.includes("colonia fem") ||
    company.includes("pousada fem") ||
    company.includes("colônia de férias fem") ||
    company.includes("colonia de ferias fem")
  );
}
