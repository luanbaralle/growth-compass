import { createSessionAndNavigate } from "@/domains/copilot/components/CopilotSessionPage";
import { listRecentCopilotSessions } from "@/domains/copilot/api.server";
import { OSPage, PageHeader } from "@/os/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getErrorMessage } from "@/lib/api/client-errors";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { FileText, Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type RecentSession = Awaited<ReturnType<typeof listRecentCopilotSessions>>[number];

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

export function CopilotLandingPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/os/copilot/" });
  const [prospectName, setProspectName] = useState(search.prospectName ?? "Angélica");
  const [companyName, setCompanyName] = useState(search.companyName ?? "Saúde & Cia");
  const [starting, setStarting] = useState(false);
  const [recent, setRecent] = useState<RecentSession[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(true);

  useEffect(() => {
    void listRecentCopilotSessions()
      .then(setRecent)
      .catch(() => setRecent([]))
      .finally(() => setLoadingRecent(false));
  }, []);

  const handleStart = async () => {
    setStarting(true);
    try {
      await createSessionAndNavigate(
        (opts) => navigate(opts),
        {
          prospectName,
          companyName,
          prospectId: search.prospectId,
        },
      );
    } catch (err) {
      toast.error(getErrorMessage(err, "Erro ao iniciar sessão."));
    } finally {
      setStarting(false);
    }
  };

  return (
    <OSPage className="max-w-lg">
      <PageHeader
        title="Raise One Copilot"
        description="Copiloto de diagnóstico comercial. Conduz você — não a reunião."
      />

      <div className="mt-8 space-y-6 rounded-xl border border-border/50 bg-muted/10 p-6">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Sparkles className="h-5 w-5" />
          <p className="text-sm">
            Modo: <strong className="text-foreground">Discovery / Qualificação</strong>
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="prospect">Nome do prospect</Label>
            <Input
              id="prospect"
              value={prospectName}
              onChange={(e) => setProspectName(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="company">Empresa</Label>
            <Input
              id="company"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>

        <Button className="w-full" onClick={() => void handleStart()} disabled={starting}>
          {starting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Iniciar sessão
        </Button>
      </div>

      <section className="mt-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Reuniões recentes
        </p>
        {loadingRecent ? (
          <p className="mt-3 text-sm text-muted-foreground">Carregando…</p>
        ) : recent.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">Nenhuma sessão ainda.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {recent.map((s) => (
              <li key={s.id}>
                <Link
                  to="/os/copilot/$sessionId"
                  params={{ sessionId: s.id }}
                  className="flex items-center justify-between rounded-lg border border-border/40 px-4 py-3 text-sm transition-colors hover:bg-muted/30"
                >
                  <div>
                    <p className="font-medium text-foreground/90">{s.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatSessionDate(s.endedAt ?? s.startedAt)}
                      {s.status === "completed" ? " · encerrada" : " · ao vivo"}
                    </p>
                  </div>
                  {s.status === "completed" && (
                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </OSPage>
  );
}
