import type { ProposalPricingTier } from "../types";
import { ArrowRight, Check, CircleDollarSign, Megaphone, TrendingUp, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const TIER_ICONS: Record<string, typeof Wrench> = {
  implementation: Wrench,
  media: Megaphone,
  management: TrendingUp,
};

const DEFAULT_RECURRING_ORDER = ["media", "management"] as const;

export interface ProposalInvestmentContext {
  headerTitle?: string;
  headerDescription?: string;
  headerSteps?: readonly string[];
  footerNote?: string;
  recurringOrder?: readonly ("media" | "management")[];
  summary?: {
    title: string;
    rows: readonly { label: string; value: string }[];
    totalLabel: string;
    totalValue: string;
    totalNote?: string;
  };
}

function parsePriceRange(amountLabel: string): { min: string; max: string } | null {
  const match = amountLabel.match(/(.+?)\s+a\s+(.+)/i);
  if (!match) return null;
  return { min: match[1].trim(), max: match[2].trim().replace(/\/\s*mês$/i, "") };
}

function parseInstallments(note?: string): { times: string; amount: string } | null {
  if (!note) return null;
  const match = note.match(/em até\s+(\d+)x\s+de\s+(R\$\s*[\d.,]+)/i);
  if (!match) return null;
  return { times: match[1], amount: match[2].replace(/\s+/g, " ").trim() };
}

function PriceBlock({
  amountLabel,
  note,
  featured = false,
  isRange = false,
  suffix,
}: {
  amountLabel: string;
  note?: string;
  featured?: boolean;
  isRange?: boolean;
  suffix?: string;
}) {
  const range = isRange ? parsePriceRange(amountLabel) : null;
  const installments = parseInstallments(note);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border",
        featured
          ? "border-emerald-500/25 bg-gradient-to-br from-emerald-500/[0.12] via-white/[0.05] to-transparent shadow-lg shadow-black/25"
          : "border-white/10 bg-white/[0.03]",
      )}
    >
      {featured && <div className="h-1 bg-gradient-to-r from-emerald-500/80 to-emerald-500/20" />}
      <div className="px-5 py-4 md:px-6 md:py-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/40">
          {range ? "Investimento sugerido" : installments ? "Investimento único" : "Valor"}
        </p>
        {range ? (
          <p className="mt-2 flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
            <span className="text-2xl font-bold tracking-tight text-white md:text-3xl">{range.min}</span>
            <span className="text-sm font-medium text-white/50">a</span>
            <span className="text-2xl font-bold tracking-tight text-white md:text-3xl">{range.max}</span>
            {(suffix ?? /mês/i.test(amountLabel)) && (
              <span className="text-sm font-semibold text-white/50">/ mês</span>
            )}
          </p>
        ) : (
          <p className="mt-1 text-3xl font-bold tracking-tight text-white md:text-4xl">{amountLabel}</p>
        )}

        {installments ? (
          <div className="mt-4 rounded-xl border border-white/10 bg-black/25 px-3.5 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400/70">
              Parcelamento
            </p>
            <p className="mt-1.5 whitespace-nowrap text-[13px] leading-none sm:text-sm">
              <span className="text-white/55">Em até </span>
              <span className="font-bold text-white">{installments.times}x</span>
              <span className="text-white/55"> de </span>
              <span className="font-bold text-emerald-400">{installments.amount.replace(/\.$/, "")}</span>
            </p>
          </div>
        ) : (
          note && <p className="mt-2 text-xs leading-relaxed text-white/45">{note}</p>
        )}
      </div>
    </div>
  );
}

function InvestmentSummary({
  summary,
}: {
  summary: NonNullable<ProposalInvestmentContext["summary"]>;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04]">
      <div className="h-1 bg-emerald-500/60" />
      <div className="p-5 sm:p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400/70">
          {summary.title}
        </p>
        <dl className="mt-4 space-y-3">
          {summary.rows.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-4">
              <dt className="text-sm text-white/55">{row.label}</dt>
              <dd className="shrink-0 text-sm font-semibold text-white/85">{row.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-5 border-t border-emerald-500/15 pt-4">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="text-sm font-medium text-white/70">{summary.totalLabel}</p>
            <p className="text-xl font-bold tracking-tight text-white sm:text-2xl">{summary.totalValue}</p>
          </div>
          {summary.totalNote && (
            <p className="mt-2 text-xs leading-relaxed text-white/45">{summary.totalNote}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProposalInvestmentLayout({
  tiers,
  context,
}: {
  tiers: ProposalPricingTier[];
  context?: ProposalInvestmentContext;
}) {
  const implementation = tiers.find((t) => t.id === "implementation") ?? tiers[0];
  const media = tiers.find((t) => t.id === "media");
  const management = tiers.find((t) => t.id === "management");
  const recurringOrder = context?.recurringOrder ?? DEFAULT_RECURRING_ORDER;
  const recurring = recurringOrder
    .map((id) => (id === "media" ? media : management))
    .filter(Boolean) as ProposalPricingTier[];

  if (!implementation) return null;

  const ImplIcon = TIER_ICONS.implementation ?? Wrench;
  const headerTitle = context?.headerTitle ?? "3 camadas de investimento, sem surpresas";
  const headerDescription =
    context?.headerDescription ??
    "Implementação única → mídia no Google → gestão contínua após validação.";
  const headerSteps = context?.headerSteps ?? ["01 Único", "02–03 Recorrente"];
  const footerNote =
    context?.footerNote ??
    "Mídia paga diretamente ao Google · Gestão mensal iniciada após validação do primeiro ciclo";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 sm:px-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
          <CircleDollarSign className="h-4 w-4 text-emerald-400/80" strokeWidth={2.5} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white">{headerTitle}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-white/50">{headerDescription}</p>
        </div>
        <div className="flex w-full flex-col gap-2 text-xs font-semibold text-white/55 sm:w-auto sm:flex-row sm:items-center">
          {headerSteps.map((step, index) => (
            <span key={step} className="flex items-center gap-2">
              {index > 0 && <ArrowRight className="hidden h-3.5 w-3.5 sm:block" aria-hidden />}
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-center">
                {step}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-transparent ring-1 ring-white/10">
        <div className="h-1 bg-emerald-500/70" />
        <div className="p-5 sm:p-6 md:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-10">
            <div>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] sm:h-11 sm:w-11">
                  <ImplIcon className="h-5 w-5 text-emerald-400/80" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                    {implementation.subtitle ?? "Pagamento único"}
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl md:text-3xl">
                    {implementation.name}
                  </h3>
                </div>
              </div>
              <ul className="mt-8 grid gap-2 sm:grid-cols-2">
                {implementation.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5 text-sm font-medium text-white/75"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
                      <Check className="h-3 w-3 text-emerald-400/90" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full lg:w-64 lg:shrink-0">
              <PriceBlock
                amountLabel={implementation.amountLabel}
                note={implementation.note}
                featured
              />
            </div>
          </div>
        </div>
      </div>

      {recurring.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          {recurring.map((block) => {
            const Icon = TIER_ICONS[block.id] ?? TrendingUp;
            const isRange = block.frequency === "monthly_google" || / a /i.test(block.amountLabel);
            const isMedia = block.id === "media";
            return (
              <div
                key={block.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-colors hover:border-white/15"
              >
                <div className={cn("h-1", isMedia ? "bg-sky-500/50" : "bg-amber-500/50")} />
                <div className="flex h-full flex-col p-6 md:p-7">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                      <Icon className="h-5 w-5 text-white/70" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                        {block.subtitle}
                      </p>
                      <h3 className="mt-1 text-xl font-bold text-white">{block.name}</h3>
                    </div>
                  </div>
                  <div className="mt-6">
                    <PriceBlock amountLabel={block.amountLabel} note={block.note} isRange={isRange} />
                  </div>
                  {block.items.length > 0 && (
                    <ul className="mt-5 space-y-2">
                      {block.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-[13px] font-medium leading-snug text-white/70"
                        >
                          <Check
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400/70"
                            strokeWidth={3}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {context?.summary && <InvestmentSummary summary={context.summary} />}

      <p className="text-center text-xs leading-relaxed text-white/40 md:text-sm">{footerNote}</p>
    </div>
  );
}
