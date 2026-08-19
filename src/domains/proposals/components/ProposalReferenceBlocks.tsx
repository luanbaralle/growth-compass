import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Award,
  Ban,
  BarChart3,
  Building2,
  Calendar,
  Check,
  GitBranch,
  Layers,
  LayoutGrid,
  Megaphone,
  RefreshCw,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export const polishedCard =
  "overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] shadow-[0_8px_32px_rgba(0,0,0,0.35)]";

function TopBar({ gradient }: { gradient: string }) {
  return <div className={cn("h-1 bg-gradient-to-r", gradient)} />;
}

function IconBox({
  icon: Icon,
  glow,
  accent,
}: {
  icon: LucideIcon;
  glow: string;
  accent: string;
}) {
  return (
    <div
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10",
        glow,
      )}
    >
      <Icon className={cn("h-4 w-4", accent)} strokeWidth={2} />
    </div>
  );
}

function ListChip({
  children,
  icon: Icon = Check,
  tone = "default",
}: {
  children: ReactNode;
  icon?: LucideIcon;
  tone?: "default" | "danger";
}) {
  return (
    <li
      className={cn(
        "flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-[13px] font-medium leading-snug",
        tone === "danger"
          ? "border-red-500/10 bg-red-500/[0.04] text-white/65"
          : "border-white/[0.06] bg-white/[0.03] text-white/75",
      )}
    >
      <span
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
          tone === "danger" ? "bg-red-500/10" : "bg-white/[0.04]",
        )}
      >
        <Icon
          className={cn("h-3 w-3", tone === "danger" ? "text-red-400/80" : "text-emerald-400/80")}
          strokeWidth={2.5}
        />
      </span>
      {children}
    </li>
  );
}

const DISCOVERY_ICONS = [Calendar, Layers, GitBranch, LayoutGrid] as const;
const DISCOVERY_GRADIENTS = [
  "from-emerald-500/80 to-emerald-500/10",
  "from-sky-500/70 to-sky-500/10",
  "from-violet-500/60 to-violet-500/10",
  "from-amber-500/60 to-amber-500/10",
] as const;

export function ProposalDiscoveryGrid({
  items,
}: {
  items: readonly { title: string; body: string }[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item, i) => {
        const Icon = DISCOVERY_ICONS[i] ?? Sparkles;
        return (
          <article key={item.title} className={polishedCard}>
            <TopBar gradient={DISCOVERY_GRADIENTS[i] ?? DISCOVERY_GRADIENTS[0]} />
            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <IconBox icon={Icon} glow="bg-emerald-500/10" accent="text-emerald-400" />
                <div>
                  <span className="font-mono text-[10px] font-semibold text-white/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-0.5 text-base font-semibold text-white">{item.title}</h3>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/55">{item.body}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

const STRENGTH_ICONS: Record<string, LucideIcon> = {
  Autoridade: Award,
  Oferta: Layers,
  Diferenciais: Shield,
  "Presença local": Building2,
};

export function ProposalStrengthGrid({
  items,
}: {
  items: readonly { label: string; value: string }[];
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = STRENGTH_ICONS[item.label] ?? Target;
        return (
          <div
            key={item.label}
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 transition-colors hover:border-white/12"
          >
            <Icon className="h-4 w-4 text-emerald-400/70" strokeWidth={2} />
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/38">
              {item.label}
            </p>
            <p className="mt-1.5 text-sm font-semibold leading-snug text-white">{item.value}</p>
          </div>
        );
      })}
    </div>
  );
}

export function ProposalInsightCallout({
  eyebrow,
  highlight,
  body,
}: {
  eyebrow: string;
  highlight: string;
  body: string;
}) {
  return (
    <div className={cn(polishedCard, "mt-8")}>
      <TopBar gradient="from-emerald-500/60 to-transparent" />
      <div className="p-5 sm:p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/38">{eyebrow}</p>
        <p className="mt-2 inline-flex rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-1.5 font-mono text-sm text-emerald-400/90">
          {highlight}
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60">{body}</p>
      </div>
    </div>
  );
}

function FunnelColumn({
  label,
  steps,
  variant,
  footer,
}: {
  label: string;
  steps: readonly string[];
  variant: "muted" | "highlight";
  footer?: ReactNode;
}) {
  const isHighlight = variant === "highlight";
  return (
    <article
      className={cn(
        polishedCard,
        isHighlight && "border-emerald-500/15",
      )}
    >
      <TopBar
        gradient={
          isHighlight ? "from-emerald-500/80 to-sky-500/20" : "from-white/20 to-transparent"
        }
      />
      <div className="p-5 sm:p-6">
        <p
          className={cn(
            "text-[10px] font-bold uppercase tracking-[0.18em]",
            isHighlight ? "text-emerald-400/80" : "text-white/38",
          )}
        >
          {label}
        </p>
        <ol className="mt-5 space-y-2">
          {steps.map((step, i) => (
            <li key={step} className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                  isHighlight
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-white/[0.06] text-white/40",
                )}
              >
                {i + 1}
              </span>
              <span className="text-sm font-medium text-white/75">{step}</span>
            </li>
          ))}
        </ol>
        {footer}
      </div>
    </article>
  );
}

export function ProposalFunnelCompare({
  today,
  target,
  lacks,
  targetCaption,
}: {
  today: { label: string; steps: readonly string[] };
  target: { label: string; steps: readonly string[] };
  lacks: readonly string[];
  targetCaption?: string;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <FunnelColumn
        label={today.label}
        steps={today.steps}
        variant="muted"
        footer={
          <div className="mt-6 border-t border-white/[0.06] pt-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/32">
              Pouco controle sobre
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {lacks.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/45"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        }
      />
      <FunnelColumn
        label={target.label}
        steps={target.steps}
        variant="highlight"
        footer={
          targetCaption ? (
            <p className="mt-4 text-xs leading-relaxed text-white/45">{targetCaption}</p>
          ) : null
        }
      />
    </div>
  );
}

export function ProposalMovementCards({
  movements,
}: {
  movements: readonly {
    number: string;
    title: string;
    subtitle: string;
    objective: string;
    items: readonly string[];
    conditional?: boolean;
  }[];
}) {
  return (
    <div className="space-y-5">
      {movements.map((mov) => (
        <article
          key={mov.number}
          className={cn(
            polishedCard,
            mov.conditional && "border-amber-500/15",
          )}
        >
          <TopBar
            gradient={
              mov.conditional
                ? "from-amber-500/60 to-amber-500/10"
                : "from-emerald-500/70 to-emerald-500/10"
            }
          />
          <div className="p-5 sm:p-6 lg:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-4">
                <span className="font-mono text-3xl font-bold leading-none text-emerald-400/80">
                  {mov.number}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-white sm:text-xl">{mov.title}</h3>
                  <p className="mt-1 text-sm text-white/50">{mov.subtitle}</p>
                </div>
              </div>
              {mov.conditional && (
                <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-300/90">
                  Após validação
                </span>
              )}
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/65">{mov.objective}</p>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {mov.items.map((item) => (
                <ListChip key={item}>{item}</ListChip>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </div>
  );
}

const INSIGHT_ICONS = [LayoutGrid, Workflow, Users, Megaphone] as const;

export function ProposalInsightGrid({
  items,
}: {
  items: readonly { title: string; body: string; extra?: ReactNode }[];
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {items.map((item, i) => {
        const Icon = INSIGHT_ICONS[i] ?? Sparkles;
        return (
          <div key={item.title} className={cn(polishedCard, "h-full")}>
            <TopBar gradient="from-white/15 to-transparent" />
            <div className="p-5">
              <IconBox icon={Icon} glow="bg-white/[0.04]" accent="text-white/60" />
              <h4 className="mt-3 text-sm font-semibold text-white">{item.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{item.body}</p>
              {item.extra}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ProposalExclusionsPanel({
  wont,
  will,
}: {
  wont: readonly string[];
  will: string;
}) {
  return (
    <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_280px]">
      <article className={polishedCard}>
        <TopBar gradient="from-red-500/40 to-transparent" />
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Ban className="h-4 w-4 text-red-400/70" strokeWidth={2} />
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
              O que não vamos fazer
            </p>
          </div>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {wont.map((item) => (
              <ListChip key={item} icon={X} tone="danger">
                {item}
              </ListChip>
            ))}
          </ul>
        </div>
      </article>
      <article className={cn(polishedCard, "flex items-center")}>
        <TopBar gradient="from-emerald-500/80 to-emerald-500/10" />
        <div className="flex flex-1 flex-col justify-center p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-emerald-400/80" strokeWidth={2} />
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400/70">
              Nossa abordagem
            </p>
          </div>
          <p className="mt-4 text-base font-semibold leading-snug text-white sm:text-lg">{will}</p>
        </div>
      </article>
    </div>
  );
}

const ROADMAP_GRADIENTS = [
  "from-emerald-500/70 to-emerald-500/10",
  "from-sky-500/60 to-sky-500/10",
  "from-violet-500/50 to-violet-500/10",
  "from-amber-500/50 to-amber-500/10",
] as const;

export function ProposalRoadmapTimeline({
  phases,
  caption,
}: {
  phases: readonly { period: string; title: string; items: readonly string[] }[];
  caption?: string;
}) {
  return (
    <div>
      {caption && <p className="mb-6 text-sm text-white/50">{caption}</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {phases.map((phase, i) => (
          <article key={phase.period} className={cn(polishedCard, "relative h-full")}>
            <TopBar gradient={ROADMAP_GRADIENTS[i] ?? ROADMAP_GRADIENTS[0]} />
            <div className="p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/32">
                {phase.period}
              </p>
              <h4 className="mt-2 text-base font-semibold text-white">{phase.title}</h4>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {phase.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-[11px] text-white/50"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {i < phases.length - 1 && (
              <ArrowRight
                className="absolute -right-3 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 text-white/15 lg:block"
                aria-hidden
              />
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

const DELIVERABLE_ICONS: Record<string, LucideIcon> = {
  Estratégia: Target,
  Infraestrutura: BarChart3,
  Aquisição: Megaphone,
  Comercial: Users,
};

export function ProposalDeliverableGrid({
  blocks,
}: {
  blocks: readonly { title: string; items: readonly string[] }[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {blocks.map((block) => {
        const Icon = DELIVERABLE_ICONS[block.title] ?? Zap;
        return (
          <article key={block.title} className={polishedCard}>
            <TopBar gradient="from-emerald-500/50 to-transparent" />
            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <IconBox icon={Icon} glow="bg-emerald-500/10" accent="text-emerald-400" />
                <h4 className="text-base font-semibold text-white">{block.title}</h4>
                <span className="ml-auto font-mono text-[10px] text-white/30">{block.items.length}</span>
              </div>
              <ul className="mt-4 space-y-2">
                {block.items.map((item) => (
                  <ListChip key={item}>{item}</ListChip>
                ))}
              </ul>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function ProposalVisionFlow({
  today,
  next,
  future,
  closing,
}: {
  today: string;
  next: string;
  future: string;
  closing: readonly string[];
}) {
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/35">Hoje</p>
          <p className="mt-1 text-sm font-medium text-white/55">{today}</p>
        </div>
        <ArrowRight className="mx-auto hidden h-5 w-5 text-emerald-400/50 sm:block" />
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/60">
            Próxima etapa
          </p>
          <p className="mt-1 text-sm font-medium text-white/80">{next}</p>
        </div>
      </div>
      <p className="mt-4 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white/45">
        Futuro: {future}
      </p>
      <blockquote className="mt-8 space-y-4 rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6 sm:p-8">
        {closing.map((paragraph) => (
          <p key={paragraph} className="text-base leading-relaxed text-white/75">
            {paragraph}
          </p>
        ))}
      </blockquote>
    </div>
  );
}

export function ProposalNextStepsList({ steps }: { steps: readonly string[] }) {
  return (
    <ol className="space-y-2">
      {steps.map((step, index) => (
        <li
          key={step}
          className="flex items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3.5 transition-colors hover:border-white/12 hover:bg-white/[0.03]"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-sm font-bold text-emerald-400">
            {index + 1}
          </span>
          <span className="text-sm font-medium text-white/80">{step}</span>
        </li>
      ))}
    </ol>
  );
}

export function CommercialFlowPills({ steps }: { steps: readonly string[] }) {
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {steps.map((step, i) => (
        <span key={step} className="inline-flex items-center gap-1">
          {i > 0 && <ArrowRight className="h-3 w-3 text-white/20" />}
          <span className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[11px] text-white/50">
            {step}
          </span>
        </span>
      ))}
    </div>
  );
}
