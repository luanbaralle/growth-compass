import { useExecutionState } from "@/components/admin/execution/use-execution-state";
import {
  BacklogColumnBadge,
  PersonBadge,
  TASK_STATUS_LABELS,
  BACKLOG_COLUMN_LABELS,
} from "@/components/admin/execution/shared";
import { PageHeader, PageSkeleton, Section } from "@/components/admin/ui-kit";
import {
  formatDateBR,
  getBacklogByColumn,
  getWeekDeliveries,
  getWeekProgress,
} from "@/lib/execution/helpers";
import type { BacklogColumn, TaskStatus } from "@/lib/execution/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ListTodo } from "lucide-react";

const WEEK_THEMES = ["", "Estabilizar", "Padronizar", "Delegar", "Escalar"] as const;
const BACKLOG_COLUMNS: BacklogColumn[] = ["agora", "proximo", "depois", "nao_agora"];

export function PlanejamentoPage() {
  const { state, loading, setPlanStatus, moveBacklog, changeWeek } = useExecutionState();

  if (loading || !state) {
    return <PageSkeleton title="Planejamento" metricCount={0} />;
  }

  const deliveries = getWeekDeliveries(state);
  const progress = getWeekProgress(state);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Planejamento"
        description={`Plano 30 dias + backlog · máximo 3 itens em "Agora"`}
        icon={ListTodo}
      />

      <Tabs
        value={String(state.currentWeek)}
        onValueChange={(v) => changeWeek(parseInt(v, 10))}
      >
        <TabsList className="flex h-auto w-full flex-wrap gap-1 bg-surface-elevated/50 p-1">
          {[1, 2, 3, 4].map((w) => (
            <TabsTrigger
              key={w}
              value={String(w)}
              className="flex-1 text-xs data-[state=active]:bg-brand-soft data-[state=active]:text-brand sm:text-sm"
            >
              Semana {w}
              <span className="ml-1 hidden text-muted-foreground data-[state=active]:text-brand/70 sm:inline">
                · {WEEK_THEMES[w]}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {[1, 2, 3, 4].map((w) => (
          <TabsContent key={w} value={String(w)} className="mt-6 space-y-4">
            <div className="admin-card flex items-center justify-between p-4">
              <div>
                <p className="font-medium">
                  Semana {w} — {WEEK_THEMES[w]}
                </p>
                <p className="text-sm text-muted-foreground">
                  {getWeekDeliveries(state, w).filter((d) => d.status === "done").length}/
                  {getWeekDeliveries(state, w).length} entregas
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-3xl font-bold tabular-nums">
                  {w === state.currentWeek ? progress : getWeekProgress(state, w)}%
                </p>
              </div>
            </div>

            <ul className="space-y-2">
              {getWeekDeliveries(state, w).map((d) => (
                <li key={d.id} className="admin-card p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        Entrega {d.number}
                      </p>
                      <p
                        className={cn(
                          "mt-1 font-medium leading-snug",
                          d.status === "done" && "text-muted-foreground line-through",
                        )}
                      >
                        {d.title}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground/70">Feito quando:</span>{" "}
                        {d.doneWhen}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <PersonBadge person={d.owner} />
                        <span className="text-xs text-muted-foreground">
                          Prazo {formatDateBR(d.dueDate)}
                        </span>
                      </div>
                    </div>
                    <Select
                      value={d.status}
                      onValueChange={(v) => setPlanStatus(d.id, v as TaskStatus)}
                    >
                      <SelectTrigger className="h-8 w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(["pending", "in_progress", "done", "blocked"] as TaskStatus[]).map(
                          (s) => (
                            <SelectItem key={s} value={s}>
                              {TASK_STATUS_LABELS[s]}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </li>
              ))}
            </ul>
          </TabsContent>
        ))}
      </Tabs>

      <Section
        title="Backlog priorizado"
        description='Mover item para "Agora" só se houver slot (máx. 3).'
      >
        <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-4">
          {BACKLOG_COLUMNS.map((col) => {
            const items = getBacklogByColumn(state, col);
            return (
              <div
                key={col}
                className={cn(
                  "rounded-xl border p-3",
                  col === "agora"
                    ? "border-red-400/25 bg-red-400/[0.04]"
                    : "border-border/60 bg-surface-elevated/20",
                )}
              >
                <div className="mb-3 flex items-center justify-between">
                  <BacklogColumnBadge column={col} />
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {items.length}
                    {col === "agora" && " / 3"}
                  </span>
                </div>
                <ul className="space-y-2">
                  {items.length === 0 && (
                    <li className="py-4 text-center text-xs text-muted-foreground">Vazio</li>
                  )}
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-lg border border-border/50 bg-background/40 p-2.5"
                    >
                      <p className="text-sm font-medium leading-snug">{item.title}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-1">
                        <PersonBadge person={item.owner} />
                      </div>
                      {item.dependency && (
                        <p className="mt-1 text-[10px] text-muted-foreground">
                          Dep: {item.dependency}
                        </p>
                      )}
                      <Select
                        value={item.column}
                        onValueChange={(v) => moveBacklog(item.id, v as BacklogColumn)}
                      >
                        <SelectTrigger className="mt-2 h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {BACKLOG_COLUMNS.map((c) => (
                            <SelectItem key={c} value={c}>
                              {BACKLOG_COLUMN_LABELS[c]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Section>

      {state.currentWeek === 1 && deliveries.length > 0 && (
        <Section title="Checklists diários — Semana 1">
          <div className="grid gap-4 text-sm sm:grid-cols-2">
            <div className="rounded-lg border border-border/50 bg-background/30 p-4">
              <p className="font-medium">Caio</p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li>· Atualizar status da fila</li>
                <li>· Não aceitar demanda avulsa sem passar por Vini</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/50 bg-background/30 p-4">
              <p className="font-medium">Vini</p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li>· Zero edição pessoal (só gravação ou delegação)</li>
                <li>· Responder comentários 1x/dia</li>
              </ul>
            </div>
          </div>
        </Section>
      )}
    </div>
  );
}
