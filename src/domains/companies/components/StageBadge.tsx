import { cn } from "@/lib/utils";
import type { CompanyStage } from "@/domains/companies/types";
import { STAGE_LABELS } from "@/domains/companies/types";

const stageStyles: Record<CompanyStage, string> = {
  lead: "border-blue-400/40 text-blue-300 bg-blue-400/10",
  contato: "border-cyan-400/40 text-cyan-300 bg-cyan-400/10",
  proposta: "border-violet-400/40 text-violet-300 bg-violet-400/10",
  negociacao: "border-amber-400/40 text-amber-300 bg-amber-400/10",
  ativo: "border-emerald-400/40 text-emerald-300 bg-emerald-400/10",
  pausado: "border-orange-400/40 text-orange-300 bg-orange-400/10",
  encerrado: "border-zinc-400/40 text-zinc-400 bg-zinc-400/10",
};

export function StageBadge({
  stage,
  className,
}: {
  stage: CompanyStage;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        stageStyles[stage],
        className,
      )}
    >
      {STAGE_LABELS[stage]}
    </span>
  );
}
