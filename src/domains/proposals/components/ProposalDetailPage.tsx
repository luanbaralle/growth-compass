import {
  enrichProposalFromCopilot,
  getProposal,
  publishProposal,
  rebuildProposalFromCopilot,
  updateProposal,
} from "@/domains/proposals/api.server";
import { ProposalAuditChecklist } from "@/domains/proposals/components/ProposalAuditChecklist";
import { ProposalDraftBanner } from "@/domains/proposals/components/R1PublicProposalPage";
import { ProposalSectionEditor } from "@/domains/proposals/components/ProposalSectionEditor";
import { PublicProposalPage } from "@/domains/proposals/components/PublicProposalPage";
import { isSaudeCiaReferenceProposal } from "@/domains/proposals/components/SaudeCiaReferenceProposalPage";
import {
  PROPOSAL_PRESENTATION_OUTCOME_LABELS,
  PROPOSAL_STATUS_LABELS,
  PROPOSAL_TEMPLATE_LABELS,
  type ProposalContent,
} from "@/domains/proposals/types";
import { getErrorMessage } from "@/lib/api/client-errors";
import { OSPage, PageSkeleton } from "@/os/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Loader2, Presentation } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function ProposalDetailPage({ proposalId }: { proposalId: string }) {
  const [proposal, setProposal] = useState<Awaited<ReturnType<typeof getProposal>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const [rebuilding, setRebuilding] = useState(false);
  const [preview, setPreview] = useState(false);
  const [blueprintId, setBlueprintId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const row = await getProposal({ data: { id: proposalId } });
      setProposal(row);
      if (row.commercial_blueprint_id) {
        setBlueprintId(row.commercial_blueprint_id);
      } else {
        setBlueprintId(null);
      }
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
    if (!proposal) return;
    setPublishing(true);
    try {
      const updated = await publishProposal({ data: { id: proposal.id } });
      setProposal(updated);
      toast.success("Proposta publicada.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao publicar."));
    } finally {
      setPublishing(false);
    }
  };

  const handleArchive = async () => {
    if (!proposal) return;
    try {
      const updated = await updateProposal({ data: { id: proposal.id, status: "archived" } });
      setProposal(updated);
      toast.success("Proposta arquivada.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao arquivar."));
    }
  };

  const handleSave = async (patch: {
    title?: string;
    slug?: string;
    content: ProposalContent;
  }) => {
    if (!proposal) return;
    setSaving(true);
    try {
      const updated = await updateProposal({
        data: { id: proposal.id, ...patch },
      });
      setProposal(updated);
      toast.success("Proposta salva.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao salvar."));
    } finally {
      setSaving(false);
    }
  };

  const handleEnrich = async () => {
    if (!proposal) return;
    setEnriching(true);
    try {
      const updated = await enrichProposalFromCopilot({ data: { id: proposal.id } });
      setProposal(updated);
      toast.success("Seções enriquecidas com IA — conteúdo anterior preservado onde a IA não melhorou.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao enriquecer proposta."));
    } finally {
      setEnriching(false);
    }
  };

  const handleRebuild = async () => {
    if (!proposal) return;
    setRebuilding(true);
    try {
      const updated = await rebuildProposalFromCopilot({ data: { id: proposal.id } });
      setProposal(updated);
      toast.success("Proposta reconstruída a partir do diagnóstico Copilot.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao reconstruir proposta."));
    } finally {
      setRebuilding(false);
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
        <PublicProposalPage proposal={proposal} />
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
            {proposal.copilot_session_id && " · vinculada ao Copilot"}
            {blueprintId && " · blueprint comercial"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {blueprintId && (
            <Button variant="outline" size="sm" asChild>
              <Link to="/os/propostas/blueprint/$id" params={{ id: blueprintId }}>
                Blueprint comercial
              </Link>
            </Button>
          )}
          <Badge variant="outline">{PROPOSAL_STATUS_LABELS[proposal.status]}</Badge>
          <Button variant="outline" size="sm" onClick={() => setPreview(true)}>
            Preview
          </Button>
          <Button variant="default" size="sm" asChild>
            <Link to="/os/propostas/$id/apresentacao" params={{ id: proposal.id }}>
              <Presentation className="mr-1.5 h-3.5 w-3.5" />
              Apresentar
            </Link>
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

      {isSaudeCiaReferenceProposal(proposal) && (
        <div className="mb-6 rounded-xl border border-border/60 bg-muted/20 px-4 py-3">
          <p className="text-xs font-semibold text-foreground/80">Frentes alternativas (uso interno)</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Páginas de entrada para objeção de preço. Não aparecem como propostas separadas.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={`${publicUrl}/conteudo`} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                Plano de Conteúdo
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={`${publicUrl}/aquisicao`} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                Plano de Aquisição
              </a>
            </Button>
          </div>
        </div>
      )}

      {content.presentation?.outcome && (
        <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            Resultado da Reunião 2: {PROPOSAL_PRESENTATION_OUTCOME_LABELS[content.presentation.outcome]}
          </p>
          {content.presentation.notes && (
            <p className="mt-2 text-xs text-muted-foreground">{content.presentation.notes}</p>
          )}
        </div>
      )}

      {content.gapsForMeeting2 && content.gapsForMeeting2.length > 0 && (
        <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
            Lacunas para validar na Reunião 2
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-amber-800/80 dark:text-amber-200/80">
            {content.gapsForMeeting2.map((gap) => (
              <li key={gap}>{gap}</li>
            ))}
          </ul>
        </div>
      )}

      <ProposalAuditChecklist proposal={proposal} content={content} />

      <ProposalSectionEditor
        content={content}
        title={proposal.title}
        slug={proposal.slug}
        template={proposal.template}
        onSave={handleSave}
        onEnrich={proposal.copilot_session_id ? handleEnrich : undefined}
        onRebuild={proposal.copilot_session_id ? handleRebuild : undefined}
        saving={saving}
        enriching={enriching}
        rebuilding={rebuilding}
      />
    </OSPage>
  );
}
