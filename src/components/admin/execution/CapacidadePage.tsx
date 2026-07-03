import { HoursHistoryChart } from "@/components/admin/execution/HoursHistoryChart";
import { useExecutionState } from "@/components/admin/execution/use-execution-state";
import {
  DelegationStatusBadge,
  PersonBadge,
  ProgressBar,
  TargetLabel,
} from "@/components/admin/execution/shared";
import {
  PageHeader,
  PageSkeleton,
  Section,
  SeverityBadge,
  StatCard,
} from "@/components/admin/ui-kit";
import {
  formatDateBR,
  getActiveBottleneck,
  getDelegatedCount,
  getHoursRecovered,
} from "@/lib/execution/helpers";
import { TEAM_LABELS } from "@/lib/execution/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { AlertTriangle, Gauge, RefreshCw, TrendingUp, Users } from "lucide-react";
import { useState } from "react";

export function CapacidadePage() {
  const {
    state,
    loading,
    reload,
    cycleDelegationStatus,
    updateDelegationHours,
    updateProductionMetrics,
    recordHoursSnapshot,
  } = useExecutionState();
  const [queueInput, setQueueInput] = useState("");
  const [delayInput, setDelayInput] = useState("");

  if (loading || !state) {
    return <PageSkeleton title="Capacidade" />;
  }

  const bottleneck = getActiveBottleneck(state);
  const hoursRecovered = getHoursRecovered(state);
  const delegatedCount = getDelegatedCount(state);
  const totalDelegations = state.delegations.length;

  const handleMetricsSave = () => {
    const q = parseInt(queueInput || String(state.metrics.productionQueue), 10);
    const d = parseFloat(delayInput || String(state.metrics.avgDelayDays));
    if (Number.isNaN(q) || Number.isNaN(d)) return;
    updateProductionMetrics(q, d);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Capacidade"
        description="Expansão operacional — transformar manual em slots de cliente"
        icon={Gauge}
        actions={
          <Button variant="outline" size="sm" onClick={reload}>
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
        }
      />

      <section className="rounded-xl border border-red-400/25 bg-red-400/[0.04] p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-400/15">
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-red-400">
              Gargalo atual
            </p>
            <h2 className="mt-1 font-display text-xl font-bold">{bottleneck.name}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <SeverityBadge severity={bottleneck.severity} />
              <span className="text-sm text-muted-foreground">{bottleneck.impact}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                Dono: <PersonBadge person={bottleneck.owner} />
              </span>
              {bottleneck.targetDate && (
                <span>Meta: {formatDateBR(bottleneck.targetDate)}</span>
              )}
              <span>
                Fila: {state.metrics.productionQueue} vídeos · {state.metrics.avgDelayDays}d atraso
              </span>
            </div>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-end gap-3 border-t border-border/40 pt-4">
          <div>
            <Label className="text-xs text-muted-foreground">Vídeos na fila</Label>
            <Input
              type="number"
              min={0}
              className="mt-1 h-8 w-24"
              placeholder={String(state.metrics.productionQueue)}
              value={queueInput}
              onChange={(e) => setQueueInput(e.target.value)}
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Atraso médio (dias)</Label>
            <Input
              type="number"
              min={0}
              step={0.5}
              className="mt-1 h-8 w-24"
              placeholder={String(state.metrics.avgDelayDays)}
              value={delayInput}
              onChange={(e) => setDelayInput(e.target.value)}
            />
          </div>
          <Button size="sm" variant="secondary" onClick={handleMetricsSave}>
            Atualizar fila
          </Button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <StatCard
          label="Horas recuperadas"
          value={`${hoursRecovered}h`}
          sub={`Meta ${state.northStar.hoursGoalMonthly}h/mês`}
          accent="success"
          icon={TrendingUp}
        />
        <StatCard
          label="Delegação"
          value={`${delegatedCount}/${totalDelegations}`}
          sub="Atividades totalmente delegadas"
          accent="brand"
          icon={Gauge}
        />
        <StatCard
          label="Slots de cliente"
          value={`+${state.northStar.clientSlotsGoal}`}
          sub={`Hoje: ${state.northStar.clientSlotsCurrent} grandes disponíveis`}
          accent="warning"
          icon={Users}
        />
      </section>

      <ProgressBar
        label="Progresso de horas recuperadas"
        value={hoursRecovered}
        max={state.northStar.hoursGoalMonthly}
      />

      <Section
        title="Histórico de horas"
        description="Snapshots automáticos no Review semanal + registro manual"
        action={
          <Button size="sm" variant="outline" onClick={recordHoursSnapshot}>
            Registrar agora
          </Button>
        }
      >
        <HoursHistoryChart
          history={state.hoursHistory ?? []}
          goal={state.northStar.hoursGoalMonthly}
        />
      </Section>

      <Section
        title="Delegação Tracker"
        description="Clique no status para avançar: Não iniciado → Em transição → Delegado."
      >
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Atividade</TableHead>
                <TableHead>Hoje</TableHead>
                <TableHead>Meta</TableHead>
                <TableHead>h/sem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Horas +</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.delegations.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.activity}</TableCell>
                  <TableCell className="text-muted-foreground">{d.todayOwner}</TableCell>
                  <TableCell>
                    <TargetLabel target={d.targetOwner} />
                  </TableCell>
                  <TableCell className="tabular-nums">{d.hoursPerWeek}h</TableCell>
                  <TableCell>
                    <button type="button" onClick={() => cycleDelegationStatus(d.id, d.status)}>
                      <DelegationStatusBadge status={d.status} />
                    </button>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={0}
                      max={168}
                      className="h-8 w-20"
                      value={d.hoursRecovered}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10);
                        if (!Number.isNaN(v)) updateDelegationHours(d.id, v);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Section>

      <Section title="Mapa de gargalos">
        <div className="grid gap-3 sm:grid-cols-2">
          {state.bottlenecks
            .sort((a, b) => a.order - b.order)
            .map((b) => (
              <div
                key={b.id}
                className={cn(
                  "rounded-xl border p-4",
                  b.status === "active"
                    ? "border-red-400/25 bg-red-400/[0.04]"
                    : "border-border/60 bg-background/30",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">
                    #{b.order} {b.name}
                  </span>
                  <SeverityBadge severity={b.severity} />
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">{b.impact}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Dono: {TEAM_LABELS[b.owner]}
                  {b.status === "active" && (
                    <span className="ml-2 font-medium text-red-400">· ATIVO</span>
                  )}
                </p>
              </div>
            ))}
        </div>
      </Section>
    </div>
  );
}
