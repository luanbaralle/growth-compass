import type {
  BacklogColumn,
  CheckinSession,
  DelegationStatus,
  ExecutionState,
  PlanDelivery,
  ProductionStage,
  ReviewSession,
  TaskStatus,
  TeamMember,
} from "./types";

export function getActiveBottleneck(state: ExecutionState) {
  return (
    state.bottlenecks.find((b) => b.status === "active") ??
    state.bottlenecks.sort((a, b) => a.order - b.order)[0]
  );
}

export function getHoursRecovered(state: ExecutionState): number {
  return state.delegations.reduce((sum, d) => sum + d.hoursRecovered, 0);
}

export function getDelegatedCount(state: ExecutionState): number {
  return state.delegations.filter((d) => d.status === "delegated").length;
}

export function getWeekDeliveries(state: ExecutionState, week?: number): PlanDelivery[] {
  const w = week ?? state.currentWeek;
  return state.planDeliveries
    .filter((d) => d.week === w)
    .sort((a, b) => a.number - b.number);
}

export function getWeekProgress(state: ExecutionState, week?: number): number {
  const deliveries = getWeekDeliveries(state, week);
  if (deliveries.length === 0) return 0;
  const done = deliveries.filter((d) => d.status === "done").length;
  return Math.round((done / deliveries.length) * 100);
}

export function getBacklogByColumn(state: ExecutionState, column: BacklogColumn) {
  return state.backlog.filter((b) => b.column === column);
}

export function getAgoraCount(state: ExecutionState): number {
  return getBacklogByColumn(state, "agora").length;
}

export function formatDateBR(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

export function getNextRitual(): { name: string; day: string; path: string } {
  const day = new Date().getDay();
  if (day === 1) {
    return { name: "Planning semanal", day: "Hoje", path: "/admin/execucao/rituais/planning" };
  }
  if (day === 3) {
    return { name: "Check-in operacional", day: "Hoje", path: "/admin/execucao/rituais/checkin" };
  }
  if (day === 5) {
    return { name: "Review + métricas", day: "Hoje", path: "/admin/execucao/rituais/review" };
  }
  if (day < 3) {
    return {
      name: "Check-in operacional",
      day: "Quarta",
      path: "/admin/execucao/rituais/checkin",
    };
  }
  if (day < 5) {
    return { name: "Review + métricas", day: "Sexta", path: "/admin/execucao/rituais/review" };
  }
  return { name: "Planning semanal", day: "Segunda", path: "/admin/execucao/rituais/planning" };
}

export function buildPlanningWhatsApp(state: ExecutionState, session: ExecutionState["planningSession"]) {
  if (!session) return "";

  const lines = [
    `📋 PLANNING — Semana ${session.weekLabel}`,
    "",
    "Prioridades:",
    ...session.priorities.map(
      (p, i) => `${i + 1}. ${p.text} — Dono: ${p.owner} — Prazo: ${p.dueDate}`,
    ),
    "",
    "Bloqueios:",
    session.blockers.trim() ? `- ${session.blockers.trim()}` : "- Nenhum",
    "",
    `Fila de edição: ${session.queueVideos} vídeos pendentes (${session.avgDelayDays} dias atraso médio)`,
  ];

  return lines.join("\n");
}

export const STATUS_CYCLE: TaskStatus[] = ["pending", "in_progress", "done", "blocked"];

export const DELEGATION_CYCLE: DelegationStatus[] = [
  "not_started",
  "in_transition",
  "delegated",
];

export function memberTasks(state: ExecutionState, member: TeamMember) {
  const week = getWeekDeliveries(state);
  const planTasks = week.filter((d) => d.owner === member && d.status !== "done");
  const actions = state.immediateActions.filter((a) => a.owner === member && !a.done);
  const backlog = state.backlog.filter((b) => b.owner === member && b.column === "agora");
  const productions = state.productions.filter(
    (p) => p.owner === member && p.stage !== "publicado",
  );
  return { planTasks, actions, backlog, productions };
}

export function getProductionsByStage(state: ExecutionState, stage: ProductionStage) {
  return state.productions.filter((p) => p.stage === stage);
}

export function getActiveProductionCount(state: ExecutionState): number {
  return state.productions.filter((p) => p.stage !== "publicado").length;
}

export function getStalledProductions(state: ExecutionState, minDays = 5) {
  return state.productions.filter(
    (p) => p.stage !== "publicado" && p.daysInStage >= minDays,
  );
}

export function computeDaysInStage(stageEnteredAt: string): number {
  const entered = new Date(stageEnteredAt).getTime();
  const now = Date.now();
  return Math.floor((now - entered) / (1000 * 60 * 60 * 24));
}

export function syncProductionMetrics(state: ExecutionState): ExecutionState {
  const active = state.productions.filter((p) => p.stage !== "publicado");
  const queue = active.length;
  const withDue = active.filter((p) => p.dueDate);
  const today = new Date().toISOString().slice(0, 10);
  const delayed = withDue.filter((p) => p.dueDate < today);
  const avgDelay =
    delayed.length > 0
      ? Math.round(
          delayed.reduce((sum, p) => {
            const due = new Date(p.dueDate).getTime();
            return sum + (Date.now() - due) / (1000 * 60 * 60 * 24);
          }, 0) / delayed.length,
        )
      : 0;

  state.productions = state.productions.map((p) => ({
    ...p,
    daysInStage: computeDaysInStage(p.stageEnteredAt),
  }));

  state.metrics.productionQueue = queue;
  state.metrics.avgDelayDays = avgDelay;

  const bn = state.bottlenecks.find((b) => b.status === "active");
  if (bn) {
    bn.queueCount = queue;
    bn.avgDelayDays = avgDelay;
  }

  return state;
}

export function getClientName(state: ExecutionState, clientId: string): string {
  return state.clients.find((c) => c.id === clientId)?.name ?? clientId;
}

export function buildCheckinWhatsApp(session: CheckinSession): string {
  return [
    "⚡ CHECK-IN — Quarta",
    "",
    `Fila de edição: ${session.queueVideos} vídeos`,
    `Atrasados >3 dias: ${session.delayedCount}`,
    session.blockedPerson
      ? `Travado: ${TEAM_LABELS[session.blockedPerson]}`
      : "Travado: ninguém",
    session.outOfScopeAppeared
      ? `Fora de escopo: sim — ${session.outOfScopeDetail ?? "ver detalhe"}`
      : "Fora de escopo: não",
    `Editor freelancer: ${session.editorStatus}`,
  ].join("\n");
}

export function buildReviewWhatsApp(session: ReviewSession): string {
  return [
    `📊 REVIEW — Semana ${session.weekLabel}`,
    "",
    "✅ Fechou:",
    ...(session.completed.length ? session.completed.map((c) => `- ${c}`) : ["- Nada"]),
    "",
    "❌ Não fechou:",
    ...(session.notCompleted.length
      ? session.notCompleted.map((c) => `- ${c.text} (motivo: ${c.reason})`)
      : ["- Nada"]),
    "",
    "📈 Métricas:",
    `- Fila edição: ${session.queueVideos} vídeos`,
    `- Atraso médio: ${session.avgDelayDays} dias`,
    `- Fora de escopo: ${session.outOfScopeTotal} pedidos (${session.outOfScopeRejected} recusados)`,
    "",
    "➡️ Próxima semana:",
    ...session.nextWeekPriorities.map((p, i) => `${i + 1}. ${p}`),
  ].join("\n");
}

export function getProductionStageIndex(stage: ProductionStage): number {
  return PRODUCTION_STAGE_ORDER.indexOf(stage);
}

export function getNextProductionStage(stage: ProductionStage): ProductionStage | null {
  const idx = getProductionStageIndex(stage);
  if (idx < 0 || idx >= PRODUCTION_STAGE_ORDER.length - 1) return null;
  return PRODUCTION_STAGE_ORDER[idx + 1];
}

export function getPrevProductionStage(stage: ProductionStage): ProductionStage | null {
  const idx = getProductionStageIndex(stage);
  if (idx <= 0) return null;
  return PRODUCTION_STAGE_ORDER[idx - 1];
}
