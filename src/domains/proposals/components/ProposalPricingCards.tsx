import type { ProposalPricingTier } from "../types";

export function ProposalPricingCards({ tiers }: { tiers: ProposalPricingTier[] }) {
  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-3">
      {tiers.map((tier, index) => (
        <div
          key={tier.id}
          className={
            index === 0
              ? "rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-transparent p-5"
              : "rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          }
        >
          {tier.subtitle && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-500/80">
              {tier.subtitle}
            </p>
          )}
          <h3 className="mt-2 text-lg font-semibold">{tier.name}</h3>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-amber-300">{tier.amountLabel}</p>
          <ul className="mt-4 space-y-2">
            {tier.items.map((item) => (
              <li key={item} className="text-sm text-white/65 before:mr-2 before:text-amber-500/70 before:content-['✓']">
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
