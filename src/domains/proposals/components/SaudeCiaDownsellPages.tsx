import type { Proposal } from "../types";
import { R1ProposalNav } from "../shell/R1ProposalNav";
import { R1ScrollProgress } from "../shell/R1ScrollProgress";
import {
  r1LabelClass,
  r1ScrollAnchor,
  r1Shell,
  r1ShellWide,
  r1SectionPy,
} from "../shell/r1-tokens";
import {
  SAUDE_CIA_CONTENT_PLAN,
  SAUDE_CIA_CONTENT_PLAN_NAV,
} from "../reference/saude-cia-content-plan";
import {
  SAUDE_CIA_ACQUISITION_PLAN,
  SAUDE_CIA_ACQUISITION_PLAN_NAV,
} from "../reference/saude-cia-acquisition-plan";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowRight,
  Ban,
  Check,
  Megaphone,
  Play,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

type PlanAccent = "content" | "acquisition";

const ACCENT: Record<
  PlanAccent,
  {
    orb: string;
    bar: string;
    badge: string;
    glow: string;
    soft: string;
    text: string;
    icon: LucideIcon;
  }
> = {
  content: {
    orb: "bg-violet-500/[0.10]",
    bar: "from-violet-500/80 to-violet-500/15",
    badge: "border-violet-500/25 bg-violet-500/10 text-violet-300",
    glow: "border-violet-500/25 bg-violet-500/[0.07]",
    soft: "border-violet-500/15 bg-violet-500/[0.04]",
    text: "text-violet-400",
    icon: Play,
  },
  acquisition: {
    orb: "bg-sky-500/[0.10]",
    bar: "from-sky-500/80 to-sky-500/15",
    badge: "border-sky-500/25 bg-sky-500/10 text-sky-300",
    glow: "border-sky-500/25 bg-sky-500/[0.07]",
    soft: "border-sky-500/15 bg-sky-500/[0.04]",
    text: "text-sky-400",
    icon: Megaphone,
  },
};

const card =
  "overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] shadow-[0_8px_32px_rgba(0,0,0,0.35)]";

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

function FlowSteps({
  steps,
  accent,
}: {
  steps: readonly string[];
  accent: PlanAccent;
}) {
  const a = ACCENT[accent];
  return (
    <div className={cn(card, "mt-8")}>
      <div className={cn("h-1 bg-gradient-to-r", a.bar)} />
      <ol className="grid gap-0 sm:grid-cols-5">
        {steps.map((step, i) => (
          <li
            key={step}
            className={cn(
              "relative flex flex-col gap-3 p-4 sm:p-5",
              i < steps.length - 1 && "border-b border-white/[0.06] sm:border-b-0 sm:border-r",
            )}
          >
            <span className={cn("font-mono text-xs font-bold", a.text)}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-sm font-semibold leading-snug text-white">{step}</span>
            {i < steps.length - 1 && (
              <ArrowRight
                className={cn(
                  "absolute right-2 top-1/2 hidden h-3.5 w-3.5 -translate-y-1/2 translate-x-1/2 sm:block",
                  a.text,
                  "opacity-40",
                )}
              />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

function IncludedList({
  title,
  items,
  accent,
}: {
  title: string;
  items: readonly string[];
  accent: PlanAccent;
}) {
  const a = ACCENT[accent];
  const Icon = a.icon;
  return (
    <article className={card}>
      <div className={cn("h-1 bg-gradient-to-r", a.bar)} />
      <div className="p-5 sm:p-6 lg:p-8">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border",
              a.glow,
            )}
          >
            <Icon className={cn("h-5 w-5", a.text)} strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white sm:text-xl">{title}</h3>
            <p className="mt-1 text-xs text-white/40">{items.length} entregas neste plano</p>
          </div>
        </div>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-3 text-[13px] font-medium leading-snug text-white/75 transition-colors hover:border-white/10 hover:bg-white/[0.05]"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-500/15">
                <Check className="h-3 w-3 text-emerald-400" strokeWidth={3} />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function ScopeBlock({
  r1Role,
  clientRole,
  clientItems,
  note,
  accent,
}: {
  r1Role: string;
  clientRole: string;
  clientItems: readonly string[];
  note: string;
  accent: PlanAccent;
}) {
  const a = ACCENT[accent];
  return (
    <div className="space-y-5">
      <div className={cn("rounded-2xl border px-5 py-4", a.soft)}>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
          Raise One
        </p>
        <p className="mt-2 text-sm leading-relaxed text-white/75 sm:text-base">{r1Role}</p>
      </div>

      <article className={card}>
        <div className="h-1 bg-gradient-to-r from-white/20 to-transparent" />
        <div className="p-5 sm:p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">
            Saúde & Cia
          </p>
          <p className="mt-2 text-sm font-medium text-white/80">{clientRole}</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {clientItems.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-[13px] text-white/70"
              >
                <Check className="h-3.5 w-3.5 shrink-0 text-white/35" strokeWidth={2.5} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </article>

      <div className="flex gap-3 rounded-xl border border-red-500/15 bg-red-500/[0.04] px-4 py-3.5">
        <Ban className="mt-0.5 h-4 w-4 shrink-0 text-red-400/70" />
        <p className="text-sm leading-relaxed text-white/60">{note}</p>
      </div>
    </div>
  );
}

function PriceCard({
  planLabel,
  amount,
  highlights,
  note,
  accent,
  ctaHref,
  ctaLabel,
}: {
  planLabel: string;
  amount: string;
  highlights: readonly string[];
  note: string;
  accent: PlanAccent;
  ctaHref?: string | null;
  ctaLabel?: string;
}) {
  const a = ACCENT[accent];
  return (
    <article
      className={cn(
        "overflow-hidden rounded-2xl border shadow-[0_8px_32px_rgba(0,0,0,0.35)]",
        accent === "content" ? "border-violet-500/20" : "border-sky-500/20",
        "bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent",
      )}
    >
      <div className={cn("h-1 bg-gradient-to-r", a.bar)} />
      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8 lg:p-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
            {planLabel}
          </p>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {highlights.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5 text-[13px] font-medium text-white/75"
              >
                <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400/80" strokeWidth={3} />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/55">{note}</p>
        </div>

        <div
          className={cn(
            "flex flex-col justify-between rounded-2xl border px-5 py-5",
            a.glow,
          )}
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
              Mensalidade
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {amount}
            </p>
          </div>
          {ctaHref && ctaLabel && (
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function ClosingBlock({
  body,
  upgrade,
  ctaHref,
  ctaLabel,
  accent,
}: {
  body: string;
  upgrade: string;
  ctaHref: string | null;
  ctaLabel: string;
  accent: PlanAccent;
}) {
  const a = ACCENT[accent];
  return (
    <div className="space-y-5">
      <p className="max-w-3xl text-base leading-relaxed text-white/70 sm:text-lg">{body}</p>
      <div className={cn("rounded-2xl border px-5 py-4", a.soft)}>
        <p className="text-sm leading-relaxed text-white/65">{upgrade}</p>
      </div>
      {ctaHref && (
        <a
          href={ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-medium text-black transition-opacity hover:opacity-90"
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}

function PlanShell({
  company,
  client,
  nav,
  ctaHref,
  ctaLabel,
  hero,
  accent,
  children,
}: {
  company: string;
  client: string;
  nav: readonly { id: string; label: string }[];
  ctaHref: string | null;
  ctaLabel: string;
  hero: {
    eyebrow: string;
    headline: string;
    lead: string;
    price: string;
    priceNote: string;
  };
  accent: PlanAccent;
  children: ReactNode;
}) {
  const a = ACCENT[accent];

  return (
    <div className="min-h-screen bg-[#090909] text-white antialiased">
      <R1ScrollProgress />
      <R1ProposalNav ctaHref={ctaHref} ctaLabel={ctaLabel} />

      <header
        id="top"
        className={cn(
          r1ScrollAnchor,
          "relative flex min-h-[82vh] items-center overflow-hidden border-b border-white/[0.06]",
        )}
      >
        <div className="pointer-events-none absolute inset-0">
          <div
            className={cn(
              "absolute -right-24 top-0 h-[480px] w-[480px] rounded-full blur-3xl",
              a.orb,
            )}
          />
          <div className="absolute -left-20 bottom-0 h-[340px] w-[340px] rounded-full bg-emerald-500/[0.06] blur-3xl" />
          <div className={cn("absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r", a.bar)} />
        </div>

        <div className={cn(r1ShellWide, "relative z-10 py-16 sm:py-20")}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className={cn("text-sm font-medium", a.text)}>{company}</p>
              <p className="mt-1 text-xs text-white/40">{client}</p>
            </div>
          </div>

          <span
            className={cn(
              "mt-7 inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]",
              a.badge,
            )}
          >
            {hero.eyebrow}
          </span>

          <h1 className="mt-7 max-w-3xl text-balance text-3xl font-bold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
            {hero.headline}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
            {hero.lead}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div
              className={cn(
                "inline-flex flex-col justify-center rounded-xl border px-4 py-3",
                a.glow,
              )}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">
                Investimento
              </p>
              <p className="mt-0.5 text-xl font-bold tracking-tight text-white sm:text-2xl">
                {hero.price}
              </p>
              <p className="mt-0.5 text-[11px] text-white/45">{hero.priceNote}</p>
            </div>

            {ctaHref && (
              <a
                href={ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-[52px] items-center gap-2 rounded-xl bg-white px-5 text-sm font-medium text-black transition-opacity hover:opacity-90"
              >
                {ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/30">
          <ArrowDown className={cn("h-4 w-4 animate-bounce", a.text, "opacity-70")} />
        </div>
      </header>

      <nav className="sticky top-16 z-40 border-b border-white/[0.06] bg-[#090909]/95 backdrop-blur-xl">
        <div className={cn(r1ShellWide, "flex gap-1 overflow-x-auto py-2")}>
          {nav.map((item) => (
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

      <main>{children}</main>

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
              {ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </a>
          )}
          <p className="mt-8 text-[11px] text-white/30">
            {company} × Raise One Soluções
          </p>
        </div>
      </footer>
    </div>
  );
}

export function SaudeCiaContentPlanPage({ proposal }: { proposal: Proposal }) {
  const C = SAUDE_CIA_CONTENT_PLAN;
  const ctaHref = buildWhatsAppUrl(C.hero.ctaMessage, proposal.content?.cta?.whatsappPhone);
  const accent: PlanAccent = "content";

  return (
    <PlanShell
      company={C.company}
      client={C.client}
      nav={SAUDE_CIA_CONTENT_PLAN_NAV}
      ctaHref={ctaHref}
      ctaLabel={C.hero.ctaLabel}
      hero={C.hero}
      accent={accent}
    >
      <Section id="construir" label="01. O que vamos construir" title={C.build.title}>
        <p className="max-w-3xl text-base leading-relaxed text-white/65 sm:text-lg">{C.build.lead}</p>
        <FlowSteps steps={C.build.flow} accent={accent} />
      </Section>

      <Section id="incluido" label="02. Conteúdo mensal" title={C.included.title} alt>
        <IncludedList title={C.included.packageTitle} items={C.included.items} accent={accent} />
      </Section>

      <Section id="escopo" label="03. Escopo" title={C.exclusions.title}>
        <ScopeBlock
          r1Role={C.exclusions.r1Role}
          clientRole={C.exclusions.clientRole}
          clientItems={C.exclusions.clientItems}
          note={C.exclusions.note}
          accent={accent}
        />
      </Section>

      <Section id="investimento" label="04. Investimento" title={C.investment.title} alt>
        <PriceCard
          planLabel={C.investment.planLabel}
          amount={C.investment.amount}
          highlights={C.investment.highlights}
          note={C.investment.note}
          accent={accent}
          ctaHref={ctaHref}
          ctaLabel={C.hero.ctaLabel}
        />
      </Section>

      <Section id="proximos-passos" label="05. Próximos passos" title={C.closing.title}>
        <ClosingBlock
          body={C.closing.body}
          upgrade={C.closing.upgrade}
          ctaHref={ctaHref}
          ctaLabel={C.closing.ctaLabel}
          accent={accent}
        />
      </Section>
    </PlanShell>
  );
}

export function SaudeCiaAcquisitionPlanPage({ proposal }: { proposal: Proposal }) {
  const C = SAUDE_CIA_ACQUISITION_PLAN;
  const ctaHref = buildWhatsAppUrl(C.hero.ctaMessage, proposal.content?.cta?.whatsappPhone);
  const accent: PlanAccent = "acquisition";

  return (
    <PlanShell
      company={C.company}
      client={C.client}
      nav={SAUDE_CIA_ACQUISITION_PLAN_NAV}
      ctaHref={ctaHref}
      ctaLabel={C.hero.ctaLabel}
      hero={C.hero}
      accent={accent}
    >
      <Section id="contexto" label="01. Contexto" title={C.context.title}>
        <p className="max-w-3xl text-base leading-relaxed text-white/65 sm:text-lg">{C.context.lead}</p>
        <FlowSteps steps={C.context.flow} accent={accent} />
      </Section>

      <Section id="incluso" label="02. Gestão" title={C.included.title} alt>
        <IncludedList title={C.included.packageTitle} items={C.included.items} accent={accent} />
      </Section>

      <Section id="escopo" label="03. Escopo" title={C.exclusions.title}>
        <ScopeBlock
          r1Role={C.exclusions.r1Role}
          clientRole={C.exclusions.clientRole}
          clientItems={C.exclusions.clientItems}
          note={C.exclusions.note}
          accent={accent}
        />
      </Section>

      <Section id="midia" label="04. Mídia" title={C.media.title} alt>
        <article className={card}>
          <div className="h-1 bg-gradient-to-r from-sky-500/70 to-sky-500/10" />
          <div className="p-5 sm:p-6 lg:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sky-400/70">
              Pago direto ao Google
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {C.media.amount}
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55">{C.media.note}</p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-400/70">
                  {C.media.firstMonthTotalLabel}
                </p>
                <p className="mt-2 text-2xl font-bold text-white">{C.media.firstMonthTotal}</p>
                <p className="mt-1 text-xs text-white/45">{C.media.firstMonthBreakdown}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">
                  {C.media.ongoingLabel}
                </p>
                <p className="mt-2 text-2xl font-bold text-white">{C.media.ongoingValue}</p>
              </div>
            </div>
          </div>
        </article>
      </Section>

      <Section id="metricas" label="05. Mensuração" title={C.metrics.title}>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {C.metrics.items.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-3 text-sm font-medium text-white/75 transition-colors hover:border-white/10"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400/80" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl rounded-xl border border-white/[0.06] bg-white/[0.015] px-4 py-3.5 text-sm leading-relaxed text-white/45">
          {C.metrics.note}
        </p>
      </Section>

      <Section id="investimento" label="06. Investimento" title={C.investment.title} alt>
        <PriceCard
          planLabel={C.investment.planLabel}
          amount={C.investment.amount}
          highlights={C.investment.highlights}
          note={C.investment.note}
          accent={accent}
          ctaHref={ctaHref}
          ctaLabel={C.hero.ctaLabel}
        />
      </Section>

      <Section id="proximos-passos" label="07. Próximos passos" title={C.closing.title}>
        <ClosingBlock
          body={C.closing.body}
          upgrade={C.closing.upgrade}
          ctaHref={ctaHref}
          ctaLabel={C.closing.ctaLabel}
          accent={accent}
        />
      </Section>
    </PlanShell>
  );
}
