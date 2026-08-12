import {
  listFinanceEntries,
  markFinanceEntryPaid,
} from "@/domains/finance/api.server";
import {
  FinanceStatusBadge,
  formatDueDate,
  formatMoney,
} from "@/domains/finance/components/FinanceBadges";
import { FinanceReceiptGeneratorDialog } from "@/domains/finance/components/FinanceReceiptGeneratorDialog";
import { effectiveFinanceStatus } from "@/domains/finance/types";
import { getErrorMessage, isUnauthorizedError } from "@/lib/api/client-errors";
import { Button } from "@/components/ui/button";
import { Check, FileText, Plus, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function CompanyFinance({
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
  const [entries, setEntries] = useState<
    Awaited<ReturnType<typeof listFinanceEntries>>["entries"]
  >([]);
  const [summary, setSummary] = useState({
    receivableCents: 0,
    overdueCents: 0,
    paidThisMonthCents: 0,
    mrrCents: 0,
    futurePendingCents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [receiptEntryId, setReceiptEntryId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError("");
    listFinanceEntries({
      data: { companyId, sort: "due_date", order: "asc" },
    })
      .then((result) => {
        setEntries(result.entries);
        setSummary(result.summary);
      })
      .catch((err) => {
        if (!isUnauthorizedError(err)) {
          setError(getErrorMessage(err, "Erro ao carregar financeiro."));
        }
      })
      .finally(() => setLoading(false));
  }, [companyId, refreshKey]);

  const handleMarkPaid = async (entryId: string) => {
    await markFinanceEntryPaid({ data: { id: entryId, companyId } });
    toast.success("Marcado como pago");
    const result = await listFinanceEntries({
      data: { companyId, sort: "due_date", order: "asc" },
    });
    setEntries(result.entries);
    setSummary(result.summary);
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Carregando financeiro...</p>;
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          Financeiro de <strong className="text-foreground">{companyName}</strong>
          {summary.mrrCents > 0 && (
            <span className="ml-3">MRR: {formatMoney(summary.mrrCents)}</span>
          )}
          <span className="ml-3">
            A receber: {formatMoney(summary.receivableCents)}
          </span>
          {summary.futurePendingCents > 0 && (
            <span className="ml-3 text-muted-foreground/80">
              ({formatMoney(summary.futurePendingCents)} agendado)
            </span>
          )}
        </div>
        <Button size="sm" variant="outline" onClick={onCreateClick}>
          <Plus className="h-4 w-4" />
          Novo lançamento
        </Button>
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border/60 py-10 text-center">
          <Wallet className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Nenhum lançamento para esta empresa.</p>
          <Button size="sm" onClick={onCreateClick}>
            Registrar cobrança
          </Button>
        </div>
      ) : (
        <ul className="divide-y divide-border/60 rounded-lg border border-border/60">
          {entries.map((entry) => {
            const displayStatus = effectiveFinanceStatus(entry);
            return (
              <li
                key={entry.id}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="font-medium">{entry.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatMoney(entry.amount_cents)} · {formatDueDate(entry.due_date)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <FinanceStatusBadge status={displayStatus} />
                  {displayStatus !== "paid" && displayStatus !== "cancelled" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      title="Marcar como pago"
                      onClick={() => void handleMarkPaid(entry.id)}
                    >
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    </Button>
                  )}
                  {displayStatus === "paid" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      title="Gerar recibo"
                      onClick={() => setReceiptEntryId(entry.id)}
                    >
                      <FileText className="h-3.5 w-3.5 text-brand" />
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {receiptEntryId && (
        <FinanceReceiptGeneratorDialog
          open={!!receiptEntryId}
          onOpenChange={(open) => !open && setReceiptEntryId(null)}
          financeEntryId={receiptEntryId}
          companyId={companyId}
        />
      )}
    </div>
  );
}
