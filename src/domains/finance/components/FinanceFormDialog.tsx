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
  parseMoneyToCents,
  type FinanceEntry,
} from "@/domains/finance/types";
import { FinanceReceiptsField } from "@/domains/finance/components/FinanceReceiptsField";
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
import { Loader2 } from "lucide-react";
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
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
              placeholder="Mensalidade março, setup inicial..."
            />
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

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={() => void handleSubmit()} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
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
  };
}

export function formToPayload(form: FinanceFormValues) {
  return {
    companyId: form.companyId,
    type: form.type,
    description: form.description.trim(),
    amountCents: parseMoneyToCents(form.amount),
    dueDate: form.dueDate,
    status: form.status,
    paidAt: form.status === "paid" ? form.paidAt || undefined : undefined,
    paymentMethod: form.paymentMethod || undefined,
  };
}
