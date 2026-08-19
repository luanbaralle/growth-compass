import type { ProposalDiagnosisCard } from "../types";
import { r1CardClass } from "../shell/r1-tokens";

export function ProposalDiagnosisCards({ cards }: { cards: ProposalDiagnosisCard[] }) {
  if (cards.length === 0) return null;

  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className={r1CardClass}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
            {card.label}
          </p>
          <p className="mt-2 text-base font-semibold leading-snug text-white">{card.value}</p>
          {card.description && card.description !== card.value && (
            <p className="mt-2 text-sm leading-relaxed text-white/50">{card.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
