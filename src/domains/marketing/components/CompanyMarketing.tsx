import { listMarketingSnapshots } from "@/domains/marketing/api.server";
import {
  formatMoney,
  MarketingChannelBadge,
} from "@/domains/marketing/components/MarketingBadges";
import { formatPeriod } from "@/domains/marketing/types";
import { getErrorMessage, isUnauthorizedError } from "@/lib/api/client-errors";
import { Button } from "@/components/ui/button";
import { Megaphone, Plus } from "lucide-react";
import { useEffect, useState } from "react";

export function CompanyMarketing({
  companyId,
  companyName,
  onCreateClick,
  refreshKey = 0,
}: {
  companyId: string;
  companyName: string;
  onCreateClick: () => void;
  refreshKey?: number;
}) {
  const [snapshots, setSnapshots] = useState<
    Awaited<ReturnType<typeof listMarketingSnapshots>>["snapshots"]
  >([]);
  const [summary, setSummary] = useState({
    investmentCents: 0,
    leads: 0,
    conversions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    listMarketingSnapshots({
      data: { companyId, sort: "period_start", order: "desc" },
    })
      .then((result) => {
        setSnapshots(result.snapshots);
        setSummary(result.summary);
      })
      .catch((err) => {
        if (!isUnauthorizedError(err)) {
          setError(getErrorMessage(err, "Erro ao carregar marketing."));
        }
      })
      .finally(() => setLoading(false));
  }, [companyId, refreshKey]);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Carregando marketing...</p>;
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Marketing de <strong className="text-foreground">{companyName}</strong>
          <span className="ml-3">
            {formatMoney(summary.investmentCents)} · {summary.leads} leads ·{" "}
            {summary.conversions} conv.
          </span>
        </p>
        <Button size="sm" variant="outline" onClick={onCreateClick}>
          <Plus className="h-4 w-4" />
          Novo registro
        </Button>
      </div>

      {snapshots.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border/60 py-10 text-center">
          <Megaphone className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Nenhuma métrica registrada.</p>
          <Button size="sm" onClick={onCreateClick}>
            Registrar métricas
          </Button>
        </div>
      ) : (
        <ul className="divide-y divide-border/60 rounded-lg border border-border/60">
          {snapshots.map((snapshot) => (
            <li key={snapshot.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <MarketingChannelBadge channel={snapshot.channel} />
                  <span className="text-xs text-muted-foreground">
                    {formatPeriod(snapshot.period_start, snapshot.period_end)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatMoney(snapshot.investment_cents)} · {snapshot.leads ?? 0} leads ·{" "}
                  {snapshot.conversions ?? 0} conv.
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
