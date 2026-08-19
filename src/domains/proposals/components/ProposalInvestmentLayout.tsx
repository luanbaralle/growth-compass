import type { ProposalPricingTier } from "../types";
import { ArrowRight, Check, CircleDollarSign, Megaphone, TrendingUp, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const TIER_ICONS: Record<string, typeof Wrench> = {
  implementation: Wrench,
  media: Megaphone,
  management: TrendingUp,
};

function parsePriceRange(amountLabel: string): { min: string; max: string } | null {
  const match = amountLabel.match(/(.+?)\s+a\s+(.+)/i);
  if (!match) return null;
  return { min: match[1].trim(), max: match[2].trim() };
}

function PriceBlock({
  amountLabel,
  note,
  featured = false,
  isRange = false,
}: {
  amountLabel: string;
  note?: string;
  featured?: boolean;
  isRange?: boolean;
}) {
  const range = isRange ? parsePriceRange(amountLabel) : null;

  return (
    <div
      className={cn(
        "rounded-2xl border px-5 py-4 md:px-6 md:py-5",
        featured
          ? "border-white/20 bg-white/[0.08] shadow-lg shadow-black/20"
          : "border-white/10 bg-white/[0.03]",
      )}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/40">
        {range ? "Investimento sugerido" : "Valor"}
      </p>
      {range ? (
        <p className="mt-2 flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
          <span className="text-2xl font-bold tracking-tight text-white md:text-3xl">{range.min}</span>
          <span className="text-sm font-medium text-white/50">a</span>
          <span className="text-2xl font-bold tracking-tight text-white md:text-3xl">{range.max}</span>
          <span className="text-sm font-semibold text-white/50">/ mês</span>
        </p>
      ) : (
        <p className="mt-1 text-3xl font-bold tracking-tight text-white md:text-4xl">{amountLabel}</p>
      )}
      {note && <p className="mt-2 text-xs leading-relaxed text-white/45">{note}</p>}
    </div>
  );
}

export function ProposalInvestmentLayout({ tiers }: { tiers: ProposalPricingTier[] }) {
  const implementation = tiers.find((t) => t.id === "implementation") ?? tiers[0];
  const media = tiers.find((t) => t.id === "media") ?? tiers[1];
  const management = tiers.find((t) => t.id === "management") ?? tiers[2];
  const recurring = [media, management].filter(Boolean) as ProposalPricingTier[];

  if (!implementation) return null;

  const ImplIcon = TIER_ICONS.implementation ?? Wrench;

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 sm:px-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
          <CircleDollarSign className="h-4 w-4 text-emerald-400/80" strokeWidth={2.5} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white">3 camadas de investimento, sem surpresas</p>
          <p className="mt-0.5 text-xs leading-relaxed text-white/50">
            Implementação única → mídia no Google → gestão contínua após validação.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 text-xs font-semibold text-white/55 sm:w-auto sm:flex-row sm:items-center">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-center">
            01 Único
          </span>
          <ArrowRight className="hidden h-3.5 w-3.5 sm:block" aria-hidden />
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-center">
            02–03 Recorrente
          </span>
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
          {recurring.map((block, index) => {
            const Icon = TIER_ICONS[block.id] ?? TrendingUp;
            const isRange = block.frequency === "monthly_google" || / a /i.test(block.amountLabel);
            return (
              <div
                key={block.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-colors hover:border-white/15"
              >
                <div className={cn("h-1", index === 0 ? "bg-sky-500/50" : "bg-amber-500/50")} />
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
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {block.items.map((item) => (
                        <li
                          key={item}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/65"
                        >
                          <Check className="h-3 w-3 text-emerald-400/70" strokeWidth={3} />
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

      <p className="text-center text-xs leading-relaxed text-white/40 md:text-sm">
        Mídia paga diretamente ao Google · Gestão mensal iniciada após validação do primeiro ciclo
      </p>
    </div>
  );
}
