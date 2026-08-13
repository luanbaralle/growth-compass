import { listCompanies } from "@/domains/companies/api.server";
import { listContentTasks } from "@/domains/content-production/api.server";
import { ContentCalendar } from "@/domains/content-production/components/ContentCalendar";
import { ContentKanban } from "@/domains/content-production/components/ContentKanban";
import { ContentTaskSheet } from "@/domains/content-production/components/ContentTaskSheet";
import type { ContentChannel, ContentTaskWithCompany } from "@/domains/content-production/types";
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
import { CalendarDays, Clapperboard, LayoutGrid } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export function ContentProductionPage() {
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
  const [view, setView] = useState<"kanban" | "calendar">("kanban");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ContentTaskWithCompany | null>(null);
  const [defaultPostDate, setDefaultPostDate] = useState<string | undefined>();

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

  const openEdit = (task: ContentTaskWithCompany) => {
    setSelectedTask(task);
    setDefaultPostDate(undefined);
    setSheetOpen(true);
  };

  if (loading && tasks.length === 0 && companies.length === 0) {
    return <PageSkeleton title="Produção" metricCount={0} />;
  }

  return (
    <OSPage>
      <PageHeader
        title="Produção de Conteúdo"
        description="Kanban editorial e calendário de postagens — tudo sincronizado"
        icon={Clapperboard}
        actions={
          <>
            <OSRefreshButton loading={loading} onClick={load} />
            <OSPrimaryButton label="Nova tarefa" onClick={() => openCreate()} />
          </>
        }
      />

      {error && <EmptyState title="Erro" description={error} />}

      <Tabs value={view} onValueChange={(v) => setView(v as "kanban" | "calendar")}>
        <TabsList>
          <TabsTrigger value="kanban" className="gap-1.5">
            <LayoutGrid className="h-3.5 w-3.5" />
            Kanban
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            Calendário
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
              <ContentKanban tasks={tasks} onMoved={load} onTaskClick={openEdit} />
            )}
          </TabsContent>

          <TabsContent value="calendar" className="mt-0 px-6 py-6 sm:px-7">
            <ContentCalendar
              tasks={tasks}
              onTaskClick={openEdit}
              onDayClick={(date) => openCreate(date)}
              onRescheduled={load}
            />
          </TabsContent>
        </Section>
      </Tabs>

      <ContentTaskSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
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
