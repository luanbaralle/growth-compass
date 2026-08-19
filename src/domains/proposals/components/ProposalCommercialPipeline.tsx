import type { ProposalCommercialPipelineStep } from "../types";

export function ProposalCommercialPipeline({ steps }: { steps: ProposalCommercialPipelineStep[] }) {
  if (steps.length === 0) return null;

  return (
    <div className="mt-8 space-y-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/38">
        Funil comercial mensurável
      </p>
      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-[720px] gap-2">
          {steps.map((step, index) => (
            <div key={step.title} className="relative min-w-[140px] flex-1">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-2 text-sm font-semibold leading-snug text-white">{step.title}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-white/50">{step.description}</p>
                {step.metricLabel && (
                  <p className="mt-2 text-[10px] font-medium uppercase tracking-wide text-emerald-400/70">
                    {step.metricLabel}
                  </p>
                )}
              </div>
              {index < steps.length - 1 && (
                <span
                  className="absolute -right-1 top-1/2 hidden text-white/20 sm:inline"
                  aria-hidden
                >
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
