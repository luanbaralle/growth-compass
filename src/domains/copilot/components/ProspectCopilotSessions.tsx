import { listProspectCopilotSessions } from "@/domains/copilot/api.server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { FileText, Loader2, Plus, Sparkles } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type ProspectSession = Awaited<ReturnType<typeof listProspectCopilotSessions>>[number];

function formatDate(iso: string | null): string {
  if (!iso) return "—";
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

function statusBadge(status: string) {
  if (status === "completed") {
    return (
      <Badge variant="outline" className="border-emerald-500/25 text-emerald-600 dark:text-emerald-400">
        Encerrada
      </Badge>
    );
  }
  if (status === "live") {
    return (
      <Badge variant="outline" className="border-red-500/25 text-red-500">
        Ao vivo
      </Badge>
    );
  }
  if (status === "processing") {
    return (
      <Badge variant="outline" className="border-amber-500/25 text-amber-600">
        Processando
      </Badge>
    );
  }
  return <Badge variant="secondary">{status}</Badge>;
}

export function ProspectCopilotSessions({
  prospectId,
  prospectName,
  companyName,
}: {
  prospectId: string;
  prospectName: string;
  companyName?: string;
}) {
  const [sessions, setSessions] = useState<ProspectSession[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await listProspectCopilotSessions({ data: { prospectId } });
      setSessions(rows);
    } catch {
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, [prospectId]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500/80" />
            <CardTitle className="text-sm font-semibold">Reuniões Copilot</CardTitle>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Qualificação e diagnóstico com transcript
          </p>
        </div>
        <Button size="sm" variant="outline" asChild>
          <Link
            to="/os/copilot"
            search={{
              prospectId,
              prospectName,
              companyName: companyName ?? prospectName,
            }}
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            Nova
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Carregando…
          </div>
        ) : sessions.length === 0 ? (
          <p className="py-2 text-sm text-muted-foreground">
            Nenhuma reunião registrada. Inicie uma sessão Copilot para este prospect.
          </p>
        ) : (
          <ul className="space-y-2">
            {sessions.map((s) => (
              <li key={s.id}>
                <Link
                  to="/os/copilot/$sessionId"
                  params={{ sessionId: s.id }}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border/40 px-3 py-2.5 transition-colors hover:bg-muted/25"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground/90">{s.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(s.endedAt ?? s.startedAt)}
                      {s.overallCoverage != null ? ` · ${s.overallCoverage}% coverage` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {statusBadge(s.status)}
                    {s.status === "completed" && (
                      <FileText className="h-4 w-4 text-muted-foreground/60" />
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
