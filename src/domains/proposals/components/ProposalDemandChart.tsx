import type { ProposalDemandKeyword } from "../types";

const COMPETITION_LABELS: Record<ProposalDemandKeyword["competition"], string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};

const COMPETITION_COLORS: Record<ProposalDemandKeyword["competition"], string> = {
  low: "bg-emerald-500/80",
  medium: "bg-amber-500/80",
  high: "bg-rose-500/70",
};

export function ProposalDemandChart({ keywords }: { keywords: ProposalDemandKeyword[] }) {
  const maxVolume = Math.max(...keywords.map((k) => k.volume), 1);

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
          Volume de busca mensal (estimativa)
        </p>
        <p className="text-[10px] text-white/35">Referência Keyword Planner</p>
      </div>
      <div className="space-y-3">
        {keywords.map((item) => {
          const width = `${Math.round((item.volume / maxVolume) * 100)}%`;
          return (
            <div key={item.keyword} className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="font-medium text-white/85">{item.keyword}</span>
                  <span className="tabular-nums text-white/50">{item.volume.toLocaleString("pt-BR")}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/8">
                  <div
                    className={`h-full rounded-full ${COMPETITION_COLORS[item.competition]}`}
                    style={{ width }}
                  />
                </div>
              </div>
              <span className="text-[11px] text-white/40 sm:text-right">
                Concorrência {COMPETITION_LABELS[item.competition]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
