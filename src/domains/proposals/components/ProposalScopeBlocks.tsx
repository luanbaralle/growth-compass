import { r1CardClass, r1CardHighlightClass } from "../shell/r1-tokens";

export function ProposalScopeBoundaries({
  exclusions,
  expansionOpportunities,
}: {
  exclusions?: string[];
  expansionOpportunities?: string[];
}) {
  if (!exclusions?.length && !expansionOpportunities?.length) return null;

  return (
    <div className="mt-8 grid gap-4 lg:grid-cols-2">
      {exclusions && exclusions.length > 0 && (
        <div className={r1CardClass}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
            Não incluso nesta fase
          </p>
          <p className="mt-2 text-sm text-white/55">
            Delimitação intencional — evolução planejada após validação.
          </p>
          <ul className="mt-5 space-y-2.5">
            {exclusions.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-white/60">
                <span className="text-white/25">—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {expansionOpportunities && expansionOpportunities.length > 0 && (
        <div className={r1CardHighlightClass}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400/70">
            Próximas oportunidades de expansão
          </p>
          <p className="mt-2 text-sm text-white/55">
            Ativadas quando o primeiro ciclo gerar dados suficientes.
          </p>
          <ul className="mt-5 space-y-2.5">
            {expansionOpportunities.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-white/70">
                <span className="text-emerald-400/60">+</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function ProposalStrategicGuidance({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <div className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
        Acompanhamento estratégico
      </p>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/65">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/70" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProposalPositioningBand({
  statement,
  phase1Objective,
}: {
  statement?: string;
  phase1Objective?: string;
}) {
  if (!statement && !phase1Objective) return null;

  return (
    <div className={r1CardHighlightClass}>
      {phase1Objective && (
        <>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400/80">
            Objetivo da Fase 1
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-white/80">{phase1Objective}</p>
        </>
      )}
      {statement && (
        <p className={phase1Objective ? "mt-4 text-sm leading-relaxed text-white/50" : "mt-0 text-sm leading-relaxed text-white/60"}>
          {statement}
        </p>
      )}
    </div>
  );
}
