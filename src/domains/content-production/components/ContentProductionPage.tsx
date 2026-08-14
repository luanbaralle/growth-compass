import { listCompanies } from "@/domains/companies/api.server";
import {
  deleteContentTask,
  getContentTask,
  listContentTasks,
  moveContentTask,
  updateContentTask,
} from "@/domains/content-production/api.server";
import { ContentCalendar } from "@/domains/content-production/components/ContentCalendar";
import { ContentKanban } from "@/domains/content-production/components/ContentKanban";
import { ContentTaskTable } from "@/domains/content-production/components/ContentTaskTable";
import { ContentTaskSheet } from "@/domains/content-production/components/ContentTaskSheet";
import type { ContentTaskQuickActions } from "@/domains/content-production/components/ContentTaskContextMenu";
import {
  addChannel,
  duplicateContentTask,
  removeChannel,
} from "@/domains/content-production/content-task-utils";
import type { ContentChannel, ContentTaskStatus, ContentTaskWithCompany } from "@/domains/content-production/types";
import { CHANNEL_LABELS, CONTENT_CHANNELS } from "@/domains/content-production/types";
import { useOSContext } from "@/os/shell/use-os-context";
import {
  EmptyState,
  FilterRow,
  FilterSearch,
  OSPage,
  OSPrimaryButton,
  OSRefreshButton,
  PageHeader,
  PageSkeleton,
  Section,
} from "@/os/ui";
import { getErrorMessage, isUnauthorizedError } from "@/lib/api/client-errors";
import { TEAM_LABELS, TEAM_MEMBERS, type TeamMember } from "@/lib/auth/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import { CalendarDays, Clapperboard, LayoutGrid, List } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export function ContentProductionPage({ initialTaskId }: { initialTaskId?: string }) {
  const navigate = useNavigate();
  const { activePerson } = useOSContext();
  const [tasks, setTasks] = useState<ContentTaskWithCompany[]>([]);
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [channel, setChannel] = useState<ContentChannel | "all">("all");
  const [companyId, setCompanyId] = useState("");
  const [productionOwnerId, setProductionOwnerId] = useState<TeamMember | "all">("all");
  const [view, setView] = useState<"kanban" | "calendar" | "list">("kanban");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ContentTaskWithCompany | null>(null);
  const [defaultPostDate, setDefaultPostDate] = useState<string | undefined>();
  const openedTaskRef = useRef<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [tasksResult, companiesResult] = await Promise.all([
        listContentTasks({
          data: {
            search: search || undefined,
            channel,
            companyId: companyId || undefined,
            productionOwnerId,
          },
        }),
        listCompanies({ data: { sort: "name", order: "asc" } }),
      ]);
      setTasks(tasksResult.tasks);
      setCompanies(companiesResult.companies.map((c) => ({ id: c.id, name: c.name })));
    } catch (err) {
      if (isUnauthorizedError(err)) {
        navigate({ to: "/os/login" });
        return;
      }
      setError(getErrorMessage(err, "Erro ao carregar produção de conteúdo."));
    } finally {
      setLoading(false);
    }
  }, [search, channel, companyId, productionOwnerId, navigate]);

  useEffect(() => {
    const timer = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [load, search]);

  const openCreate = (postDate?: string) => {
    setSelectedTask(null);
    setDefaultPostDate(postDate);
    setSheetOpen(true);
  };

  const openEdit = useCallback((task: ContentTaskWithCompany) => {
    setSelectedTask(task);
    setDefaultPostDate(undefined);
    setSheetOpen(true);
  }, []);

  useEffect(() => {
    if (!initialTaskId || loading) return;
    if (openedTaskRef.current === initialTaskId && sheetOpen) return;

    const fromList = tasks.find((task) => task.id === initialTaskId);
    if (fromList) {
      openedTaskRef.current = initialTaskId;
      openEdit(fromList);
      return;
    }

    let cancelled = false;
    void getContentTask({ data: { id: initialTaskId } })
      .then((result) => {
        if (cancelled) return;
        openedTaskRef.current = initialTaskId;
        openEdit({
          ...result.task,
          companies: result.company ? { name: result.company.name } : null,
        });
      })
      .catch(() => {
        /* task inválido ou removido — ignora deep link */
      });

    return () => {
      cancelled = true;
    };
  }, [initialTaskId, loading, tasks, openEdit, sheetOpen]);

  const handleSheetOpenChange = (open: boolean) => {
    setSheetOpen(open);
    if (!open && initialTaskId) {
      openedTaskRef.current = null;
      navigate({ to: "/os/producao", search: {}, replace: true });
    }
  };

  const handleDuplicate = useCallback(async (task: ContentTaskWithCompany) => {
    try {
      await duplicateContentTask(task);
      await load();
    } catch (err) {
      if (isUnauthorizedError(err)) {
        navigate({ to: "/os/login" });
        return;
      }
      setError(getErrorMessage(err, "Erro ao duplicar tarefa."));
    }
  }, [load, navigate]);

  const runTaskAction = useCallback(
    async (action: () => Promise<void>, errorMessage: string) => {
      try {
        await action();
        await load();
      } catch (err) {
        if (isUnauthorizedError(err)) {
          navigate({ to: "/os/login" });
          return;
        }
        setError(getErrorMessage(err, errorMessage));
      }
    },
    [load, navigate],
  );

  const taskActions = useMemo<ContentTaskQuickActions>(
    () => ({
      onOpen: openEdit,
      onDuplicate: handleDuplicate,
      onDelete: async (task) => {
        await runTaskAction(
          () => deleteContentTask({ data: { id: task.id, companyId: task.company_id } }),
          "Erro ao excluir tarefa.",
        );
      },
      onStatusChange: async (task, status: ContentTaskStatus) => {
        await runTaskAction(
          () => moveContentTask({ data: { id: task.id, status } }),
          "Erro ao alterar status.",
        );
      },
      onPostDateChange: async (task, postDate) => {
        await runTaskAction(
          () =>
            updateContentTask({
              data: { id: task.id, companyId: task.company_id, postDate },
            }),
          "Erro ao alterar data.",
        );
      },
      onClearPostDate: async (task) => {
        await runTaskAction(
          () =>
            updateContentTask({
              data: { id: task.id, companyId: task.company_id, postDate: "" },
            }),
          "Erro ao remover data.",
        );
      },
      onAddChannel: async (task, channel: ContentChannel) => {
        const channels = addChannel(task.channels, channel);
        if (channels === task.channels) return;
        await runTaskAction(
          () =>
            updateContentTask({
              data: { id: task.id, companyId: task.company_id, channels },
            }),
          "Erro ao adicionar canal.",
        );
      },
      onRemoveChannel: async (task, channel: ContentChannel) => {
        const channels = removeChannel(task.channels, channel);
        if (!channels || channels === task.channels) return;
        await runTaskAction(
          () =>
            updateContentTask({
              data: { id: task.id, companyId: task.company_id, channels },
            }),
          "Erro ao remover canal.",
        );
      },
      onOwnerChange: async (task, owner) => {
        await runTaskAction(
          () =>
            updateContentTask({
              data: { id: task.id, companyId: task.company_id, productionOwnerId: owner },
            }),
          "Erro ao alterar responsável.",
        );
      },
    }),
    [openEdit, handleDuplicate, runTaskAction],
  );

  if (loading && tasks.length === 0 && companies.length === 0) {
    return <PageSkeleton title="Produção" metricCount={0} />;
  }

  return (
    <OSPage>
      <PageHeader
        title="Produção de Conteúdo"
        description="Kanban, calendário e lista — tudo sincronizado"
        icon={Clapperboard}
        actions={
          <>
            <OSRefreshButton loading={loading} onClick={load} />
            <OSPrimaryButton label="Nova tarefa" onClick={() => openCreate()} />
          </>
        }
      />

      {error && <EmptyState title="Erro" description={error} />}

      <Tabs value={view} onValueChange={(v) => setView(v as "kanban" | "calendar" | "list")}>
        <TabsList>
          <TabsTrigger value="kanban" className="gap-1.5">
            <LayoutGrid className="h-3.5 w-3.5" />
            Kanban
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            Calendário
          </TabsTrigger>
          <TabsTrigger value="list" className="gap-1.5">
            <List className="h-3.5 w-3.5" />
            Lista
          </TabsTrigger>
        </TabsList>

        <Section noPadding className="mt-4 overflow-hidden">
          <div className="os-filters !rounded-none !border-0 !border-b">
            <FilterRow>
              <FilterSearch
                value={search}
                onChange={setSearch}
                placeholder="Buscar título, cliente, tema..."
              />
            </FilterRow>
            <div className="pipeline-filters-scroll">
              <Select
                value={channel}
                onValueChange={(v) => setChannel(v as ContentChannel | "all")}
              >
                <SelectTrigger className="h-9 w-[130px] shrink-0">
                  <SelectValue placeholder="Canal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Canal</SelectItem>
                  {CONTENT_CHANNELS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {CHANNEL_LABELS[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={companyId || "all"}
                onValueChange={(v) => setCompanyId(v === "all" ? "" : v)}
              >
                <SelectTrigger className="h-9 w-[160px] shrink-0">
                  <SelectValue placeholder="Cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Cliente</SelectItem>
                  {companies.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={productionOwnerId}
                onValueChange={(v) => setProductionOwnerId(v as TeamMember | "all")}
              >
                <SelectTrigger className="h-9 w-[150px] shrink-0">
                  <SelectValue placeholder="Produção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Produção</SelectItem>
                  {TEAM_MEMBERS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {TEAM_LABELS[m]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="kanban" className="mt-0 px-6 py-6 sm:px-7">
            {tasks.length === 0 && !loading ? (
              <EmptyState
                icon={Clapperboard}
                title="Nenhuma tarefa"
                description="Crie uma peça de conteúdo para começar o kanban."
              />
            ) : (
              <ContentKanban
                tasks={tasks}
                onMoved={load}
                onTaskClick={openEdit}
                taskActions={taskActions}
              />
            )}
          </TabsContent>

          <TabsContent value="calendar" className="mt-0 px-6 py-6 sm:px-7">
            <ContentCalendar
              tasks={tasks}
              onTaskClick={openEdit}
              onDayClick={(date) => openCreate(date)}
              onRescheduled={load}
              taskActions={taskActions}
            />
          </TabsContent>

          <TabsContent value="list" className="mt-0 px-6 py-6 sm:px-7">
            {tasks.length === 0 && !loading ? (
              <EmptyState
                icon={Clapperboard}
                title="Nenhuma tarefa"
                description="Crie uma peça de conteúdo para ver na lista."
              />
            ) : (
              <ContentTaskTable
                tasks={tasks}
                onTaskClick={openEdit}
                onBulkChange={load}
                taskActions={taskActions}
              />
            )}
          </TabsContent>
        </Section>
      </Tabs>

      <ContentTaskSheet
        open={sheetOpen}
        onOpenChange={handleSheetOpenChange}
        task={selectedTask}
        companies={companies}
        defaultValues={defaultPostDate ? { postDate: defaultPostDate } : undefined}
        defaultOwnerId={activePerson ?? undefined}
        onSaved={load}
        onDeleted={load}
      />
    </OSPage>
  );
}
