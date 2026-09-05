import {
  getProposal,
  publishProposal,
  saveProposalPresentation,
} from "@/domains/proposals/api.server";
import { ProposalDraftBanner } from "@/domains/proposals/components/R1PublicProposalPage";
import { PublicProposalPage } from "@/domains/proposals/components/PublicProposalPage";
import {
  PROPOSAL_PRESENTATION_OUTCOME_LABELS,
  type ProposalContent,
  type ProposalPresentationOutcome,
} from "@/domains/proposals/types";
import {
  createProjectFromProposal,
  getProjectByProposalId,
} from "@/domains/projects/api.server";
import { listWorkflowTemplates } from "@/domains/projects/execution/api.server";
import type { WorkflowTemplate } from "@/domains/projects/execution/types";
import { STATUS_LABELS, type Project } from "@/domains/projects/types";
import { getErrorMessage } from "@/lib/api/client-errors";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, FolderKanban, Loader2, Presentation } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const OUTCOMES: ProposalPresentationOutcome[] = ["approved", "adjustments", "postponed"];

export function ProposalPresentationPage({ proposalId }: { proposalId: string }) {
  const [proposal, setProposal] = useState<Awaited<ReturnType<typeof getProposal>> | null>(null);
  const [linkedProject, setLinkedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingProject, setLoadingProject] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [notes, setNotes] = useState("");
  const [outcome, setOutcome] = useState<ProposalPresentationOutcome | undefined>();

  const [createOpen, setCreateOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [workflowSlug, setWorkflowSlug] = useState("");
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [creating, setCreating] = useState(false);

  const loadLinkedProject = useCallback(async (id: string) => {
    setLoadingProject(true);
    try {
      const project = await getProjectByProposalId({ data: { proposalId: id } });
      setLinkedProject(project);
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao verificar projeto vinculado."));
      setLinkedProject(null);
    } finally {
      setLoadingProject(false);
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const row = await getProposal({ data: { id: proposalId } });
      setProposal(row);
      const content = row.content as ProposalContent;
      setNotes(content.presentation?.notes ?? "");
      setOutcome(content.presentation?.outcome);
      if (row.company_id) {
        await loadLinkedProject(row.id);
      } else {
        setLinkedProject(null);
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao carregar proposta."));
    } finally {
      setLoading(false);
    }
  }, [proposalId, loadLinkedProject]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!createOpen) return;
    listWorkflowTemplates()
      .then(setTemplates)
      .catch(() => setTemplates([]));
  }, [createOpen]);

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

  const handleSave = async (selectedOutcome?: ProposalPresentationOutcome) => {
    setSaving(true);
    try {
      const updated = await saveProposalPresentation({
        data: {
          id: proposalId,
          outcome: selectedOutcome ?? outcome,
          notes,
        },
      });
      setProposal(updated);
      if (selectedOutcome) setOutcome(selectedOutcome);
      toast.success(
        selectedOutcome
          ? `Resultado registrado: ${PROPOSAL_PRESENTATION_OUTCOME_LABELS[selectedOutcome]}`
          : "Notas salvas.",
      );
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao salvar."));
    } finally {
      setSaving(false);
    }
  };

  const openCreateDialog = () => {
    if (!proposal?.company_id) return;
    setProjectTitle(proposal.title);
    setWorkflowSlug("");
    setCreateOpen(true);
  };

  const handleCreateProject = async () => {
    if (!proposal?.company_id || creating) return;
    const title = projectTitle.trim();
    if (title.length < 2) {
      toast.error("Informe um título com pelo menos 2 caracteres.");
      return;
    }

    setCreating(true);
    try {
      const result = await createProjectFromProposal({
        data: {
          proposalId: proposal.id,
          title,
          workflowTemplateSlug: workflowSlug || undefined,
        },
      });
      setLinkedProject(result.project);
      setCreateOpen(false);
      if (result.created) {
        toast.success("Projeto criado com sucesso.");
      } else {
        toast.message("Esta proposta já possuía um projeto. Abrindo projeto existente.");
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao criar projeto."));
    } finally {
      setCreating(false);
    }
  };

  if (loading || !proposal) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070708] text-white/60">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const content = proposal.content as ProposalContent;
  const publicUrl = `/propostas/${proposal.slug}`;
  const createPrimary = outcome === "approved";

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#070708] lg:h-screen lg:min-h-0 lg:flex-row lg:overflow-hidden">
      <div className="relative min-h-0 flex-1 overflow-y-auto lg:h-full">
        {proposal.status === "draft" && <ProposalDraftBanner />}
        <div className="sticky top-0 z-50 flex items-center gap-2 border-b border-white/10 bg-[#070708]/90 px-4 py-2 backdrop-blur-md lg:hidden">
          <Button variant="ghost" size="sm" asChild className="text-white/70">
            <Link to="/os/propostas/$id" params={{ id: proposalId }}>
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <span className="truncate text-xs text-white/50">{proposal.company_name}</span>
        </div>
        <PublicProposalPage proposal={proposal} />
      </div>

      <aside className="flex max-h-[45vh] w-full shrink-0 flex-col border-t border-white/10 bg-[#0c0c0d] lg:max-h-none lg:h-full lg:w-[340px] lg:border-l lg:border-t-0">
        <div className="border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2 text-amber-400">
            <Presentation className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em]">Reunião 2</p>
          </div>
          <h2 className="mt-2 text-lg font-semibold text-white">{proposal.company_name}</h2>
          <p className="mt-1 text-sm text-white/50">{proposal.client_name ?? "Cliente"}</p>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          {proposal.status === "draft" && (
            <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-4">
              <p className="text-sm font-medium text-amber-100">Proposta ainda em rascunho</p>
              <p className="mt-1 text-xs text-amber-100/70">
                Publique antes de compartilhar o link com o cliente.
              </p>
              <Button
                size="sm"
                className="mt-3 bg-amber-500 text-black hover:bg-amber-400"
                onClick={() => void handlePublish()}
                disabled={publishing}
              >
                {publishing ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : null}
                Publicar agora
              </Button>
            </div>
          )}

          {proposal.status === "published" && (
            <Button variant="outline" size="sm" className="w-full border-white/15 text-white/80" asChild>
              <a href={publicUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                Abrir link público
              </a>
            </Button>
          )}

          {content.gapsForMeeting2 && content.gapsForMeeting2.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/45">
                Validar na call
              </p>
              <ul className="mt-3 space-y-2">
                {content.gapsForMeeting2.map((gap) => (
                  <li
                    key={gap}
                    className="rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2 text-xs leading-relaxed text-white/65"
                  >
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="presentation-notes" className="text-xs text-white/50">
              Notas da apresentação
            </Label>
            <Textarea
              id="presentation-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Objeções, combinados, próximos passos..."
              rows={6}
              className="border-white/10 bg-white/[0.04] text-sm text-white placeholder:text-white/30"
            />
            <Button
              variant="outline"
              size="sm"
              className="border-white/15 text-white/80"
              onClick={() => void handleSave()}
              disabled={saving}
            >
              {saving ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : null}
              Salvar notas
            </Button>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-white/45">
              Resultado
            </p>
            <div className="mt-3 grid gap-2">
              {OUTCOMES.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => void handleSave(value)}
                  disabled={saving}
                  className={cn(
                    "rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
                    outcome === value
                      ? "border-amber-500/40 bg-amber-500/15 text-amber-100"
                      : "border-white/10 bg-white/[0.03] text-white/75 hover:border-white/20",
                  )}
                >
                  {PROPOSAL_PRESENTATION_OUTCOME_LABELS[value]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 border-t border-white/10 pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/45">
              Projeto operacional
            </p>

            {!proposal.company_id ? (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <p className="text-sm font-medium text-white/85">
                  Esta proposta não está vinculada a uma empresa.
                </p>
                <p className="mt-1 text-xs text-white/45">
                  Vincule a proposta a uma Company antes de criar o projeto.
                </p>
              </div>
            ) : loadingProject ? (
              <div className="flex items-center gap-2 text-xs text-white/45">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Verificando projeto vinculado…
              </div>
            ) : linkedProject ? (
              <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-200/80">
                  Projeto já criado
                </p>
                <p className="mt-2 text-sm font-medium text-white">{linkedProject.title}</p>
                <p className="mt-1 text-xs text-white/55">
                  {STATUS_LABELS[linkedProject.status] ?? linkedProject.status}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 w-full border-emerald-500/30 text-emerald-100 hover:bg-emerald-500/10"
                  asChild
                >
                  <Link to="/os/projetos/$id" params={{ id: linkedProject.id }}>
                    <FolderKanban className="mr-1.5 h-3.5 w-3.5" />
                    Abrir projeto
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {!createPrimary && (
                  <p className="text-xs text-white/40">
                    Disponível a qualquer momento. Após “Aprovou”, a ação fica em destaque.
                  </p>
                )}
                <Button
                  size="sm"
                  className={cn(
                    "w-full",
                    createPrimary
                      ? "bg-amber-500 text-black hover:bg-amber-400"
                      : "border border-white/15 bg-transparent text-white/80 hover:bg-white/5",
                  )}
                  variant={createPrimary ? "default" : "outline"}
                  onClick={openCreateDialog}
                >
                  <FolderKanban className="mr-1.5 h-3.5 w-3.5" />
                  Criar projeto
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="hidden border-t border-white/10 px-5 py-4 lg:block">
          <Button variant="ghost" size="sm" asChild className="text-white/60">
            <Link to="/os/propostas/$id" params={{ id: proposalId }}>
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Voltar ao editor
            </Link>
          </Button>
        </div>
      </aside>

      <Dialog open={createOpen} onOpenChange={(open) => !creating && setCreateOpen(open)}>
        <DialogContent className="border-border/60 bg-background sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Criar projeto a partir da proposta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Isso criará um novo projeto vinculado a esta proposta e à empresa{" "}
              <span className="font-medium text-foreground">{proposal.company_name}</span>.
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="project-from-proposal-title">Título do projeto</Label>
              <Input
                id="project-from-proposal-title"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                disabled={creating}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Workflow operacional</Label>
              <Select
                value={workflowSlug || "none"}
                onValueChange={(v) => setWorkflowSlug(v === "none" ? "" : v)}
                disabled={creating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sem workflow" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem workflow</SelectItem>
                  {templates.map((t) => (
                    <SelectItem key={t.id} value={t.slug}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Padrão: sem workflow. Você pode aplicar um template depois.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreateOpen(false)}
              disabled={creating}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={() => void handleCreateProject()} disabled={creating}>
              {creating ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : null}
              Confirmar criação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
