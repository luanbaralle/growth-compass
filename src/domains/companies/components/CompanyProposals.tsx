import { listProposalsForCompany } from "@/domains/proposals/api.server";
import {
  PROPOSAL_PRESENTATION_OUTCOME_LABELS,
  PROPOSAL_STATUS_LABELS,
  type ProposalContent,
  type ProposalPresentationOutcome,
  type ProposalStatus,
} from "@/domains/proposals/types";
import { STATUS_LABELS } from "@/domains/projects/types";
import { getErrorMessage, isUnauthorizedError } from "@/lib/api/client-errors";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { FileText, FolderKanban } from "lucide-react";
import { useEffect, useState } from "react";

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = iso.slice(0, 10);
  const [y, m, day] = d.split("-");
  if (!y || !m || !day) return "—";
  return `${day}/${m}/${y}`;
}

const STATUS_BADGE: Record<ProposalStatus, string> = {
  draft: "border-amber-400/35 bg-amber-400/10 text-amber-300",
  published: "border-emerald-400/35 bg-emerald-400/10 text-emerald-300",
  archived: "border-zinc-500/35 bg-zinc-500/10 text-zinc-400",
};

const OUTCOME_BADGE: Record<ProposalPresentationOutcome, string> = {
  approved: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  adjustments: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  postponed: "border-sky-400/30 bg-sky-400/10 text-sky-300",
};

export function CompanyProposals({
  companyId,
  companyName,
  refreshKey = 0,
}: {
  companyId: string;
  companyName: string;
  refreshKey?: number;
}) {
  const [rows, setRows] = useState<Awaited<ReturnType<typeof listProposalsForCompany>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    listProposalsForCompany({ data: { companyId } })
      .then(setRows)
      .catch((err) => {
        if (!isUnauthorizedError(err)) {
          setError(getErrorMessage(err, "Erro ao carregar propostas."));
        }
      })
      .finally(() => setLoading(false));
  }, [companyId, refreshKey]);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Carregando propostas...</p>;
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Propostas de <strong className="text-foreground">{companyName}</strong>
      </p>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border/60 py-10 text-center">
          <FileText className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Nenhuma proposta registrada para esta empresa.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border/60 rounded-lg border border-border/60">
          {rows.map(({ proposal, project }) => {
            const content = proposal.content as ProposalContent;
            const outcome = content.presentation?.outcome;
            const dateLabel = proposal.published_at
              ? `Publicada ${formatDate(proposal.published_at)}`
              : `Atualizada ${formatDate(proposal.updated_at)}`;

            return (
              <li key={proposal.id} className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-foreground">{proposal.title}</p>
                    <span
                      className={cn(
                        "rounded-md border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                        STATUS_BADGE[proposal.status],
                      )}
                    >
                      {PROPOSAL_STATUS_LABELS[proposal.status]}
                    </span>
                    {outcome && (
                      <span
                        className={cn(
                          "rounded-md border px-1.5 py-0.5 text-[10px] font-medium",
                          OUTCOME_BADGE[outcome],
                        )}
                      >
                        {PROPOSAL_PRESENTATION_OUTCOME_LABELS[outcome]}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{dateLabel}</p>
                  {project ? (
                    <p className="text-xs text-emerald-300/90">
                      Projeto vinculado · {STATUS_LABELS[project.status] ?? project.status} ·{" "}
                      <span className="text-foreground/80">{project.title}</span>
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">Sem projeto vinculado</p>
                  )}
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link to="/os/propostas/$id" params={{ id: proposal.id }}>
                      Abrir proposta
                    </Link>
                  </Button>
                  {project && (
                    <Button size="sm" variant="outline" asChild>
                      <Link to="/os/projetos/$id" params={{ id: project.id }}>
                        <FolderKanban className="mr-1.5 h-3.5 w-3.5" />
                        Abrir projeto
                      </Link>
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
