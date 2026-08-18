import { createSessionAndNavigate } from "@/domains/copilot/components/CopilotSessionPage";
import { deleteCopilotSession, listRecentCopilotSessions } from "@/domains/copilot/api.server";
import { getErrorMessage } from "@/lib/api/client-errors";
import { cn } from "@/lib/utils";
import { EmptyState, OSPage, PageHeader, StatCard } from "@/os/ui";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock,
  Loader2,
  Presentation,
  Search,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type RecentSession = Awaited<ReturnType<typeof listRecentCopilotSessions>>[number];
type StatusFilter = "all" | "completed" | "live" | "cancelled";

function formatElapsed(seconds: number): string {
  if (seconds <= 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}min ${s > 0 ? `${s}s` : ""}`.trim() : `${s}s`;
}

function formatSessionDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function dateGroupLabel(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - 7);

  if (date >= startOfToday) return "Hoje";
  if (date >= startOfYesterday) return "Ontem";
  if (date >= startOfWeek) return "Esta semana";
  return "Anteriores";
}

function companyInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
}

function statusConfig(status: RecentSession["status"]) {
  switch (status) {
    case "completed":
      return {
        label: "Encerrada",
        className: "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      };
    case "live":
      return {
        label: "Ao vivo",
        className: "border-red-500/25 bg-red-500/10 text-red-500 animate-pulse",
      };
    case "processing":
      return {
        label: "Processando",
        className: "border-amber-500/25 bg-amber-500/10 text-amber-600",
      };
    case "cancelled":
      return {
        label: "Cancelada",
        className: "border-border/50 bg-muted/30 text-muted-foreground",
      };
    default:
      return { label: status, className: "border-border/50 text-muted-foreground" };
  }
}

function SessionStatusBadge({ status }: { status: RecentSession["status"] }) {
  const config = statusConfig(status);
  return (
    <Badge variant="outline" className={cn("shrink-0 text-[10px] font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}

function SessionRow({
  session,
  onDelete,
  deleting,
}: {
  session: RecentSession;
  onDelete: (session: RecentSession) => void;
  deleting: boolean;
}) {
  return (
    <div className="group flex items-stretch gap-3 rounded-xl border border-border/40 bg-card/40 p-3 transition-colors hover:border-border/70 hover:bg-card/80 sm:p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 text-sm font-semibold text-amber-600 dark:text-amber-400">
        {companyInitials(session.companyName)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{session.companyName}</p>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <User className="h-3 w-3" />
                {session.prospectName}
              </span>
              <span>·</span>
              <span>{formatSessionDate(session.endedAt ?? session.startedAt)}</span>
            </p>
          </div>
          <SessionStatusBadge status={session.status} />
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          {session.status === "completed" && session.overallCoverage > 0 && (
            <span className="rounded-md bg-muted/50 px-2 py-0.5 text-[11px] text-muted-foreground">
              Diagnóstico {session.overallCoverage}%
            </span>
          )}
          {session.elapsedSeconds > 0 && (
            <span className="inline-flex items-center gap-1 rounded-md bg-muted/50 px-2 py-0.5 text-[11px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatElapsed(session.elapsedSeconds)}
            </span>
          )}
          {session.proposalId && (
            <Badge variant="outline" className="border-amber-500/20 text-[10px] text-amber-700 dark:text-amber-300">
              Proposta {session.proposalStatus === "published" ? "publicada" : "rascunho"}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end justify-between gap-2">
        <div className="flex items-center gap-1">
          {session.proposalId && session.status === "completed" && (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" asChild>
              <Link
                to="/os/propostas/$id/apresentacao"
                params={{ id: session.proposalId }}
                title="Apresentar proposta"
              >
                <Presentation className="h-4 w-4" />
              </Link>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground opacity-60 hover:text-destructive group-hover:opacity-100"
            disabled={deleting || session.status === "processing"}
            onClick={() => onDelete(session)}
            title="Excluir sessão"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
        <Button variant="secondary" size="sm" className="h-8 gap-1.5 px-3 text-xs" asChild>
          <Link to="/os/copilot/$sessionId" params={{ sessionId: session.id }}>
            Abrir
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function CopilotLandingPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/os/copilot/" });
  const [prospectName, setProspectName] = useState(search.prospectName ?? "");
  const [companyName, setCompanyName] = useState(search.companyName ?? "");
  const [starting, setStarting] = useState(false);
  const [recent, setRecent] = useState<RecentSession[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [hideCancelled, setHideCancelled] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<RecentSession | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadRecent = useCallback(async () => {
    setLoadingRecent(true);
    try {
      const rows = await listRecentCopilotSessions();
      setRecent(rows);
    } catch {
      setRecent([]);
    } finally {
      setLoadingRecent(false);
    }
  }, []);

  useEffect(() => {
    void loadRecent();
  }, [loadRecent]);

  const stats = useMemo(() => {
    const completed = recent.filter((s) => s.status === "completed").length;
    const withProposal = recent.filter((s) => s.proposalId).length;
    const live = recent.filter((s) => s.status === "live").length;
    return { total: recent.length, completed, withProposal, live };
  }, [recent]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recent.filter((session) => {
      if (hideCancelled && session.status === "cancelled") return false;
      if (statusFilter !== "all" && session.status !== statusFilter) return false;
      if (!q) return true;
      return (
        session.companyName.toLowerCase().includes(q) ||
        session.prospectName.toLowerCase().includes(q) ||
        session.title.toLowerCase().includes(q)
      );
    });
  }, [recent, query, statusFilter, hideCancelled]);

  const grouped = useMemo(() => {
    const groups = new Map<string, RecentSession[]>();
    for (const session of filtered) {
      const label = dateGroupLabel(session.startedAt);
      const list = groups.get(label) ?? [];
      list.push(session);
      groups.set(label, list);
    }
    const order = ["Hoje", "Ontem", "Esta semana", "Anteriores"];
    return order
      .filter((label) => groups.has(label))
      .map((label) => ({ label, sessions: groups.get(label)! }));
  }, [filtered]);

  const handleStart = async () => {
    const prospect = prospectName.trim();
    const company = companyName.trim();
    if (!prospect || !company) {
      toast.error("Informe o nome do prospect e da empresa.");
      return;
    }
    setStarting(true);
    try {
      await createSessionAndNavigate(
        (opts) => navigate(opts),
        {
          prospectName: prospect,
          companyName: company,
          prospectId: search.prospectId,
        },
      );
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao iniciar sessão."));
    } finally {
      setStarting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    try {
      await deleteCopilotSession({ data: { sessionId: deleteTarget.id } });
      setRecent((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      toast.success("Sessão excluída.");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao excluir sessão."));
    } finally {
      setDeletingId(null);
    }
  };

  const filterPills: Array<{ id: StatusFilter; label: string; count: number }> = [
    { id: "all", label: "Todas", count: recent.filter((s) => !hideCancelled || s.status !== "cancelled").length },
    { id: "completed", label: "Encerradas", count: recent.filter((s) => s.status === "completed").length },
    { id: "live", label: "Ao vivo", count: recent.filter((s) => s.status === "live").length },
    { id: "cancelled", label: "Canceladas", count: recent.filter((s) => s.status === "cancelled").length },
  ];

  return (
    <OSPage>
      <PageHeader
        title="Raise One Copilot"
        description="Copiloto de diagnóstico comercial em tempo real — conduz você, não a reunião."
        icon={Sparkles}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,360px)_1fr] xl:items-start">
        <aside className="space-y-5 xl:sticky xl:top-6">
          <div className="overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-b from-amber-500/[0.07] to-transparent shadow-sm">
            <div className="border-b border-border/40 px-5 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
                Nova reunião
              </p>
              <h2 className="mt-1 text-lg font-semibold">Discovery / Qualificação</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Capture o negócio ao vivo. Ao encerrar, o Copilot gera diagnóstico e rascunho de proposta.
              </p>
            </div>

            <div className="space-y-4 px-5 py-5">
              <div className="space-y-1.5">
                <Label htmlFor="prospect" className="text-xs text-muted-foreground">
                  Nome do prospect
                </Label>
                <Input
                  id="prospect"
                  value={prospectName}
                  onChange={(e) => setProspectName(e.target.value)}
                  placeholder="Ex.: Angélica"
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="company" className="text-xs text-muted-foreground">
                  Empresa
                </Label>
                <Input
                  id="company"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Ex.: Saúde & Cia"
                  className="h-10"
                />
              </div>
              <Button
                className="h-11 w-full bg-amber-500 text-black hover:bg-amber-400"
                onClick={() => void handleStart()}
                disabled={starting}
              >
                {starting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Iniciar sessão
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Total" value={String(stats.total)} />
            <StatCard label="Encerradas" value={String(stats.completed)} />
            <StatCard label="Com proposta" value={String(stats.withProposal)} />
            <StatCard label="Ao vivo" value={String(stats.live)} />
          </div>
        </aside>

        <section className="min-w-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold">Histórico de reuniões</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {filtered.length} de {recent.length} sessões
              </p>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar empresa ou prospect..."
                className="h-10 pl-9"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {filterPills.map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => {
                  setStatusFilter(pill.id);
                  if (pill.id === "cancelled") setHideCancelled(false);
                }}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  statusFilter === pill.id
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                    : "border-border/50 text-muted-foreground hover:border-border hover:text-foreground",
                )}
              >
                {pill.label}
                <span className="ml-1.5 tabular-nums opacity-60">{pill.count}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setHideCancelled((v) => !v)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                hideCancelled
                  ? "border-border/50 text-muted-foreground"
                  : "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300",
              )}
            >
              {hideCancelled ? "Canceladas ocultas" : "Mostrando canceladas"}
            </button>
          </div>

          <div className="mt-5">
            {loadingRecent ? (
              <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border/50 py-16 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Carregando reuniões…
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState
                title={recent.length === 0 ? "Nenhuma reunião ainda" : "Nenhum resultado"}
                description={
                  recent.length === 0
                    ? "Inicie sua primeira sessão de qualificação comercial."
                    : "Ajuste os filtros ou a busca para encontrar uma sessão."
                }
              />
            ) : (
              <div className="space-y-6">
                {grouped.map((group) => (
                  <div key={group.label}>
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/55">
                      {group.label}
                    </p>
                    <div className="space-y-2">
                      {group.sessions.map((session) => (
                        <SessionRow
                          key={session.id}
                          session={session}
                          deleting={deletingId === session.id}
                          onDelete={setDeleteTarget}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <AlertDialog open={deleteTarget != null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir reunião?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget ? (
                <>
                  <strong>{deleteTarget.companyName}</strong> · {deleteTarget.prospectName}
                  <br />
                  Transcript, diagnóstico e artifact serão removidos permanentemente.
                  {deleteTarget.proposalId
                    ? " A proposta vinculada permanece, mas perde o link com esta sessão."
                    : null}
                </>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault();
                void handleDelete();
              }}
            >
              Excluir sessão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </OSPage>
  );
}
