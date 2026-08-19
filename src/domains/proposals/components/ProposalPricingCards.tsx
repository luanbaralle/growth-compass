import type { ProposalPricingTier } from "../types";

export function ProposalPricingCards({ tiers }: { tiers: ProposalPricingTier[] }) {
  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-3">
      {tiers.map((tier, index) => (
        <div
          key={tier.id}
          className={
            index === 0
              ? "rounded-2xl border border-white/[0.18] bg-white/[0.06] p-5 sm:p-6"
              : "rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"
          }
        >
          {tier.subtitle && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
              {tier.subtitle}
            </p>
          )}
          <h3 className="mt-2 text-lg font-semibold text-white">{tier.name}</h3>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-white">{tier.amountLabel}</p>
          <ul className="mt-4 space-y-2">
            {tier.items.map((item) => (
              <li key={item} className="text-sm text-white/65 before:mr-2 before:text-emerald-400/70 before:content-['✓']">
                {item}
              </li>
            ))}
          </ul>
          {tier.note && <p className="mt-4 text-xs leading-relaxed text-white/40">{tier.note}</p>}
        </div>
      ))}
    </div>
  );
}
