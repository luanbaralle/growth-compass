import { getProposal, publishProposal, updateProposal } from "@/domains/proposals/api.server";
import {
  AccelerationProposalPage,
  ProposalDraftBanner,
} from "@/domains/proposals/components/AccelerationProposalPage";
import {
  PROPOSAL_STATUS_LABELS,
  PROPOSAL_TEMPLATE_LABELS,
  type ProposalContent,
} from "@/domains/proposals/types";
import { getErrorMessage } from "@/lib/api/client-errors";
import { OSPage, PageSkeleton } from "@/os/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function ProposalDetailPage({ proposalId }: { proposalId: string }) {
  const [proposal, setProposal] = useState<Awaited<ReturnType<typeof getProposal>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [preview, setPreview] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const row = await getProposal({ data: { id: proposalId } });
      setProposal(row);
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao carregar proposta."));
    } finally {
      setLoading(false);
    }
  }, [proposalId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const updated = await publishProposal({ data: { id: proposalId } });
      setProposal(updated);
      toast.success("Proposta publicada.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao publicar."));
    } finally {
      setPublishing(false);
    }
  };

  const handleArchive = async () => {
    try {
      const updated = await updateProposal({ data: { id: proposalId, status: "archived" } });
      setProposal(updated);
      toast.success("Proposta arquivada.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao arquivar."));
    }
  };

  if (loading || !proposal) return <PageSkeleton />;

  const content = proposal.content as ProposalContent;
  const publicUrl = `/propostas/${proposal.slug}`;

  if (preview) {
    return (
      <div>
        {proposal.status === "draft" && <ProposalDraftBanner />}
        <div className="fixed left-4 top-4 z-[60] flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => setPreview(false)}>
            Voltar ao editor
          </Button>
          {proposal.status === "published" && (
            <Button size="sm" variant="outline" asChild>
              <a href={publicUrl} target="_blank" rel="noreferrer">
                Abrir link público
              </a>
            </Button>
          )}
        </div>
        <AccelerationProposalPage proposal={proposal} />
      </div>
    );
  }

  return (
    <OSPage>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/os/propostas">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-semibold">{proposal.title}</h1>
          <p className="text-sm text-muted-foreground">
            {proposal.company_name} · {PROPOSAL_TEMPLATE_LABELS[proposal.template]}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{PROPOSAL_STATUS_LABELS[proposal.status]}</Badge>
          <Button variant="outline" size="sm" onClick={() => setPreview(true)}>
            Preview
          </Button>
          {proposal.status === "published" && (
            <Button variant="outline" size="sm" asChild>
              <a href={publicUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                {publicUrl}
              </a>
            </Button>
          )}
          {proposal.status === "draft" && (
            <Button size="sm" onClick={() => void handlePublish()} disabled={publishing}>
              {publishing ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : null}
              Publicar
            </Button>
          )}
          {proposal.status !== "archived" && (
            <Button variant="ghost" size="sm" onClick={() => void handleArchive()}>
              Arquivar
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {content.sections.map((section) => (
          <div key={section.key} className="rounded-xl border border-border/50 bg-card p-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {section.number} — {section.title}
            </p>
            <p className="mt-3 text-sm leading-relaxed">{section.narrative}</p>
            {section.bullets.length > 0 && (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {section.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
            {section.editorNotes && (
              <p className="mt-3 rounded-md border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
                Nota editor: {section.editorNotes}
              </p>
            )}
          </div>
        ))}
      </div>
    </OSPage>
  );
}
