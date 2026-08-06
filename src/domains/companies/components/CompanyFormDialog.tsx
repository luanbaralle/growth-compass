import type { CompanyStage } from "@/domains/companies/types";
import { COMPANY_STAGES, STAGE_LABELS } from "@/domains/companies/types";
import { TEAM_LABELS, type TeamMember } from "@/lib/auth/types";
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

export interface CompanyFormValues {
  name: string;
  legal_name: string;
  cnpj: string;
  city: string;
  city_state: string;
  responsible_id: TeamMember | "";
  whatsapp: string;
  email: string;
  website: string;
  origin: string;
  segment: string;
  stage: CompanyStage;
  notes: string;
}

const emptyForm: CompanyFormValues = {
  name: "",
  legal_name: "",
  cnpj: "",
  city: "",
  city_state: "",
  responsible_id: "",
  whatsapp: "",
  email: "",
  website: "",
  origin: "",
  segment: "",
  stage: "lead",
  notes: "",
};

export function CompanyFormDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
  title,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Partial<CompanyFormValues>;
  onSubmit: (values: CompanyFormValues) => Promise<void>;
  title: string;
}) {
  const [form, setForm] = useState<CompanyFormValues>({ ...emptyForm, ...initial });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm({ ...emptyForm, ...initial });
      setError("");
    }
  }, [open, initial]);

  const set = (key: keyof CompanyFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Nome é obrigatório.");
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Nome *</Label>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>Razão social</Label>
              <Input value={form.legal_name} onChange={(e) => set("legal_name", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>CNPJ</Label>
              <Input value={form.cnpj} onChange={(e) => set("cnpj", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Cidade</Label>
              <Input value={form.city} onChange={(e) => set("city", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>UF</Label>
              <Input value={form.city_state} onChange={(e) => set("city_state", e.target.value)} maxLength={2} />
            </div>
            <div className="space-y-1.5">
              <Label>WhatsApp</Label>
              <Input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Site</Label>
              <Input value={form.website} onChange={(e) => set("website", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Origem</Label>
              <Input value={form.origin} onChange={(e) => set("origin", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Segmento</Label>
              <Input value={form.segment} onChange={(e) => set("segment", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Responsável</Label>
              <Select
                value={form.responsible_id || "none"}
                onValueChange={(v) => set("responsible_id", v === "none" ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">—</SelectItem>
                  {(Object.keys(TEAM_LABELS) as TeamMember[]).map((m) => (
                    <SelectItem key={m} value={m}>
                      {TEAM_LABELS[m]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Estágio</Label>
              <Select value={form.stage} onValueChange={(v) => set("stage", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMPANY_STAGES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STAGE_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Observações</Label>
              <Textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                rows={3}
              />
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function companyToFormValues(company: {
  name: string;
  legal_name: string | null;
  cnpj: string | null;
  city: string | null;
  city_state: string | null;
  responsible_id: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  origin: string | null;
  segment: string | null;
  stage: CompanyStage;
  notes: string | null;
}): CompanyFormValues {
  return {
    name: company.name,
    legal_name: company.legal_name ?? "",
    cnpj: company.cnpj ?? "",
    city: company.city ?? "",
    city_state: company.city_state ?? "",
    responsible_id: (company.responsible_id as TeamMember) ?? "",
    whatsapp: company.whatsapp ?? "",
    email: company.email ?? "",
    website: company.website ?? "",
    origin: company.origin ?? "",
    segment: company.segment ?? "",
    stage: company.stage,
    notes: company.notes ?? "",
  };
}

export function formToPayload(form: CompanyFormValues) {
  return {
    name: form.name.trim(),
    legal_name: form.legal_name.trim() || undefined,
    cnpj: form.cnpj.trim() || undefined,
    city: form.city.trim() || undefined,
    city_state: form.city_state.trim() || undefined,
    responsible_id: form.responsible_id || undefined,
    whatsapp: form.whatsapp.trim() || undefined,
    email: form.email.trim() || undefined,
    website: form.website.trim() || undefined,
    origin: form.origin.trim() || undefined,
    segment: form.segment.trim() || undefined,
    stage: form.stage,
    notes: form.notes.trim() || undefined,
  };
}
