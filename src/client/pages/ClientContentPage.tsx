import {
  approveClientContent,
  getClientContent,
  listClientContent,
  requestClientContentRevision,
} from "@/client/content.functions";
import { ClientEmptyState } from "@/client/components/ClientEmptyState";
import { ClientFilterPills } from "@/client/components/ClientFilterPills";
import { ClientPageHeader } from "@/client/components/ClientPageHeader";
import { ClientPageSkeleton } from "@/client/components/ClientPageSkeleton";
import { ClientSection } from "@/client/components/ClientSection";
import { ContentPublicationChannelPreview } from "@/domains/content-production/components/ContentPublicationPreview";
import { TYPE_LABELS } from "@/domains/content-production/types";
import type { ClientContentListItem } from "@/domains/client-portal/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check, Clapperboard, Loader2, MessageSquare } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type ContentFilter = "all" | "approval" | "production" | "published";

const FILTERS: { id: ContentFilter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "approval", label: "Aguardando aprovação" },
  { id: "production", label: "Em produção" },
  { id: "published", label: "Publicados" },
];

function matchesFilter(item: ClientContentListItem, filter: ContentFilter): boolean {
  if (filter === "all") return true;
  if (filter === "approval") return item.status === "aprovacao";
  if (filter === "published") return item.status === "publicado";
  return ["definicao", "agendamento", "gravacao", "edicao", "correcao", "aprovado", "programado"].includes(
    item.status,
  );
}

export function ClientConteudoPage() {
  const [filter, setFilter] = useState<ContentFilter>("all");
  const { data, isLoading } = useQuery({
    queryKey: ["client-content-list"],
    queryFn: () => listClientContent(),
  });

  const items = useMemo(
    () => (data ?? []).filter((item) => matchesFilter(item, filter)),
    [data, filter],
  );

  return (
    <div className="client-page space-y-6">
      <ClientPageHeader
        eyebrow="Pipeline de conteúdo"
        title="Conteúdo"
        description="Acompanhe peças em produção, aprove materiais e veja o que já foi publicado."
      />

      <ClientFilterPills options={FILTERS} value={filter} onChange={setFilter} />

      {isLoading ? (
        <ClientPageSkeleton />
      ) : items.length === 0 ? (
        <ClientEmptyState
          icon={Clapperboard}
          title="Nenhum conteúdo neste filtro"
          description="Experimente outro filtro ou volte em breve — novas peças entram no pipeline assim que forem iniciadas."
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                to="/client/conteudo/$taskId"
                params={{ taskId: item.id }}
                className="client-content-card"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{item.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.contentTypeLabel} · {item.channelsLabel}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "client-status-chip",
                      item.canApprove ? "client-status-chip-amber" : "client-status-chip-muted",
                    )}
                  >
                    {item.statusLabel}
                  </span>
                </div>
                {item.canApprove && (
                  <p className="client-action-cta mt-3">Revisar agora →</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ClientContentDetailPage({ taskId }: { taskId: string }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [revisionOpen, setRevisionOpen] = useState(false);
  const [revisionMessage, setRevisionMessage] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["client-content", taskId],
    queryFn: () => getClientContent({ data: { taskId } }),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["client-content-list"] });
    queryClient.invalidateQueries({ queryKey: ["client-content", taskId] });
    queryClient.invalidateQueries({ queryKey: ["client-home"] });
  };

  const approveMutation = useMutation({
    mutationFn: () => approveClientContent({ data: { taskId } }),
    onSuccess: () => {
      toast.success("Conteúdo aprovado. Obrigado!");
      invalidate();
      navigate({ to: "/client/conteudo" });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Erro ao aprovar."),
  });

  const revisionMutation = useMutation({
    mutationFn: () =>
      requestClientContentRevision({ data: { taskId, message: revisionMessage } }),
    onSuccess: () => {
      toast.success("Solicitação enviada. A Raise One vai revisar.");
      setRevisionOpen(false);
      setRevisionMessage("");
      invalidate();
      navigate({ to: "/client/conteudo" });
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Erro ao enviar solicitação."),
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando…</p>;
  }

  if (error || !data) {
    return (
      <div className="client-panel space-y-3">
        <p className="text-sm text-muted-foreground">Conteúdo não encontrado.</p>
        <Link to="/client/conteudo" className="text-sm text-primary hover:underline">
          Voltar
        </Link>
      </div>
    );
  }

  return (
    <div className="client-page space-y-6">
      <Link
        to="/client/conteudo"
        className="client-text-link inline-flex items-center gap-1"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Voltar ao pipeline
      </Link>

      <header className="space-y-2">
        <span className="client-status-chip client-status-chip-muted">{data.statusLabel}</span>
        <h1 className="client-page-title">{data.title}</h1>
        <p className="client-page-desc">
          {TYPE_LABELS[data.contentType]} · {data.channelsLabel}
        </p>
      </header>

      <ClientSection title="Preview" icon={Clapperboard}>
        <ContentPublicationChannelPreview
          channel={data.previewChannel}
          contentType={data.contentType}
          companyName={data.companyName}
          title={data.title}
          briefingCaption={data.briefingCaption}
          mediaUrl={data.previewMediaUrl}
          mediaMimeType={data.previewMimeType}
        />
      </ClientSection>

      <ClientSection title="Detalhes da peça">
        <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Legenda
          </h3>
          <p className="mt-2 whitespace-pre-wrap text-sm">{data.briefingCaption || "—"}</p>
        </div>
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            CTA
          </h3>
          <p className="mt-2 text-sm">{data.briefingCta || "—"}</p>
        </div>
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Canais
          </h3>
          <p className="mt-2 text-sm">{data.channels.map((c) => c.label).join(" · ")}</p>
        </div>
        {data.raiseOneNote && (
          <div className="sm:col-span-2">
            <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Observação da Raise One
            </h3>
            <blockquote className="mt-2 border-l-2 border-primary/40 pl-3 text-sm italic text-foreground/90">
              {data.raiseOneNote}
            </blockquote>
          </div>
        )}
        </div>
      </ClientSection>

      {data.canApprove ? (
        <ClientSection title="Está tudo certo?" iconTone="amber" icon={Check}>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => approveMutation.mutate()}
              disabled={approveMutation.isPending || revisionMutation.isPending}
              className="gap-2"
            >
              {approveMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Aprovar
            </Button>
            <Button
              variant="outline"
              onClick={() => setRevisionOpen(true)}
              disabled={approveMutation.isPending || revisionMutation.isPending}
              className="gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Solicitar alteração
            </Button>
          </div>
        </ClientSection>
      ) : data.clientApprovedBy ? (
        <p className="text-sm text-muted-foreground">
          Aprovado por {data.clientApprovedBy}
          {data.clientApprovedAt
            ? ` em ${new Date(data.clientApprovedAt).toLocaleDateString("pt-BR")}`
            : ""}
          .
        </p>
      ) : null}

      <Dialog open={revisionOpen} onOpenChange={setRevisionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar alteração</DialogTitle>
            <DialogDescription>O que precisamos ajustar neste conteúdo?</DialogDescription>
          </DialogHeader>
          <Textarea
            value={revisionMessage}
            onChange={(e) => setRevisionMessage(e.target.value)}
            placeholder="Descreva o ajuste necessário…"
            rows={5}
            className="resize-none"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevisionOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => revisionMutation.mutate()}
              disabled={revisionMutation.isPending || revisionMessage.trim().length < 3}
            >
              {revisionMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
