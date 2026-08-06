import { listCompanies } from "@/domains/companies/api.server";
import type { Company } from "@/domains/companies/types";
import type { MarketingChannel } from "@/domains/marketing/types";
import {
  MARKETING_CHANNELS,
  CHANNEL_LABELS,
  centsToFormAmount,
  getSnapshotNotes,
  parseMoneyToCents,
  parsePercent,
  type MarketingSnapshot,
} from "@/domains/marketing/types";
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
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export interface MarketingFormValues {
  companyId: string;
  channel: MarketingChannel;
  periodStart: string;
  periodEnd: string;
  investment: string;
  leads: string;
  conversions: string;
  ctr: string;
  cpc: string;
  cpa: string;
  notes: string;
}

const emptyForm: MarketingFormValues = {
  companyId: "",
  channel: "google_ads",
  periodStart: "",
  periodEnd: "",
  investment: "",
  leads: "",
  conversions: "",
  ctr: "",
  cpc: "",
  cpa: "",
  notes: "",
};

export function MarketingFormDialog({
  open,
  onOpenChange,
  initial,
  defaultCompanyId,
  onSubmit,
  title,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Partial<MarketingFormValues>;
  defaultCompanyId?: string;
  onSubmit: (values: MarketingFormValues) => Promise<void>;
  title: string;
}) {
  const [form, setForm] = useState<MarketingFormValues>({
    ...emptyForm,
    ...initial,
    companyId: initial?.companyId ?? defaultCompanyId ?? "",
  });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setForm({
      ...emptyForm,
      ...initial,
      companyId: initial?.companyId ?? defaultCompanyId ?? "",
    });
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
    if (!form.periodStart || !form.periodEnd) {
      setError("Informe o período.");
      return;
    }
    if (form.periodEnd < form.periodStart) {
      setError("A data final deve ser igual ou posterior à inicial.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await onSubmit(form);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
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

          <div className="space-y-1.5">
            <Label>Canal</Label>
            <Select
              value={form.channel}
              onValueChange={(value) =>
                setForm((f) => ({ ...f, channel: value as MarketingChannel }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MARKETING_CHANNELS.map((channel) => (
                  <SelectItem key={channel} value={channel}>
                    {CHANNEL_LABELS[channel]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Início do período</Label>
              <Input
                type="date"
                value={form.periodStart}
                onChange={(e) => setForm((f) => ({ ...f, periodStart: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Fim do período</Label>
              <Input
                type="date"
                value={form.periodEnd}
                onChange={(e) => setForm((f) => ({ ...f, periodEnd: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Investimento (R$)</Label>
              <Input
                value={form.investment}
                onChange={(e) => setForm((f) => ({ ...f, investment: e.target.value }))}
                placeholder="2500.00"
                inputMode="decimal"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Leads</Label>
              <Input
                value={form.leads}
                onChange={(e) => setForm((f) => ({ ...f, leads: e.target.value }))}
                placeholder="42"
                inputMode="numeric"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Conversões</Label>
              <Input
                value={form.conversions}
                onChange={(e) => setForm((f) => ({ ...f, conversions: e.target.value }))}
                placeholder="8"
                inputMode="numeric"
              />
            </div>
            <div className="space-y-1.5">
              <Label>CTR (%)</Label>
              <Input
                value={form.ctr}
                onChange={(e) => setForm((f) => ({ ...f, ctr: e.target.value }))}
                placeholder="3.25"
                inputMode="decimal"
              />
            </div>
            <div className="space-y-1.5">
              <Label>CPC (R$)</Label>
              <Input
                value={form.cpc}
                onChange={(e) => setForm((f) => ({ ...f, cpc: e.target.value }))}
                placeholder="4.50"
                inputMode="decimal"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>CPA (R$)</Label>
            <Input
              value={form.cpa}
              onChange={(e) => setForm((f) => ({ ...f, cpa: e.target.value }))}
              placeholder="120.00"
              inputMode="decimal"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Observações</Label>
            <Textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Campanha de remarketing, sazonalidade..."
              rows={3}
            />
          </div>

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

export function snapshotToFormValues(snapshot: MarketingSnapshot): MarketingFormValues {
  return {
    companyId: snapshot.company_id,
    channel: snapshot.channel,
    periodStart: snapshot.period_start,
    periodEnd: snapshot.period_end,
    investment: centsToFormAmount(snapshot.investment_cents),
    leads: snapshot.leads != null ? String(snapshot.leads) : "",
    conversions: snapshot.conversions != null ? String(snapshot.conversions) : "",
    ctr: snapshot.ctr != null ? String((snapshot.ctr * 100).toFixed(2)) : "",
    cpc: centsToFormAmount(snapshot.cpc_cents),
    cpa: centsToFormAmount(snapshot.cpa_cents),
    notes: getSnapshotNotes(snapshot) ?? "",
  };
}

function parseOptionalInt(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const num = Number.parseInt(trimmed, 10);
  return Number.isFinite(num) ? num : null;
}

export function formToPayload(form: MarketingFormValues) {
  return {
    companyId: form.companyId,
    channel: form.channel,
    periodStart: form.periodStart,
    periodEnd: form.periodEnd,
    investmentCents: parseMoneyToCents(form.investment),
    leads: parseOptionalInt(form.leads),
    conversions: parseOptionalInt(form.conversions),
    ctr: parsePercent(form.ctr),
    cpcCents: parseMoneyToCents(form.cpc),
    cpaCents: parseMoneyToCents(form.cpa),
    notes: form.notes.trim() || undefined,
  };
}
