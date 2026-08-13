import {
  deleteContentTask,
  moveContentTask,
  updateContentTask,
} from "@/domains/content-production/api.server";
import {
  addChannel,
  downloadContentTasksCsv,
  duplicateContentTasks,
  removeChannel,
} from "@/domains/content-production/content-task-utils";
import { ContentChannelBadgeGroup } from "@/domains/content-production/components/ContentChannelBadgeGroup";
import {
  ContentTaskContextMenu,
  type ContentTaskQuickActions,
} from "@/domains/content-production/components/ContentTaskContextMenu";
import { useResizableTableColumns } from "@/domains/content-production/components/useResizableTableColumns";
import type {
  ContentChannel,
  ContentTaskStatus,
  ContentTaskWithCompany,
} from "@/domains/content-production/types";
import {
  CHANNEL_LABELS,
  CONTENT_CHANNELS,
  CONTENT_PHASES,
  formatPostDate,
  formatTaskTimestamp,
  getStatusIndex,
  STATUS_ACCENT,
  STATUS_LABELS,
  TYPE_LABELS,
} from "@/domains/content-production/types";
import { TEAM_LABELS, TEAM_MEMBERS, type TeamMember } from "@/lib/auth/types";
import { cn } from "@/lib/utils";
import { DataTable } from "@/os/ui";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDown, ArrowUp, ArrowUpDown, Calendar, Copy, Download, Loader2, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState, type MouseEvent, type ReactNode } from "react";

type SortKey = "title" | "status" | "company" | "postDate" | "updatedAt";
type SortDir = "asc" | "desc";

type ColumnKey =
  | "title"
  | "status"
  | "company"
  | "channels"
  | "type"
  | "postDate"
  | "production"
  | "theme"
  | "updatedAt";

const SELECT_COLUMN_WIDTH = 36;
const SELECT_COLUMN_WIDTH_IDLE = 28;

const TABLE_CHECKBOX_CLASS =
  "h-3.5 w-3.5 rounded-sm border-border/35 bg-surface/30 shadow-none transition-all duration-150 hover:border-border/55 data-[state=checked]:border-brand data-[state=checked]:bg-brand data-[state=checked]:text-brand-foreground";

const COLUMN_KEYS: ColumnKey[] = [
  "title",
  "status",
  "company",
  "channels",
  "type",
  "postDate",
  "production",
  "theme",
  "updatedAt",
];

const DEFAULT_COLUMN_WIDTHS: Record<ColumnKey, number> = {
  title: 180,
  status: 120,
  company: 140,
  channels: 130,
  type: 110,
  postDate: 110,
  production: 100,
  theme: 180,
  updatedAt: 150,
};

const COLUMN_STORAGE_KEY = "os-content-task-table-widths";

function SortButton({
  label,
  active,
  dir,
  onClick,
  className,
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
  className?: string;
}) {
  const Icon = active ? (dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 text-left font-medium transition-colors hover:text-foreground",
        active ? "text-foreground" : "text-muted-foreground",
        className,
      )}
    >
      {label}
      <Icon className="h-3.5 w-3.5 shrink-0 opacity-60" />
    </button>
  );
}

function ResizableTableHead({
  columnKey,
  width,
  onResizeStart,
  resizable = true,
  className,
  children,
}: {
  columnKey: ColumnKey;
  width: number;
  onResizeStart: (key: ColumnKey, event: MouseEvent) => void;
  resizable?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <TableHead
      style={{ width, minWidth: width, maxWidth: width }}
      className={cn("relative overflow-hidden", className)}
    >
      <div className="truncate pr-2">{children}</div>
      {resizable && (
        <span
          role="separator"
          aria-orientation="vertical"
          aria-label={`Redimensionar coluna ${columnKey}`}
          className="absolute -right-px top-0 z-10 h-full w-2 cursor-col-resize touch-none select-none before:absolute before:inset-y-2 before:left-1/2 before:w-px before:-translate-x-1/2 before:bg-border/40 before:transition-colors hover:before:bg-brand/70 active:before:bg-brand"
          onMouseDown={(event) => onResizeStart(columnKey, event)}
          onClick={(event) => event.stopPropagation()}
        />
      )}
    </TableHead>
  );
}

function compareStrings(a: string, b: string): number {
  return a.localeCompare(b, "pt-BR", { sensitivity: "base" });
}

function sortTasks(
  tasks: ContentTaskWithCompany[],
  key: SortKey,
  dir: SortDir,
): ContentTaskWithCompany[] {
  const factor = dir === "asc" ? 1 : -1;
  return [...tasks].sort((a, b) => {
    switch (key) {
      case "title":
        return factor * compareStrings(a.title, b.title);
      case "status":
        return factor * (getStatusIndex(a.status) - getStatusIndex(b.status));
      case "company":
        return (
          factor *
          compareStrings(a.companies?.name ?? "", b.companies?.name ?? "")
        );
      case "postDate": {
        const aDate = a.post_date ?? "";
        const bDate = b.post_date ?? "";
        if (!aDate && !bDate) return 0;
        if (!aDate) return 1;
        if (!bDate) return -1;
        return factor * aDate.localeCompare(bDate);
      }
      case "updatedAt":
        return factor * a.updated_at.localeCompare(b.updated_at);
      default:
        return 0;
    }
  });
}

export function ContentTaskTable({
  tasks,
  onTaskClick,
  onBulkChange,
  taskActions,
}: {
  tasks: ContentTaskWithCompany[];
  onTaskClick: (task: ContentTaskWithCompany) => void;
  onBulkChange?: () => void;
  taskActions?: ContentTaskQuickActions;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("postDate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkError, setBulkError] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [ownerSelectKey, setOwnerSelectKey] = useState(0);
  const [bulkPostDate, setBulkPostDate] = useState("");
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);

  const { widths, startResize, tableMinWidth } = useResizableTableColumns(
    COLUMN_KEYS,
    DEFAULT_COLUMN_WIDTHS,
    COLUMN_STORAGE_KEY,
  );

  const sortedTasks = useMemo(
    () => sortTasks(tasks, sortKey, sortDir),
    [tasks, sortKey, sortDir],
  );

  const selectedTasks = useMemo(
    () => tasks.filter((task) => selectedIds.has(task.id)),
    [tasks, selectedIds],
  );

  const selectedCount = selectedTasks.length;
  const selectionMode = selectedCount > 0;
  const selectColWidth = selectionMode ? SELECT_COLUMN_WIDTH : SELECT_COLUMN_WIDTH_IDLE;
  const allSelected = sortedTasks.length > 0 && sortedTasks.every((task) => selectedIds.has(task.id));
  const someSelected = sortedTasks.some((task) => selectedIds.has(task.id));

  useEffect(() => {
    setSelectedIds((prev) => {
      const validIds = new Set(tasks.map((task) => task.id));
      const next = new Set([...prev].filter((id) => validIds.has(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [tasks]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDir(key === "title" || key === "company" ? "asc" : "desc");
  };

  const toggleOne = (taskId: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(taskId);
      else next.delete(taskId);
      return next;
    });
  };

  const toggleAllVisible = (checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const task of sortedTasks) {
        if (checked) next.add(task.id);
        else next.delete(task.id);
      }
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const runBulkAction = async (action: () => Promise<void>) => {
    if (selectedCount === 0) return;
    setBulkLoading(true);
    setBulkError("");
    try {
      await action();
      clearSelection();
      onBulkChange?.();
    } catch (err) {
      setBulkError(err instanceof Error ? err.message : "Erro na ação em lote.");
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    await runBulkAction(async () => {
      await Promise.all(
        selectedTasks.map((task) =>
          deleteContentTask({ data: { id: task.id, companyId: task.company_id } }),
        ),
      );
      setDeleteOpen(false);
    });
  };

  const handleBulkStatus = async (status: ContentTaskStatus) => {
    await runBulkAction(async () => {
      await Promise.all(
        selectedTasks.map((task) => moveContentTask({ data: { id: task.id, status } })),
      );
    });
  };

  const handleBulkOwner = async (ownerId: TeamMember) => {
    await runBulkAction(async () => {
      await Promise.all(
        selectedTasks.map((task) =>
          updateContentTask({
            data: {
              id: task.id,
              companyId: task.company_id,
              productionOwnerId: ownerId,
            },
          }),
        ),
      );
      setOwnerSelectKey((k) => k + 1);
    });
  };

  const handleBulkPostDate = async () => {
    if (!bulkPostDate) return;
    await runBulkAction(async () => {
      await Promise.all(
        selectedTasks.map((task) =>
          updateContentTask({
            data: {
              id: task.id,
              companyId: task.company_id,
              postDate: bulkPostDate,
            },
          }),
        ),
      );
      setDatePopoverOpen(false);
      setBulkPostDate("");
    });
  };

  const handleBulkAddChannel = async (channel: ContentChannel) => {
    await runBulkAction(async () => {
      await Promise.all(
        selectedTasks.map(async (task) => {
          const channels = addChannel(task.channels, channel);
          if (channels === task.channels) return;
          await updateContentTask({
            data: { id: task.id, companyId: task.company_id, channels },
          });
        }),
      );
    });
  };

  const handleBulkRemoveChannel = async (channel: ContentChannel) => {
    await runBulkAction(async () => {
      await Promise.all(
        selectedTasks.map(async (task) => {
          const channels = removeChannel(task.channels, channel);
          if (!channels) return;
          if (channels === task.channels) return;
          await updateContentTask({
            data: { id: task.id, companyId: task.company_id, channels },
          });
        }),
      );
    });
  };

  const handleBulkDuplicate = async () => {
    await runBulkAction(async () => {
      await duplicateContentTasks(selectedTasks);
    });
  };

  const handleExportCsv = () => {
    downloadContentTasksCsv(selectedTasks);
  };

  return (
    <div className="space-y-3">
      {selectedCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-brand/25 bg-brand/8 px-4 py-2.5">
          <span className="text-sm font-medium text-foreground">
            {selectedCount} selecionada{selectedCount === 1 ? "" : "s"}
          </span>

          <Select
            disabled={bulkLoading}
            onValueChange={(value) => void handleBulkStatus(value as ContentTaskStatus)}
          >
            <SelectTrigger className="h-8 w-[160px] bg-surface/60 text-xs">
              <SelectValue placeholder="Alterar status" />
            </SelectTrigger>
            <SelectContent>
              {CONTENT_PHASES.map((phase) => (
                <SelectGroup key={phase.id}>
                  <SelectLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                    {phase.label}
                  </SelectLabel>
                  {phase.statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      <span className="flex items-center gap-2">
                        <span className={cn("h-2 w-2 rounded-full", STATUS_ACCENT[status])} />
                        {STATUS_LABELS[status]}
                      </span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>

          <Select
            key={ownerSelectKey}
            disabled={bulkLoading}
            onValueChange={(value) => void handleBulkOwner(value as TeamMember)}
          >
            <SelectTrigger className="h-8 w-[150px] bg-surface/60 text-xs">
              <SelectValue placeholder="Alterar produção" />
            </SelectTrigger>
            <SelectContent>
              {TEAM_MEMBERS.map((member) => (
                <SelectItem key={member} value={member}>
                  {TEAM_LABELS[member]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 bg-surface/60 text-xs"
                disabled={bulkLoading}
              >
                <Calendar className="h-3.5 w-3.5" />
                Data
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 space-y-3" align="start">
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground">Data de postagem</p>
                <Input
                  type="date"
                  value={bulkPostDate}
                  onChange={(e) => setBulkPostDate(e.target.value)}
                  className="h-9"
                />
              </div>
              <Button
                type="button"
                size="sm"
                className="w-full"
                disabled={!bulkPostDate || bulkLoading}
                onClick={() => void handleBulkPostDate()}
              >
                Aplicar às selecionadas
              </Button>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 bg-surface/60 text-xs"
                disabled={bulkLoading}
              >
                Canais
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
              <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                Adicionar
              </DropdownMenuLabel>
              {CONTENT_CHANNELS.map((channel) => (
                <DropdownMenuItem
                  key={`add-${channel}`}
                  onSelect={() => void handleBulkAddChannel(channel)}
                >
                  + {CHANNEL_LABELS[channel]}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                Remover
              </DropdownMenuLabel>
              {CONTENT_CHANNELS.map((channel) => (
                <DropdownMenuItem
                  key={`remove-${channel}`}
                  onSelect={() => void handleBulkRemoveChannel(channel)}
                >
                  − {CHANNEL_LABELS[channel]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            disabled={bulkLoading}
            onClick={() => void handleBulkDuplicate()}
          >
            <Copy className="h-3.5 w-3.5" />
            Duplicar
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            disabled={bulkLoading}
            onClick={handleExportCsv}
          >
            <Download className="h-3.5 w-3.5" />
            CSV
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-destructive hover:text-destructive"
            disabled={bulkLoading}
            onClick={() => setDeleteOpen(true)}
          >
            {bulkLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            Excluir
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="ml-auto h-8 text-muted-foreground"
            disabled={bulkLoading}
            onClick={clearSelection}
          >
            <X className="h-3.5 w-3.5" />
            Limpar
          </Button>
        </div>
      )}

      {bulkError && <p className="text-sm text-destructive">{bulkError}</p>}

      <DataTable>
        <Table
          className={cn("group/table table-fixed", selectionMode && "is-selecting")}
          style={{ minWidth: tableMinWidth + selectColWidth }}
        >
          <colgroup>
            <col style={{ width: selectColWidth }} />
            {COLUMN_KEYS.map((key) => (
              <col key={key} style={{ width: widths[key] }} />
            ))}
          </colgroup>
          <TableHeader>
            <TableRow className="group/header">
              <TableHead
                style={{
                  width: selectColWidth,
                  minWidth: selectColWidth,
                  maxWidth: selectColWidth,
                }}
                className={cn(
                  "relative overflow-visible border-0 px-1",
                  selectionMode && "px-2",
                )}
              >
                <div className="content-task-header-checkbox flex items-center justify-center">
                  <Checkbox
                    checked={allSelected ? true : someSelected ? "indeterminate" : false}
                    onCheckedChange={(checked) => toggleAllVisible(checked === true)}
                    aria-label="Selecionar todas as tarefas visíveis"
                    className={TABLE_CHECKBOX_CLASS}
                    onClick={(event) => event.stopPropagation()}
                  />
                </div>
              </TableHead>
              <ResizableTableHead
                columnKey="title"
                width={widths.title}
                onResizeStart={startResize}
              >
                <SortButton
                  label="Título"
                  active={sortKey === "title"}
                  dir={sortDir}
                  onClick={() => toggleSort("title")}
                />
              </ResizableTableHead>
              <ResizableTableHead
                columnKey="status"
                width={widths.status}
                onResizeStart={startResize}
              >
                <SortButton
                  label="Status"
                  active={sortKey === "status"}
                  dir={sortDir}
                  onClick={() => toggleSort("status")}
                />
              </ResizableTableHead>
              <ResizableTableHead
                columnKey="company"
                width={widths.company}
                onResizeStart={startResize}
              >
                <SortButton
                  label="Cliente"
                  active={sortKey === "company"}
                  dir={sortDir}
                  onClick={() => toggleSort("company")}
                />
              </ResizableTableHead>
              <ResizableTableHead
                columnKey="channels"
                width={widths.channels}
                onResizeStart={startResize}
              >
                Canais
              </ResizableTableHead>
              <ResizableTableHead
                columnKey="type"
                width={widths.type}
                onResizeStart={startResize}
              >
                Tipo
              </ResizableTableHead>
              <ResizableTableHead
                columnKey="postDate"
                width={widths.postDate}
                onResizeStart={startResize}
              >
                <SortButton
                  label="Postagem"
                  active={sortKey === "postDate"}
                  dir={sortDir}
                  onClick={() => toggleSort("postDate")}
                />
              </ResizableTableHead>
              <ResizableTableHead
                columnKey="production"
                width={widths.production}
                onResizeStart={startResize}
              >
                Produção
              </ResizableTableHead>
              <ResizableTableHead
                columnKey="theme"
                width={widths.theme}
                onResizeStart={startResize}
                className="hidden lg:table-cell"
              >
                Tema | Objetivo
              </ResizableTableHead>
              <ResizableTableHead
                columnKey="updatedAt"
                width={widths.updatedAt}
                onResizeStart={startResize}
                resizable={false}
                className="hidden xl:table-cell"
              >
                <SortButton
                  label="Atualizado"
                  active={sortKey === "updatedAt"}
                  dir={sortDir}
                  onClick={() => toggleSort("updatedAt")}
                />
              </ResizableTableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTasks.map((task) => {
              const selected = selectedIds.has(task.id);
              const rowActions: ContentTaskQuickActions = {
                ...taskActions,
                onOpen: taskActions?.onOpen ?? (() => onTaskClick(task)),
              };

              const row = (
                <TableRow
                  key={task.id}
                  className={cn(
                    "content-task-row cursor-pointer hover:bg-transparent",
                    selected && "is-selected",
                  )}
                  onClick={() => onTaskClick(task)}
                >
                  <TableCell
                    className={cn("relative overflow-visible px-1", selectionMode && "px-2")}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div className="content-task-row-checkbox flex items-center justify-center">
                      <Checkbox
                        checked={selected}
                        onCheckedChange={(checked) => toggleOne(task.id, checked === true)}
                        aria-label={`Selecionar ${task.title}`}
                        className={TABLE_CHECKBOX_CLASS}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="truncate font-medium">{task.title}</TableCell>
                  <TableCell>
                    <span className="inline-flex max-w-full items-center gap-1.5 truncate text-sm">
                      <span
                        className={cn("h-2 w-2 shrink-0 rounded-full", STATUS_ACCENT[task.status])}
                        aria-hidden
                      />
                      <span className="truncate">{STATUS_LABELS[task.status]}</span>
                    </span>
                  </TableCell>
                  <TableCell className="truncate text-muted-foreground">
                    {task.companies?.name ?? "—"}
                  </TableCell>
                  <TableCell className="truncate">
                    <ContentChannelBadgeGroup channels={task.channels} />
                  </TableCell>
                  <TableCell className="truncate text-sm text-muted-foreground">
                    {TYPE_LABELS[task.content_type]}
                  </TableCell>
                  <TableCell className="truncate text-sm text-muted-foreground">
                    {formatPostDate(task.post_date)}
                  </TableCell>
                  <TableCell className="truncate text-sm text-muted-foreground">
                    {task.production_owner_id
                      ? (TEAM_LABELS[task.production_owner_id as TeamMember] ??
                        task.production_owner_id)
                      : "—"}
                  </TableCell>
                  <TableCell className="hidden truncate text-sm text-muted-foreground lg:table-cell">
                    {task.theme_objective?.trim() || "—"}
                  </TableCell>
                  <TableCell className="hidden truncate text-xs text-muted-foreground/80 xl:table-cell">
                    {formatTaskTimestamp(task.updated_at)}
                  </TableCell>
                </TableRow>
              );

              if (!taskActions) return row;

              return (
                <ContentTaskContextMenu key={task.id} task={task} actions={rowActions}>
                  {row}
                </ContentTaskContextMenu>
              );
            })}
          </TableBody>
        </Table>
      </DataTable>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Excluir {selectedCount} tarefa{selectedCount === 1 ? "" : "s"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. As peças serão removidas do kanban, calendário e
              lista.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={bulkLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={bulkLoading}
              onClick={(event) => {
                event.preventDefault();
                void handleBulkDelete();
              }}
            >
              {bulkLoading ? "Excluindo..." : "Excluir selecionadas"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
