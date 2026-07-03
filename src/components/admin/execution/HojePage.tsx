import { useExecutionState } from "@/components/admin/execution/use-execution-state";
import { useAdminContext } from "@/components/admin/use-admin-context";
import {
  PersonBadge,
  ProgressBar,
  TaskStatusBadge,
} from "@/components/admin/execution/shared";
import {
  EmptyState,
  ListItem,
  PageHeader,
  PageSkeleton,
  PriorityBanner,
  QuickLinkButton,
  QuickLinkCard,
  Section,
  StatCard,
} from "@/components/admin/ui-kit";
import {
  formatDateBR,
  getActiveBottleneck,
  getHoursRecovered,
  getNextRitual,
  getStalledProductions,
  getWeekDeliveries,
  getWeekProgress,
  memberTasks,
} from "@/lib/execution/helpers";
import { TEAM_LABELS } from "@/lib/execution/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Calendar,
  Clapperboard,
  Gauge,
  LayoutDashboard,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

export function HojePage() {
  const { state, loading, toggleAction, cyclePlanStatus } = useExecutionState();
  const { activePerson } = useAdminContext();
  const person = activePerson ?? "vini";

  if (loading || !state) {
    return <PageSkeleton title="Hoje" />;
  }

  const bottleneck = getActiveBottleneck(state);
  const hoursRecovered = getHoursRecovered(state);
  const weekDeliveries = getWeekDeliveries(state).slice(0, 3);
  const weekProgress = getWeekProgress(state);
  const ritual = getNextRitual();
  const tasks = memberTasks(state, person);
  const stalled = getStalledProductions(state);
  const hasTasks =
    tasks.planTasks.length > 0 ||
    tasks.actions.length > 0 ||
    tasks.backlog.length > 0 ||
    tasks.productions.length > 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Hoje"
        description={`Cockpit de capacidade — ${formatDateBR(new Date().toISOString().slice(0, 10))}`}
        icon={LayoutDashboard}
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Gargalo ativo"
          value={bottleneck.name}
          sub={`${state.metrics.productionQueue} vídeos · ${state.metrics.avgDelayDays}d atraso`}
          accent="danger"
          icon={AlertTriangle}
        />
        <StatCard
          label="Horas recuperadas"
          value={`${hoursRecovered}h`}
          sub={`Meta: ${state.northStar.hoursGoalMonthly}h/mês`}
          accent="success"
          icon={TrendingUp}
        />
        <StatCard
          label="Slots de cliente"
          value={`${state.northStar.clientSlotsCurrent} → +${state.northStar.clientSlotsGoal}`}
          sub="Grandes empresas desbloqueadas"
          accent="brand"
          icon={Users}
        />
        <StatCard
          label="Semana atual"
          value={`${weekProgress}%`}
          sub={`Semana ${state.currentWeek} · ${weekDeliveries.length} prioridades`}
          accent="warning"
          icon={Gauge}
        />
      </section>

      <PriorityBanner label="Prioridade #1" text={state.northStar.priorityOne} />

      <ProgressBar
        label="Horas recuperadas este mês"
        value={hoursRecovered}
        max={state.northStar.hoursGoalMonthly}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Section
          title="3 prioridades da semana"
          action={
            <Link
              to="/admin/execucao/planejamento"
              className="text-xs font-medium text-brand transition-colors hover:text-brand/80"
            >
              Ver plano completo →
            </Link>
          }
        >
          <ul className="space-y-2">
            {weekDeliveries.map((d) => (
              <ListItem key={d.id}>
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => cyclePlanStatus(d.id, d.status)}
                    className="mt-0.5 shrink-0"
                    title="Alternar status"
                  >
                    <Checkbox checked={d.status === "done"} />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-medium leading-snug ${d.status === "done" ? "text-muted-foreground line-through" : ""}`}
                    >
                      {d.title}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <PersonBadge person={d.owner} />
                      <span className="text-xs text-muted-foreground">
                        Prazo {formatDateBR(d.dueDate)}
                      </span>
                      <TaskStatusBadge status={d.status} />
                    </div>
                  </div>
                </div>
              </ListItem>
            ))}
          </ul>
        </Section>

        <Section
          title="Minhas tarefas"
          action={<PersonBadge person={person} />}
        >
          {!hasTasks ? (
            <EmptyState
              icon={Target}
              title={`Nada pendente para ${TEAM_LABELS[person]}`}
              description="Tarefas do plano, produção e backlog aparecem aqui."
            />
          ) : (
            <div className="space-y-2">
              {tasks.planTasks.map((t) => (
                <TaskLine key={t.id} text={t.title} meta={`Plano · ${formatDateBR(t.dueDate)}`} />
              ))}
              {tasks.productions.slice(0, 3).map((p) => (
                <TaskLine key={p.id} text={p.title} meta={`Produção · ${p.stage}`} />
              ))}
              {tasks.actions.map((a) => (
                <label
                  key={a.id}
                  className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-border/50 bg-background/30 p-3 transition-colors hover:bg-surface-elevated/40"
                >
                  <Checkbox
                    checked={a.done}
                    onCheckedChange={() => toggleAction(a.id)}
                    className="mt-0.5"
                  />
                  <span
                    className={`text-sm leading-snug ${a.done ? "text-muted-foreground line-through" : ""}`}
                  >
                    {a.title}
                  </span>
                </label>
              ))}
              {tasks.backlog.map((b) => (
                <TaskLine key={b.id} text={b.title} meta="Backlog · Agora" />
              ))}
            </div>
          )}
        </Section>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickLinkCard title="Próximo ritual" icon={Calendar}>
          <p className="mt-2 font-medium">{ritual.name}</p>
          <p className="text-sm text-muted-foreground">{ritual.day}</p>
          <QuickLinkButton href={ritual.path} label="Abrir ritual" />
        </QuickLinkCard>

        <QuickLinkCard title="Esteira de produção" icon={Clapperboard}>
          <p className="mt-2 text-sm text-muted-foreground">
            {state.metrics.productionQueue} na fila
            {stalled.length > 0 && (
              <span className="text-amber-400"> · {stalled.length} parado(s) 5+ dias</span>
            )}
          </p>
          <QuickLinkButton href="/admin/execucao/producao" label="Abrir kanban" />
        </QuickLinkCard>

        <div className="admin-card p-5 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand/15">
              <Zap className="h-3.5 w-3.5 text-brand" />
            </div>
            Ações imediatas
          </div>
          <ul className="mt-3 space-y-2">
            {state.immediateActions.slice(0, 3).map((a) => (
              <li key={a.id}>
                <label className="flex cursor-pointer items-start gap-2.5 rounded-lg p-1.5 transition-colors hover:bg-surface-elevated/40">
                  <Checkbox
                    checked={a.done}
                    onCheckedChange={() => toggleAction(a.id)}
                    className="mt-0.5"
                  />
                  <span
                    className={`text-sm leading-snug ${a.done ? "text-muted-foreground line-through" : ""}`}
                  >
                    <PersonBadge person={a.owner} /> {a.title}
                  </span>
                </label>
              </li>
            ))}
          </ul>
          <Link
            to="/admin/execucao/capacidade"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-brand transition-colors hover:text-brand/80"
          >
            <TrendingUp className="h-3.5 w-3.5" />
            Ver delegação e gargalos
          </Link>
        </div>
      </section>
    </div>
  );
}

function TaskLine({ text, meta }: { text: string; meta: string }) {
  return (
    <ListItem>
      <p className="text-sm leading-snug">{text}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{meta}</p>
    </ListItem>
  );
}
