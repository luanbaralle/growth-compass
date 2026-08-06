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
import { EmptyState, PageHeader, PageSkeleton, StatCard, OSPage, OSRefreshButton, OSPrimaryButton, FilterToolbar, FilterPill, DataTable } from "@/os/ui";
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
import { Input } from "@/components/ui/input";
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
import { Check, Pencil, Search, Trash2, Wallet } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function FinanceListPage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<FinanceEntryWithCompany[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({ all: 0 });
  const [summary, setSummary] = useState({
    pendingCents: 0,
    overdueCents: 0,
    paidThisMonthCents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<FinanceEntryStatus | "all">("all");
  const [type, setType] = useState<FinanceEntryType | "all">("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<FinanceEntryWithCompany | null>(null);
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
    const entry = await createFinanceEntry({ data: formToPayload(form) });
    if (receipts.length > 0) {
      await uploadFinanceReceiptFiles(form.companyId, entry.id, receipts);
    }
    toast.success("Lançamento criado");
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

      <section className="grid gap-3 sm:grid-cols-3">
        <StatCard
          label="A receber"
          value={formatMoney(summary.pendingCents)}
          sub="Pendentes"
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
      </section>

      {error && (
        <EmptyState title="Não foi possível carregar o financeiro" description={error} />
      )}

      <FilterToolbar>
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
          <Input
            className="pl-9"
            placeholder="Buscar por descrição ou empresa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
          <SelectTrigger className="w-[150px]">
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
      </FilterToolbar>

      <div className="flex flex-wrap gap-2">
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
      </div>

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
                <TableHead className="w-[120px]" />
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
    </OSPage>
  );
}
