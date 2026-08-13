import {
  createContentTask,
  deleteContentTask,
  updateContentTask,
} from "@/domains/content-production/api.server";
import type {
  ContentChannel,
  ContentTaskStatus,
  ContentTaskWithCompany,
  ContentType,
} from "@/domains/content-production/types";
import {
  CHANNEL_LABELS,
  CONTENT_CHANNELS,
  CONTENT_STATUSES,
  CONTENT_TYPES,
  STATUS_LABELS,
  TYPE_LABELS,
} from "@/domains/content-production/types";
import { TEAM_LABELS, TEAM_MEMBERS, type TeamMember } from "@/lib/auth/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { LinkifiedText, textContainsUrl } from "@/lib/linkify";
import { Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export interface ContentTaskFormValues {
  title: string;
  status: ContentTaskStatus;
  channels: ContentChannel[];
  themeObjective: string;
  contentType: ContentType;
  postDate: string;
  productionOwnerId: TeamMember | "";
  companyId: string;
  notes: string;
}

const emptyForm = (defaults?: Partial<ContentTaskFormValues>): ContentTaskFormValues => ({
  title: "",
  status: "ideia",
  channels: ["instagram"],
  themeObjective: "",
  contentType: "video_curto",
  postDate: "",
  productionOwnerId: "",
  companyId: "",
  notes: "",
  ...defaults,
});

function taskToForm(task: ContentTaskWithCompany): ContentTaskFormValues {
  return {
    title: task.title,
    status: task.status,
    channels: task.channels,
    themeObjective: task.theme_objective ?? "",
    contentType: task.content_type,
    postDate: task.post_date ?? "",
    productionOwnerId: (task.production_owner_id as TeamMember) ?? "",
    companyId: task.company_id,
    notes: task.notes ?? "",
  };
}

export function ContentTaskSheet({
  open,
  onOpenChange,
  task,
  companies,
  defaultValues,
  defaultOwnerId,
  onSaved,
  onDeleted,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: ContentTaskWithCompany | null;
  companies: { id: string; name: string }[];
  defaultValues?: Partial<ContentTaskFormValues>;
  defaultOwnerId?: TeamMember;
  onSaved: () => void;
  onDeleted?: () => void;
}) {
  const isEdit = !!task;
  const [form, setForm] = useState<ContentTaskFormValues>(emptyForm());
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    if (task) {
      setForm(taskToForm(task));
    } else {
      setForm(
        emptyForm({
          productionOwnerId: defaultOwnerId ?? "",
          ...defaultValues,
        }),
      );
    }
  }, [open, task, defaultValues, defaultOwnerId]);

  const set = <K extends keyof ContentTaskFormValues>(key: K, value: ContentTaskFormValues[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Informe o título.");
      return;
    }
    if (!form.companyId) {
      setError("Selecione o cliente.");
      return;
    }
    if (form.channels.length === 0) {
      setError("Selecione ao menos um canal.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      if (isEdit && task) {
        await updateContentTask({
          data: {
            id: task.id,
            companyId: form.companyId,
            title: form.title.trim(),
            status: form.status,
            channels: form.channels,
            themeObjective: form.themeObjective,
            contentType: form.contentType,
            postDate: form.postDate,
            productionOwnerId: form.productionOwnerId || undefined,
            notes: form.notes,
          },
        });
      } else {
        await createContentTask({
          data: {
            companyId: form.companyId,
            title: form.title.trim(),
            status: form.status,
            channels: form.channels,
            themeObjective: form.themeObjective,
            contentType: form.contentType,
            postDate: form.postDate,
            productionOwnerId: form.productionOwnerId || undefined,
            notes: form.notes,
          },
        });
      }
      onSaved();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!task || !window.confirm("Excluir esta tarefa de conteúdo?")) return;
    setDeleting(true);
    setError("");
    try {
      await deleteContentTask({ data: { id: task.id, companyId: task.company_id } });
      onDeleted?.();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Editar conteúdo" : "Nova tarefa de conteúdo"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Atualize os campos — mudanças refletem no kanban e no calendário."
              : "Preencha os dados da peça. A data de postagem aparece no calendário."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 flex flex-1 flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="ct-title">Título</Label>
            <Input
              id="ct-title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Ex.: Reels — depoimento cliente"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v as ContentTaskStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={form.contentType}
                onValueChange={(v) => set("contentType", v as ContentType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Canais</Label>
            <div className="flex flex-wrap gap-x-4 gap-y-2 rounded-lg border border-border/40 bg-surface/20 p-3">
              {CONTENT_CHANNELS.map((c) => {
                const checked = form.channels.includes(c);
                return (
                  <label
                    key={c}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 text-sm",
                      checked ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(value) => {
                        setForm((prev) => {
                          if (value) {
                            return prev.channels.includes(c)
                              ? prev
                              : { ...prev, channels: [...prev.channels, c] };
                          }
                          return {
                            ...prev,
                            channels: prev.channels.filter((item) => item !== c),
                          };
                        });
                      }}
                    />
                    {CHANNEL_LABELS[c]}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ct-theme">Tema | Objetivo</Label>
            <Textarea
              id="ct-theme"
              value={form.themeObjective}
              onChange={(e) => set("themeObjective", e.target.value)}
              placeholder="Descreva o tema e o objetivo da peça..."
              rows={3}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ct-post-date">Data de postagem</Label>
              <Input
                id="ct-post-date"
                type="date"
                value={form.postDate}
                onChange={(e) => set("postDate", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Produção (responsável)</Label>
              <Select
                value={form.productionOwnerId || "none"}
                onValueChange={(v) => set("productionOwnerId", v === "none" ? "" : (v as TeamMember))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Não definido</SelectItem>
                  {TEAM_MEMBERS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {TEAM_LABELS[m]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Select value={form.companyId || "none"} onValueChange={(v) => set("companyId", v === "none" ? "" : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Selecionar...</SelectItem>
                  {companies.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ct-notes">Textos e observações</Label>
            <Textarea
              id="ct-notes"
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Roteiro, links de referência, feedback de aprovação..."
              rows={6}
              className="min-h-[140px] font-mono text-sm"
            />
            {form.notes.trim() && textContainsUrl(form.notes) && (
              <div className="rounded-lg border border-border/40 bg-surface/30 p-3">
                <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Links clicáveis
                </p>
                <LinkifiedText text={form.notes} className="text-muted-foreground" />
              </div>
            )}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border/40 pt-4">
            {isEdit && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => void handleDelete()}
                disabled={deleting || loading}
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Excluir
              </Button>
            )}
            <div className="ml-auto flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading || deleting}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isEdit ? "Salvar" : "Criar tarefa"}
              </Button>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
