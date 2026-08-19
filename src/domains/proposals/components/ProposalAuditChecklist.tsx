import type { Proposal, ProposalContent } from "../types";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";

const AUDIT_ITEMS: Array<{
  id: string;
  label: string;
  check: (content: ProposalContent, proposal: Proposal) => boolean;
}> = [
  {
    id: "phase1",
    label: "Objetivo da Fase 1 definido",
    check: (c) => Boolean(c.phase1Objective?.trim()),
  },
  {
    id: "positioning",
    label: "Posicionamento comercial (tom maduro)",
    check: (c) => Boolean(c.positioningStatement?.trim()),
  },
  {
    id: "movements",
    label: "3 movimentos (Estruturar → Validar → Escalar)",
    check: (c) => (c.movements?.length ?? 0) >= 3,
  },
  {
    id: "exclusions",
    label: "Limites do escopo (não incluso)",
    check: (c) => (c.exclusions?.length ?? 0) >= 3,
  },
  {
    id: "expansion",
    label: "Oportunidades de expansão mapeadas",
    check: (c) => (c.expansionOpportunities?.length ?? 0) >= 2,
  },
  {
    id: "deliverables",
    label: "Entregáveis Fase 1 preenchidos",
    check: (c) => {
      const d = c.sections.find((s) => s.key === "deliverables");
      return (d?.bullets.length ?? 0) >= 4;
    },
  },
  {
    id: "pricing",
    label: "Investimento revisado (setup + mídia + gestão)",
    check: (c) => (c.pricing?.length ?? 0) >= 3,
  },
  {
    id: "gaps",
    label: "Lacunas para Reunião 2 revisadas",
    check: (c) => (c.gapsForMeeting2?.length ?? 0) > 0,
  },
];

export function ProposalAuditChecklist({
  proposal,
  content,
}: {
  proposal: Proposal;
  content: ProposalContent;
}) {
  if (proposal.template !== "acceleration") return null;

  const results = AUDIT_ITEMS.map((item) => ({
    ...item,
    done: item.check(content, proposal),
  }));
  const doneCount = results.filter((r) => r.done).length;
  const ready = doneCount >= results.length - 1;

  return (
    <div className="mb-6 rounded-xl border border-border/50 bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">Auditoria comercial</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Checklist antes de publicar — proposta gerada pelo Copilot é rascunho.
          </p>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold",
            ready
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : "bg-amber-500/10 text-amber-700 dark:text-amber-300",
          )}
        >
          {doneCount}/{results.length} · {ready ? "Pronta para revisão final" : "Requer auditoria"}
        </span>
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {results.map((item) => (
          <li key={item.id} className="flex items-start gap-2 text-sm">
            {item.done ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            ) : (
              <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50" />
            )}
            <span className={item.done ? "text-foreground" : "text-muted-foreground"}>{item.label}</span>
          </li>
        ))}
      </ul>
      {content.playbookParams && (
        <p className="mt-4 text-[11px] text-muted-foreground">
          Playbook: LP{" "}
          {content.playbookParams.assetMode === "existing_lp" ? "existente" : "nova"} ·
          {content.playbookParams.hasCapacityConstraint
            ? " capacidade comercial detectada"
            : " sem restrição de capacidade mapeada"}
        </p>
      )}
    </div>
  );
}
