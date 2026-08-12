import { listCompanies } from "@/domains/companies/api.server";
import type { Company } from "@/domains/companies/types";
import type { FinanceEntryStatus, FinanceEntryType } from "@/domains/finance/types";
import {
  FINANCE_STATUSES,
  FINANCE_TYPES,
  PAYMENT_METHODS,
  STATUS_LABELS,
  TYPE_LABELS,
  centsToFormAmount,
  formatMoney,
  parseMoneyToCents,
  type FinanceEntry,
} from "@/domains/finance/types";
import { FinanceReceiptsField } from "@/domains/finance/components/FinanceReceiptsField";
import { formatCompetenciaRange } from "@/domains/finance/recurrence-utils";
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
import { Switch } from "@/components/ui/switch";
import { Loader2, Repeat } from "lucide-react";
import { useEffect, useState } from "react";

export interface FinanceFormValues {
  companyId: string;
  type: FinanceEntryType;
  description: string;
  amount: string;
  dueDate: string;
  status: FinanceEntryStatus;
  paidAt: string;
  paymentMethod: string;
  recurring: boolean;
  recurringMonths: string;
}

const emptyForm: FinanceFormValues = {
  companyId: "",
  type: "monthly",
  description: "",
  amount: "",
  dueDate: "",
  status: "pending",
  paidAt: "",
  paymentMethod: "",
  recurring: false,
  recurringMonths: "12",
};

export function FinanceFormDialog({
  open,
  onOpenChange,
  initial,
  defaultCompanyId,
  financeEntryId,
  onSubmit,
  title,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Partial<FinanceFormValues>;
  defaultCompanyId?: string;
  financeEntryId?: string;
  onSubmit: (values: FinanceFormValues, receipts: File[]) => Promise<void>;
  title: string;
}) {
  const [form, setForm] = useState<FinanceFormValues>({
    ...emptyForm,
    ...initial,
    companyId: initial?.companyId ?? defaultCompanyId ?? "",
  });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [pendingReceipts, setPendingReceipts] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setForm({
      ...emptyForm,
      ...initial,
      companyId: initial?.companyId ?? defaultCompanyId ?? "",
    });
    setPendingReceipts([]);
    setError("");
    listCompanies({ data: { sort: "name", order: "asc" } })
      .then((result) => setCompanies(result.companies))
      .catch(() => setCompanies([]));
  }, [open, initial, defaultCompanyId]);

  const handleSubmit = async () => {
    if (!form.companyId) {
      setError("Selecione uma empresa.");
      return;
    }
    if (!form.description.trim()) {
      setError("Informe a descrição.");
      return;
    }
    if (parseMoneyToCents(form.amount) <= 0) {
      setError("Informe um valor válido.");
      return;
    }
    if (!form.dueDate) {
      setError("Informe o vencimento.");
      return;
    }
    if (form.recurring && !financeEntryId) {
      const months = Number.parseInt(form.recurringMonths, 10);
      if (!Number.isFinite(months) || months < 2 || months > 36) {
        setError("Informe entre 2 e 36 meses para a recorrência.");
        return;
      }
    }

    setLoading(true);
    setError("");
    try {
      await onSubmit(form, pendingReceipts);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  };

  const recurringPreview =
    form.recurring && form.dueDate && parseMoneyToCents(form.amount) > 0
      ? (() => {
          const months = Number.parseInt(form.recurringMonths, 10);
          if (!Number.isFinite(months) || months < 2) return null;
          return {
            months,
            total: formatMoney(parseMoneyToCents(form.amount) * months),
            range: formatCompetenciaRange(form.dueDate, months),
          };
        })()
      : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
          {!defaultCompanyId && (
            <div className="space-y-1.5">
              <Label>Empresa</Label>
              <Select
                value={form.companyId}
                onValueChange={(value) => setForm((f) => ({ ...f, companyId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <Select
                value={form.type}
                onValueChange={(value) =>
                  setForm((f) => ({ ...f, type: value as FinanceEntryType }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FINANCE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(value) =>
                  setForm((f) => ({ ...f, status: value as FinanceEntryStatus }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FINANCE_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {STATUS_LABELS[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Descrição</Label>
            <Input
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder={
                form.recurring
                  ? "Gestão Google Ads | {competencia}"
                  : "Mensalidade março, setup inicial..."
              }
            />
            {form.recurring && !financeEntryId && (
              <p className="text-xs text-muted-foreground">
                Use <code className="text-brand">{"{competencia}"}</code> para inserir o mês/ano
                automaticamente em cada lançamento.
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Valor (R$)</Label>
              <Input
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                placeholder="1500.00"
                inputMode="decimal"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Vencimento</Label>
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
              />
            </div>
          </div>

          {!financeEntryId && (
            <div className="space-y-3 rounded-lg border border-border/60 bg-surface-elevated/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <Label htmlFor="recurring-toggle" className="flex items-center gap-1.5">
                    <Repeat className="h-3.5 w-3.5" />
                    Cobrança recorrente
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Gera vários lançamentos de uma vez. Para contratos contínuos, prefira
                    cadastrar só o próximo mês.
                  </p>
                </div>
                <Switch
                  id="recurring-toggle"
                  checked={form.recurring}
                  onCheckedChange={(checked) =>
                    setForm((f) => ({
                      ...f,
                      recurring: checked,
                      type: checked ? "monthly" : f.type,
                      status: checked && f.status !== "paid" ? "pending" : f.status,
                    }))
                  }
                />
              </div>

              {form.recurring && (
                <div className="space-y-1.5">
                  <Label htmlFor="recurring-months">Quantidade de meses</Label>
                  <Input
                    id="recurring-months"
                    type="number"
                    min={2}
                    max={36}
                    value={form.recurringMonths}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, recurringMonths: e.target.value }))
                    }
                    inputMode="numeric"
                  />
                  <p className="text-xs text-muted-foreground">
                    Ideal para contratos com prazo definido. Inclui o mês do primeiro vencimento.
                  </p>
                </div>
              )}

              {recurringPreview && (
                <div className="rounded-md border border-brand/20 bg-brand-soft/20 px-3 py-2 text-xs text-muted-foreground">
                  Serão criados{" "}
                  <strong className="text-foreground">{recurringPreview.months} lançamentos</strong>{" "}
                  de {formatMoney(parseMoneyToCents(form.amount))} ({recurringPreview.total} no
                  total), de {recurringPreview.range}.
                  {form.status === "paid" && (
                    <span className="mt-1 block text-amber-200/90">
                      Apenas o primeiro mês será marcado como pago; os demais ficam pendentes.
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {form.status === "paid" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Data do pagamento</Label>
                <Input
                  type="date"
                  value={form.paidAt}
                  onChange={(e) => setForm((f) => ({ ...f, paidAt: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Forma de pagamento</Label>
                <Select
                  value={form.paymentMethod || "pix"}
                  onValueChange={(value) => setForm((f) => ({ ...f, paymentMethod: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {form.companyId && (
            <FinanceReceiptsField
              companyId={form.companyId}
              financeEntryId={financeEntryId}
              pendingFiles={pendingReceipts}
              onPendingFilesChange={setPendingReceipts}
            />
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter className="border-t border-border/40 px-6 py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={() => void handleSubmit()} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : form.recurring && !financeEntryId ? (
              "Criar cobranças"
            ) : (
              "Salvar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function financeEntryToFormValues(entry: FinanceEntry): FinanceFormValues {
  return {
    companyId: entry.company_id,
    type: entry.type,
    description: entry.description,
    amount: centsToFormAmount(entry.amount_cents),
    dueDate: entry.due_date,
    status: entry.status,
    paidAt: entry.paid_at ?? "",
    paymentMethod: entry.payment_method ?? "",
    recurring: false,
    recurringMonths: "12",
  };
}

export function formToPayload(form: FinanceFormValues) {
  const recurringMonths = Number.parseInt(form.recurringMonths, 10);
  return {
    companyId: form.companyId,
    type: form.type,
    description: form.description.trim(),
    amountCents: parseMoneyToCents(form.amount),
    dueDate: form.dueDate,
    status: form.status,
    paidAt: form.status === "paid" ? form.paidAt || undefined : undefined,
    paymentMethod: form.paymentMethod || undefined,
    recurring: form.recurring || undefined,
    recurringMonths:
      form.recurring && Number.isFinite(recurringMonths) && recurringMonths >= 2
        ? recurringMonths
        : undefined,
  };
}
