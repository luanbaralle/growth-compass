import { listCompanies } from "@/domains/companies/api.server";
import type { Company } from "@/domains/companies/types";
import type { ProjectBlockedByType, ProjectPriority, ProjectStatus, ProjectType } from "@/domains/projects/types";
import {
  BLOCKED_BY_LABELS,
  PROJECT_BLOCKED_BY_TYPES,
  PROJECT_PRIORITIES,
  PROJECT_STATUSES,
  PROJECT_TYPES,
  PRIORITY_LABELS,
  STATUS_LABELS,
  TYPE_LABELS,
} from "@/domains/projects/types";
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

export interface ProjectFormValues {
  companyId: string;
  title: string;
  type: ProjectType;
  status: ProjectStatus;
  ownerId: TeamMember | "";
  priority: ProjectPriority;
  dueDate: string;
  description: string;
  blockedByType: ProjectBlockedByType | "";
  blockedByDetail: string;
  nextAction: string;
  nextActionDue: string;
}

const emptyForm: ProjectFormValues = {
  companyId: "",
  title: "",
  type: "landing_page",
  status: "pending",
  ownerId: "",
  priority: "medium",
  dueDate: "",
  description: "",
  blockedByType: "",
  blockedByDetail: "",
  nextAction: "",
  nextActionDue: "",
};

export function ProjectFormDialog({
  open,
  onOpenChange,
  initial,
  defaultCompanyId,
  onSubmit,
  title,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Partial<ProjectFormValues>;
  defaultCompanyId?: string;
  onSubmit: (values: ProjectFormValues) => Promise<void>;
  title: string;
}) {
  const [form, setForm] = useState<ProjectFormValues>({
    ...emptyForm,
    ...initial,
    companyId: initial?.companyId ?? defaultCompanyId ?? "",
  });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm({ ...emptyForm, ...initial, companyId: initial?.companyId ?? defaultCompanyId ?? "" });
      setError("");
      listCompanies({ data: { sort: "name", order: "asc" } })
        .then((r) => setCompanies(r.companies))
        .catch(() => setCompanies([]));
    }
  }, [open, initial, defaultCompanyId]);

  const set = (key: keyof ProjectFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.companyId) {
      setError("Título e empresa são obrigatórios.");
      return;
    }
    if (form.status === "blocked") {
      if (!form.blockedByType) {
        setError("Informe o motivo do bloqueio.");
        return;
      }
      if (!form.blockedByDetail.trim()) {
        setError("Descreva o bloqueio.");
        return;
      }
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
          <div className="space-y-1.5">
            <Label>Empresa *</Label>
            <Select value={form.companyId} onValueChange={(v) => set("companyId", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar empresa" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Título *</Label>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <Select value={form.type} onValueChange={(v) => set("type", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Responsável</Label>
              <Select
                value={form.ownerId || "none"}
                onValueChange={(v) => set("ownerId", v === "none" ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue />
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
              <Label>Prioridade</Label>
              <Select value={form.priority} onValueChange={(v) => set("priority", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {PRIORITY_LABELS[p]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Prazo</Label>
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) => set("dueDate", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Descrição</Label>
            <Textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-3 rounded-lg border border-border/40 bg-surface/20 p-4">
            <div>
              <p className="text-sm font-medium">Operação</p>
              <p className="text-xs text-muted-foreground">
                Próxima ação e bloqueio alimentam a Work Queue (Sprint E).
              </p>
            </div>
            <div className="space-y-1.5">
              <Label>Próxima ação</Label>
              <Input
                value={form.nextAction}
                onChange={(e) => set("nextAction", e.target.value)}
                placeholder="Ex.: Cobrar acesso ao Meta Business"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Prazo da próxima ação</Label>
              <Input
                type="date"
                value={form.nextActionDue}
                onChange={(e) => set("nextActionDue", e.target.value)}
              />
            </div>

            {form.status === "blocked" && (
              <>
                <div className="space-y-1.5">
                  <Label>Motivo do bloqueio *</Label>
                  <Select
                    value={form.blockedByType || "none"}
                    onValueChange={(v) => set("blockedByType", v === "none" ? "" : v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar motivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">—</SelectItem>
                      {PROJECT_BLOCKED_BY_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {BLOCKED_BY_LABELS[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Detalhe do bloqueio *</Label>
                  <Textarea
                    value={form.blockedByDetail}
                    onChange={(e) => set("blockedByDetail", e.target.value)}
                    placeholder="O que está impedindo o avanço?"
                    rows={2}
                  />
                </div>
              </>
            )}
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

export function projectToFormValues(project: {
  company_id: string;
  title: string;
  type: ProjectType;
  status: ProjectStatus;
  owner_id: string | null;
  priority: ProjectPriority;
  due_date: string | null;
  description: string | null;
  blocked_by_type: ProjectBlockedByType | null;
  blocked_by_detail: string | null;
  next_action: string | null;
  next_action_due: string | null;
}): ProjectFormValues {
  return {
    companyId: project.company_id,
    title: project.title,
    type: project.type,
    status: project.status,
    ownerId: (project.owner_id as TeamMember) ?? "",
    priority: project.priority,
    dueDate: project.due_date ?? "",
    description: project.description ?? "",
    blockedByType: project.blocked_by_type ?? "",
    blockedByDetail: project.blocked_by_detail ?? "",
    nextAction: project.next_action ?? "",
    nextActionDue: project.next_action_due ?? "",
  };
}

export function formToPayload(form: ProjectFormValues) {
  return {
    companyId: form.companyId,
    title: form.title.trim(),
    type: form.type,
    status: form.status,
    ownerId: form.ownerId || undefined,
    priority: form.priority,
    dueDate: form.dueDate || undefined,
    description: form.description.trim() || undefined,
    blockedByType: form.status === "blocked" ? form.blockedByType || null : null,
    blockedByDetail:
      form.status === "blocked" ? form.blockedByDetail.trim() || null : null,
    nextAction: form.nextAction.trim() || undefined,
    nextActionDue: form.nextActionDue || undefined,
  };
}
