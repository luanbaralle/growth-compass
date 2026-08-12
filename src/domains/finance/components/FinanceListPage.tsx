import {
  createFinanceEntry,
  deleteFinanceEntry,
  listFinanceEntries,
  markFinanceEntryPaid,
  updateFinanceEntry,
} from "@/domains/finance/api.server";
import {
  FinanceStatusBadge,
  FinanceTypeLabel,
  formatDueDate,
  formatMoney,
} from "@/domains/finance/components/FinanceBadges";
import {
  FinanceFormDialog,
  financeEntryToFormValues,
  formToPayload,
  type FinanceFormValues,
} from "@/domains/finance/components/FinanceFormDialog";
import { FinanceReceiptGeneratorDialog } from "@/domains/finance/components/FinanceReceiptGeneratorDialog";
import { uploadFinanceReceiptFiles } from "@/domains/finance/components/FinanceReceiptsField";
import type {
  FinanceEntryStatus,
  FinanceEntryType,
  FinanceEntryWithCompany,
} from "@/domains/finance/types";
import {
  FINANCE_STATUSES,
  FINANCE_TYPES,
  STATUS_LABELS,
  TYPE_LABELS,
  effectiveFinanceStatus,
} from "@/domains/finance/types";
import { getErrorMessage, isUnauthorizedError } from "@/lib/api/client-errors";
import { EmptyState, PageHeader, PageSkeleton, StatCard, OSPage, OSRefreshButton, OSPrimaryButton, FilterToolbar, FilterRow, FilterSearch, FilterPillsRow, FilterPill, OSMetricGrid, DataTable } from "@/os/ui";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link, useNavigate } from "@tanstack/react-router";
import { Check, FileText, Pencil, Repeat, Trash2, Wallet } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function FinanceListPage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<FinanceEntryWithCompany[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({ all: 0 });
  const [summary, setSummary] = useState({
    dueThisMonthCents: 0,
    overdueCents: 0,
    receivableCents: 0,
    paidThisMonthCents: 0,
    mrrCents: 0,
    mrrClientCount: 0,
    futurePendingCents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<FinanceEntryStatus | "all">("all");
  const [type, setType] = useState<FinanceEntryType | "all">("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<FinanceEntryWithCompany | null>(null);
  const [receiptEntry, setReceiptEntry] = useState<FinanceEntryWithCompany | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await listFinanceEntries({
        data: {
          search: search || undefined,
          ...(status !== "all" ? { status } : {}),
          ...(type !== "all" ? { type } : {}),
          sort: "due_date",
          order: "asc",
        },
      });
      setEntries(result.entries);
      setCounts(result.counts as Record<string, number>);
      setSummary(result.summary);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        navigate({ to: "/os/login" });
        return;
      }
      setError(getErrorMessage(err, "Erro ao carregar financeiro."));
    } finally {
      setLoading(false);
    }
  }, [search, status, type, navigate]);

  useEffect(() => {
    const timer = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [load, search]);

  const handleCreate = async (form: FinanceFormValues, receipts: File[]) => {
    const result = await createFinanceEntry({ data: formToPayload(form) });
    if (receipts.length > 0) {
      await uploadFinanceReceiptFiles(form.companyId, result.entry.id, receipts);
    }
    toast.success(
      result.createdCount > 1
        ? `${result.createdCount} cobranças criadas`
        : "Lançamento criado",
    );
    await load();
  };

  const handleEdit = async (form: FinanceFormValues, receipts: File[]) => {
    if (!editEntry) return;
    await updateFinanceEntry({
      data: { id: editEntry.id, ...formToPayload(form) },
    });
    if (receipts.length > 0) {
      await uploadFinanceReceiptFiles(form.companyId, editEntry.id, receipts);
    }
    toast.success("Lançamento atualizado");
    setEditEntry(null);
    await load();
  };

  const handleMarkPaid = async (entry: FinanceEntryWithCompany) => {
    await markFinanceEntryPaid({
      data: { id: entry.id, companyId: entry.company_id },
    });
    toast.success("Marcado como pago");
    await load();
  };

  const handleDelete = async (entry: FinanceEntryWithCompany) => {
    await deleteFinanceEntry({ data: { id: entry.id, companyId: entry.company_id } });
    toast.success("Lançamento excluído");
    await load();
  };

  return (
    <OSPage>
      <PageHeader
        title="Financeiro"
        description="Mensalidades, setup e cobranças por empresa"
        icon={Wallet}
        actions={
          <>
            <OSRefreshButton loading={loading} onClick={load} />
            <OSPrimaryButton label="Novo lançamento" onClick={() => setCreateOpen(true)} />
          </>
        }
      />

      <OSMetricGrid columns={4}>
        <StatCard
          label="MRR"
          value={formatMoney(summary.mrrCents)}
          sub={
            summary.mrrClientCount > 0
              ? `${summary.mrrClientCount} cliente(s) ativo(s)`
              : "Mensalidades recorrentes"
          }
          accent="brand"
          icon={Repeat}
        />
        <StatCard
          label="A receber"
          value={formatMoney(summary.receivableCents)}
          sub={
            summary.futurePendingCents > 0
              ? `+ ${formatMoney(summary.futurePendingCents)} agendado`
              : "Este mês + atrasados"
          }
          accent="warning"
          icon={Wallet}
        />
        <StatCard
          label="Atrasado"
          value={formatMoney(summary.overdueCents)}
          sub={`${counts.overdue ?? 0} lançamento(s)`}
          accent={summary.overdueCents ? "danger" : "warning"}
          icon={Wallet}
        />
        <StatCard
          label="Recebido no mês"
          value={formatMoney(summary.paidThisMonthCents)}
          sub="Pagamentos confirmados"
          accent="success"
          icon={Wallet}
        />
      </OSMetricGrid>

      {error && (
        <EmptyState title="Não foi possível carregar o financeiro" description={error} />
      )}

      <FilterToolbar>
        <FilterRow>
          <FilterSearch
            value={search}
            onChange={setSearch}
            placeholder="Buscar por descrição ou empresa..."
          />
          <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
            <SelectTrigger className="h-9 w-[150px] shrink-0 sm:ml-auto">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos tipos</SelectItem>
              {FINANCE_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {TYPE_LABELS[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterRow>
      </FilterToolbar>

      <FilterPillsRow>
        <FilterPill
          active={status === "all"}
          onClick={() => setStatus("all")}
          label={`Todos (${counts.all ?? 0})`}
        />
        {FINANCE_STATUSES.map((s) => (
          <FilterPill
            key={s}
            active={status === s}
            onClick={() => setStatus(s)}
            label={`${STATUS_LABELS[s]} (${counts[s] ?? 0})`}
          />
        ))}
      </FilterPillsRow>

      {loading ? (
        <PageSkeleton title="Financeiro" metricCount={0} />
      ) : error ? null : entries.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="Nenhum lançamento encontrado"
          description="Registre mensalidades, setup ou outras cobranças vinculadas às empresas."
        />
      ) : (
        <DataTable>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[150px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => {
                const displayStatus = effectiveFinanceStatus(entry);
                return (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.description}</TableCell>
                    <TableCell>
                      <Link
                        to="/os/empresas/$id"
                        params={{ id: entry.company_id }}
                        className="text-sm text-muted-foreground hover:text-brand"
                      >
                        {entry.companies?.name ?? "—"}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <FinanceTypeLabel type={entry.type} />
                    </TableCell>
                    <TableCell>{formatMoney(entry.amount_cents)}</TableCell>
                    <TableCell>
                      <span
                        className={
                          displayStatus === "overdue" ? "font-medium text-red-400" : ""
                        }
                      >
                        {formatDueDate(entry.due_date)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <FinanceStatusBadge status={displayStatus} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {displayStatus !== "paid" && displayStatus !== "cancelled" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            title="Marcar como pago"
                            onClick={() => void handleMarkPaid(entry)}
                          >
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          </Button>
                        )}
                        {displayStatus === "paid" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            title="Gerar recibo"
                            onClick={() => setReceiptEntry(entry)}
                          >
                            <FileText className="h-3.5 w-3.5 text-brand" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditEntry(entry)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost" className="text-destructive">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir lançamento?</AlertDialogTitle>
                              <AlertDialogDescription>
                                <strong>{entry.description}</strong> será removido permanentemente.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => void handleDelete(entry)}>
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </DataTable>
      )}

      <FinanceFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Novo lançamento"
        onSubmit={handleCreate}
      />

      <FinanceFormDialog
        open={!!editEntry}
        onOpenChange={(open) => !open && setEditEntry(null)}
        title="Editar lançamento"
        initial={editEntry ? financeEntryToFormValues(editEntry) : undefined}
        defaultCompanyId={editEntry?.company_id}
        financeEntryId={editEntry?.id}
        onSubmit={handleEdit}
      />

      {receiptEntry && (
        <FinanceReceiptGeneratorDialog
          open={!!receiptEntry}
          onOpenChange={(open) => !open && setReceiptEntry(null)}
          financeEntryId={receiptEntry.id}
          companyId={receiptEntry.company_id}
        />
      )}
    </OSPage>
  );
}
