import type { ProposalFunnelStep } from "../types";

export function ProposalFunnelJourney({ steps }: { steps: ProposalFunnelStep[] }) {
  return (
    <div className="mt-6 overflow-x-auto pb-2">
      <div className="flex min-w-[640px] gap-2">
        {steps.map((step, index) => (
          <div key={step.title} className="relative flex-1">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-500/70">
                {index === 0 ? "Início" : `Passo ${index}`}
              </p>
              <p className="mt-2 text-sm font-semibold leading-snug">{step.title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-white/50">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <div className="absolute -right-1 top-1/2 z-10 hidden h-0.5 w-2 bg-amber-500/40 sm:block" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProposalMechanismFlow({ steps }: { steps: string[] }) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center gap-2 sm:gap-3">
          <div className="rounded-full border border-amber-500/25 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-100/90">
            {step}
          </div>
          {index < steps.length - 1 && (
            <span className="text-lg text-white/25" aria-hidden>
              →
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export function ProposalHeroMetrics({ metrics }: { metrics: Array<{ value: string; label: string }> }) {
  if (metrics.length === 0) return null;
  return (
    <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 text-center"
        >
          <p className="text-2xl font-semibold tabular-nums text-amber-300">{m.value}</p>
          <p className="mt-1 text-[11px] uppercase tracking-wide text-white/45">{m.label}</p>
        </div>
      ))}
    </div>
  );
}
