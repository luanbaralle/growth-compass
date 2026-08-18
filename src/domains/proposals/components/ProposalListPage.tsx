import { listProposals } from "@/domains/proposals/api.server";
import {
  PROPOSAL_STATUS_LABELS,
  PROPOSAL_TEMPLATE_LABELS,
  type Proposal,
} from "@/domains/proposals/types";
import { getErrorMessage } from "@/lib/api/client-errors";
import { OSPage, PageHeader, PageSkeleton } from "@/os/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ExternalLink, FileText } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function ProposalListPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await listProposals({ data: {} });
      setProposals(rows);
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao carregar propostas."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <PageSkeleton />;

  return (
    <OSPage>
      <PageHeader
        title="Propostas"
        description="Páginas comerciais para Reunião 2 — pitch e fechamento."
      />

      {proposals.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/60 px-6 py-16 text-center">
          <FileText className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-4 text-sm text-muted-foreground">
            Nenhuma proposta ainda. Crie a partir de uma sessão Copilot encerrada.
          </p>
          <Button variant="outline" className="mt-4" asChild>
            <Link to="/os/copilot">Ir ao Copilot</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {proposals.map((p) => (
            <Link
              key={p.id}
              to="/os/propostas/$id"
              params={{ id: p.id }}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/50 bg-card px-5 py-4 transition hover:border-border"
            >
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {p.company_name} · /propostas/{p.slug}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{PROPOSAL_STATUS_LABELS[p.status]}</Badge>
                <Badge variant="outline" className="text-muted-foreground">
                  {PROPOSAL_TEMPLATE_LABELS[p.template]}
                </Badge>
                {p.status === "published" && (
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </OSPage>
  );
}
