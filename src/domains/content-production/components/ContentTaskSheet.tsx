import {
  createContentTask,
  deleteContentTask,
  updateContentTask,
} from "@/domains/content-production/api.server";
import { duplicateContentTask } from "@/domains/content-production/content-task-utils";
import { ContentChannelBadge } from "@/domains/content-production/components/ContentChannelBadge";
import { ContentTaskTimeline } from "@/domains/content-production/components/ContentTaskTimeline";
import type {
  ContentChannel,
  ContentTaskStatus,
  ContentTaskWithCompany,
  ContentType,
} from "@/domains/content-production/types";
import {
  CHANNEL_BADGE,
  CHANNEL_LABELS,
  CONTENT_CHANNELS,
  CONTENT_PHASES,
  CONTENT_TYPES,
  formatTaskTimestamp,
  getAdjacentStatus,
  STATUS_ACCENT,
  STATUS_LABELS,
  TYPE_LABELS,
} from "@/domains/content-production/types";
import { TEAM_LABELS, TEAM_MEMBERS, type TeamMember } from "@/lib/auth/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { LinkifiedText } from "@/lib/linkify";
import {
  Building2,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Clapperboard,
  Copy,
  Film,
  Image,
  Layers,
  History,
  Loader2,
  MoreHorizontal,
  Trash2,
  User,
  Video,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

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

const TYPE_ICONS: Record<ContentType, LucideIcon> = {
  video_curto: Video,
  video_medio: Film,
  video_longo: Clapperboard,
  imagem: Image,
  carrossel: Layers,
};

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

function serializeForm(form: ContentTaskFormValues): string {
  return JSON.stringify({
    ...form,
    channels: [...form.channels].sort(),
  });
}

function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function PropertyRow({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/70">
        <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
        {label}
      </div>
      {children}
    </div>
  );
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
  const [baseline, setBaseline] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const [error, setError] = useState("");
  const [discardOpen, setDiscardOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [notesMode, setNotesMode] = useState<"edit" | "preview">("edit");
  const [sheetTab, setSheetTab] = useState<"details" | "timeline">("details");
  const [timelineKey, setTimelineKey] = useState(0);

  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  const isDirty = serializeForm(form) !== baseline;
  const prevStatus = getAdjacentStatus(form.status, "prev");
  const nextStatus = getAdjacentStatus(form.status, "next");
  const TypeIcon = TYPE_ICONS[form.contentType];

  useEffect(() => {
    if (!open) return;
    setError("");
    const nextForm = task
      ? taskToForm(task)
      : emptyForm({
          productionOwnerId: defaultOwnerId ?? "",
          ...defaultValues,
        });
    setNotesMode(nextForm.notes.trim() ? "preview" : "edit");
    setCompanyOpen(false);
    setForm(nextForm);
    setBaseline(serializeForm(nextForm));
    setSheetTab("details");
  }, [open, task, defaultValues, defaultOwnerId]);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => titleRef.current?.focus(), 80);
    return () => clearTimeout(timer);
  }, [open, task?.id]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        if (!loading && !deleting) {
          formRef.current?.requestSubmit();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, loading, deleting]);

  const set = <K extends keyof ContentTaskFormValues>(key: K, value: ContentTaskFormValues[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const requestClose = useCallback(() => {
    if (isDirty) {
      setDiscardOpen(true);
      return;
    }
    onOpenChange(false);
  }, [isDirty, onOpenChange]);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      requestClose();
      return;
    }
    onOpenChange(next);
  };

  const toggleChannel = (channel: ContentChannel) => {
    setForm((prev) => {
      if (prev.channels.includes(channel)) {
        if (prev.channels.length === 1) return prev;
        return { ...prev, channels: prev.channels.filter((c) => c !== channel) };
      }
      return { ...prev, channels: [...prev.channels, channel] };
    });
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
      if (isEdit) {
        setTimelineKey((k) => k + 1);
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
    if (!task) return;
    setDeleting(true);
    setError("");
    try {
      await deleteContentTask({ data: { id: task.id, companyId: task.company_id } });
      onDeleted?.();
      setDeleteOpen(false);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir.");
    } finally {
      setDeleting(false);
    }
  };

  const handleDuplicate = async () => {
    if (!task) return;
    setDuplicating(true);
    setError("");
    try {
      await duplicateContentTask(task);
      onSaved();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao duplicar.");
    } finally {
      setDuplicating(false);
    }
  };

  const selectedCompany = companies.find((c) => c.id === form.companyId);

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="flex max-h-[min(920px,92vh)] w-[calc(100%-2rem)] max-w-4xl flex-col gap-0 overflow-hidden p-0 sm:rounded-xl">
          <DialogTitle className="sr-only">
            {isEdit ? `Editar: ${form.title || "conteúdo"}` : "Nova tarefa de conteúdo"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isEdit
              ? "Edite os detalhes da peça de conteúdo."
              : "Crie uma nova peça de conteúdo para o kanban e calendário."}
          </DialogDescription>

          <form
            ref={formRef}
            onSubmit={(e) => void handleSubmit(e)}
            className="flex min-h-0 flex-1 flex-col"
          >
            {/* Header */}
            <div className="relative shrink-0 border-b border-border/40 px-6 pb-5 pt-6 sm:px-8 sm:pt-7">
              {isEdit && (
                <div className="absolute right-14 top-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Mais ações</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        disabled={duplicating || loading}
                        onSelect={() => void handleDuplicate()}
                      >
                        {duplicating ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Copy className="mr-2 h-4 w-4" />
                        )}
                        Duplicar tarefa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onSelect={() => setDeleteOpen(true)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir tarefa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              <div className="mb-3 flex flex-wrap items-center gap-2 pr-10">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-elevated px-2.5 py-1 text-[11px] font-medium text-muted-foreground ring-1 ring-border/30">
                  <Clapperboard className="h-3 w-3" />
                  {isEdit ? "Conteúdo" : "Nova tarefa"}
                </span>
                {form.status && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-elevated px-2.5 py-1 text-[11px] font-medium ring-1 ring-border/30">
                    <span className={cn("h-2 w-2 rounded-full", STATUS_ACCENT[form.status])} />
                    {STATUS_LABELS[form.status]}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-elevated px-2.5 py-1 text-[11px] font-medium text-muted-foreground ring-1 ring-border/30">
                  <TypeIcon className="h-3 w-3" />
                  {TYPE_LABELS[form.contentType]}
                </span>
                {form.channels.map((channel) => (
                  <ContentChannelBadge key={channel} channel={channel} size="sm" />
                ))}
              </div>
              <input
                ref={titleRef}
                id="ct-title"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Título da peça..."
                className="w-full bg-transparent font-display text-2xl font-bold tracking-tight text-foreground placeholder:text-muted-foreground/40 focus:outline-none sm:text-3xl"
              />
              {selectedCompany && (
                <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Building2 className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
                  {selectedCompany.name}
                </p>
              )}
            </div>

            <Tabs
              value={isEdit ? sheetTab : "details"}
              onValueChange={(v) => isEdit && setSheetTab(v as "details" | "timeline")}
              className="flex min-h-0 flex-1 flex-col"
            >
              {isEdit && (
                <div className="shrink-0 border-b border-border/40 px-6 sm:px-8">
                  <TabsList className="h-9 rounded-none border-0 bg-transparent p-0">
                    <TabsTrigger
                      value="details"
                      className="rounded-none border-b-2 border-transparent px-4 pb-2.5 pt-1 data-[state=active]:border-brand data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      Detalhes
                    </TabsTrigger>
                    <TabsTrigger
                      value="timeline"
                      className="rounded-none border-b-2 border-transparent px-4 pb-2.5 pt-1 data-[state=active]:border-brand data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      <History className="mr-1.5 h-3.5 w-3.5" />
                      Timeline
                    </TabsTrigger>
                  </TabsList>
                </div>
              )}

              {/* Corpo */}
              <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
              <div className="os-scroll min-h-0 flex-1 overflow-y-auto px-6 py-5 sm:px-8">
                <TabsContent value="details" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="ct-theme"
                      className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    >
                      Tema | Objetivo
                    </Label>
                    <Textarea
                      id="ct-theme"
                      value={form.themeObjective}
                      onChange={(e) => set("themeObjective", e.target.value)}
                      placeholder="Descreva o tema, objetivo e contexto da peça..."
                      rows={4}
                      className="min-h-[100px] resize-y border-border/40 bg-surface/20 text-sm leading-relaxed"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Label
                        htmlFor="ct-notes"
                        className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                      >
                        Textos e observações
                      </Label>
                      {form.notes.trim() && (
                        <Tabs
                          value={notesMode}
                          onValueChange={(v) => setNotesMode(v as "edit" | "preview")}
                        >
                          <TabsList className="h-7 bg-surface/40 p-0.5">
                            <TabsTrigger value="edit" className="h-6 px-2.5 text-[11px]">
                              Editar
                            </TabsTrigger>
                            <TabsTrigger value="preview" className="h-6 px-2.5 text-[11px]">
                              Visualizar
                            </TabsTrigger>
                          </TabsList>
                        </Tabs>
                      )}
                    </div>
                    {notesMode === "preview" && form.notes.trim() ? (
                      <div className="min-h-[220px] rounded-lg border border-border/40 bg-surface/20 p-4 text-sm leading-relaxed">
                        <LinkifiedText text={form.notes} className="text-foreground/90" />
                      </div>
                    ) : (
                      <Textarea
                        id="ct-notes"
                        value={form.notes}
                        onChange={(e) => set("notes", e.target.value)}
                        placeholder="Roteiro, referências, links, feedback de aprovação..."
                        rows={10}
                        className="min-h-[220px] resize-y border-border/40 bg-surface/20 font-mono text-sm leading-relaxed"
                      />
                    )}
                  </div>
                </div>
                </TabsContent>

                {isEdit && task && (
                  <TabsContent value="timeline" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                    <ContentTaskTimeline key={`${task.id}-${timelineKey}`} taskId={task.id} />
                  </TabsContent>
                )}
              </div>

              <aside className="shrink-0 border-t border-border/40 bg-surface/20 lg:w-72 lg:border-l lg:border-t-0">
                <div className="os-scroll space-y-5 overflow-y-auto p-5 sm:p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                    Propriedades
                  </p>

                  <PropertyRow icon={Clapperboard} label="Status">
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 shrink-0"
                        disabled={!prevStatus}
                        onClick={() => prevStatus && set("status", prevStatus)}
                        title={prevStatus ? STATUS_LABELS[prevStatus] : undefined}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Select
                        value={form.status}
                        onValueChange={(v) => set("status", v as ContentTaskStatus)}
                      >
                        <SelectTrigger className="h-9 flex-1 bg-surface/40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CONTENT_PHASES.map((phase) => (
                            <SelectGroup key={phase.id}>
                              <SelectLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                                {phase.label}
                              </SelectLabel>
                              {phase.statuses.map((s) => (
                                <SelectItem key={s} value={s}>
                                  <span className="flex items-center gap-2">
                                    <span className={cn("h-2 w-2 rounded-full", STATUS_ACCENT[s])} />
                                    {STATUS_LABELS[s]}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 shrink-0"
                        disabled={!nextStatus}
                        onClick={() => nextStatus && set("status", nextStatus)}
                        title={nextStatus ? STATUS_LABELS[nextStatus] : undefined}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </PropertyRow>

                  <PropertyRow icon={Building2} label="Cliente">
                    <Popover open={companyOpen} onOpenChange={setCompanyOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          role="combobox"
                          aria-expanded={companyOpen}
                          className="h-9 w-full justify-between bg-surface/40 font-normal"
                        >
                          <span className="truncate">
                            {selectedCompany?.name ?? "Selecionar..."}
                          </span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Buscar cliente..." />
                          <CommandList>
                            <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                            <CommandGroup>
                              {companies.map((c) => (
                                <CommandItem
                                  key={c.id}
                                  value={c.name}
                                  onSelect={() => {
                                    set("companyId", c.id);
                                    setCompanyOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      form.companyId === c.id ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  {c.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </PropertyRow>

                  <PropertyRow icon={User} label="Produção">
                    <Select
                      value={form.productionOwnerId || "none"}
                      onValueChange={(v) =>
                        set("productionOwnerId", v === "none" ? "" : (v as TeamMember))
                      }
                    >
                      <SelectTrigger className="h-9 bg-surface/40">
                        <SelectValue placeholder="Responsável" />
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
                  </PropertyRow>

                  <PropertyRow icon={Calendar} label="Data de postagem">
                    <Input
                      id="ct-post-date"
                      type="date"
                      value={form.postDate}
                      onChange={(e) => set("postDate", e.target.value)}
                      className="h-9 bg-surface/40"
                    />
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-[11px] text-muted-foreground"
                        onClick={() => set("postDate", toDateInputValue(new Date()))}
                      >
                        Hoje
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-[11px] text-muted-foreground"
                        onClick={() => {
                          const tomorrow = new Date();
                          tomorrow.setDate(tomorrow.getDate() + 1);
                          set("postDate", toDateInputValue(tomorrow));
                        }}
                      >
                        Amanhã
                      </Button>
                      {form.postDate && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-[11px] text-muted-foreground"
                          onClick={() => set("postDate", "")}
                        >
                          Limpar
                        </Button>
                      )}
                    </div>
                  </PropertyRow>

                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/70">
                      <TypeIcon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
                      Tipo
                    </Label>
                    <Select
                      value={form.contentType}
                      onValueChange={(v) => set("contentType", v as ContentType)}
                    >
                      <SelectTrigger className="h-9 bg-surface/40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CONTENT_TYPES.map((t) => {
                          const Icon = TYPE_ICONS[t];
                          return (
                            <SelectItem key={t} value={t}>
                              <span className="flex items-center gap-2">
                                <Icon className="h-3.5 w-3.5 opacity-70" />
                                {TYPE_LABELS[t]}
                              </span>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/70">
                      Canais
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {CONTENT_CHANNELS.map((channel) => {
                        const active = form.channels.includes(channel);
                        return (
                          <button
                            key={channel}
                            type="button"
                            onClick={() => toggleChannel(channel)}
                            className={cn(
                              "rounded-lg px-2.5 py-1.5 text-xs font-medium ring-1 ring-inset transition-all",
                              active
                                ? CHANNEL_BADGE[channel]
                                : "bg-surface/30 text-muted-foreground ring-border/30 hover:bg-surface-elevated/60",
                            )}
                          >
                            {CHANNEL_LABELS[channel]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </aside>
              </div>
            </Tabs>

            {/* Footer */}
            <div className="flex shrink-0 flex-col gap-2 border-t border-border/40 bg-surface/10 px-6 py-4 sm:px-8">
              <div className="flex flex-wrap items-center gap-2">
                {isDirty && (
                  <span className="text-[11px] text-amber-400/90">Alterações não salvas</span>
                )}
                {error && <p className="text-sm text-destructive">{error}</p>}
                <div className="ml-auto flex items-center gap-2">
                  <span className="hidden text-[11px] text-muted-foreground/60 sm:inline">
                    Ctrl+Enter para salvar
                  </span>
                  <Button type="button" variant="outline" onClick={requestClose}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading || deleting}>
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isEdit ? "Salvar alterações" : "Criar tarefa"}
                  </Button>
                </div>
              </div>
              {isEdit && task && (
                <p className="text-[10px] text-muted-foreground/50">
                  Criado em {formatTaskTimestamp(task.created_at)} · Atualizado em{" "}
                  {formatTaskTimestamp(task.updated_at)}
                </p>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={discardOpen} onOpenChange={setDiscardOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Descartar alterações?</AlertDialogTitle>
            <AlertDialogDescription>
              Você fez alterações que ainda não foram salvas. Deseja sair sem salvar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar editando</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                setDiscardOpen(false);
                onOpenChange(false);
              }}
            >
              Descartar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir tarefa?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A peça será removida do kanban e do calendário.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                void handleDelete();
              }}
            >
              {deleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
