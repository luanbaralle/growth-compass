import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { getActivePerson } from "@/lib/admin-auth.server";
import { getDataDir } from "@/lib/data-dir.server";
import { createSeedState } from "./seed";
import {
  getDelegatedCount,
  getHoursRecovered,
  syncProductionMetrics,
} from "./helpers";
import {
  isSupabaseEnabled,
  loadSupabaseExecutionState,
  saveSupabaseExecutionState,
} from "./supabase.server";
import type {
  BacklogColumn,
  CheckinSession,
  ClientRecord,
  DelegationStatus,
  ExecutionState,
  PlanningSession,
  ProductionCard,
  ProductionStage,
  ReviewSession,
  TaskStatus,
  TeamCapacityEntry,
  TeamMember,
} from "./types";
import type { HoursSnapshot } from "./hours-types";

const EXECUTION_FILE = path.join(getDataDir(), "execution.json");

function createHoursSnapshot(
  state: ExecutionState,
  source: HoursSnapshot["source"],
  weekLabel: string,
  recordedBy?: TeamMember,
): HoursSnapshot {
  return {
    id: randomUUID(),
    date: new Date().toISOString().slice(0, 10),
    week: state.currentWeek,
    weekLabel,
    hoursRecovered: getHoursRecovered(state),
    hoursGoal: state.northStar.hoursGoalMonthly,
    delegatedCount: getDelegatedCount(state),
    totalDelegations: state.delegations.length,
    productionQueue: state.metrics.productionQueue,
    avgDelayDays: state.metrics.avgDelayDays,
    recordedBy,
    source,
  };
}

function appendHoursSnapshot(state: ExecutionState, snapshot: HoursSnapshot): void {
  const existing = state.hoursHistory?.find(
    (h) => h.week === snapshot.week && h.weekLabel === snapshot.weekLabel,
  );
  const history = state.hoursHistory ?? [];
  if (existing) {
    state.hoursHistory = history.map((h) =>
      h.id === existing.id ? { ...snapshot, id: existing.id } : h,
    );
  } else {
    state.hoursHistory = [...history, snapshot].slice(-24);
  }
}

function migrateState(state: ExecutionState): ExecutionState {
  const seed = createSeedState();
  let next: ExecutionState = { ...state };

  if (!next.productions?.length || next.version < 2) {
    next = {
      ...seed,
      ...next,
      version: 2,
      productions: next.productions?.length ? next.productions : seed.productions,
      clients: next.clients?.length ? next.clients : seed.clients,
      teamCapacity: next.teamCapacity?.length ? next.teamCapacity : seed.teamCapacity,
      sops: next.sops?.length ? next.sops : seed.sops,
    };
  }

  if (!next.hoursHistory?.length || next.version < 3) {
    next = {
      ...next,
      version: 3,
      hoursHistory: next.hoursHistory?.length ? next.hoursHistory : seed.hoursHistory,
    };
  }

  return next;
}

async function loadJsonState(): Promise<ExecutionState | null> {
  await mkdir(path.dirname(EXECUTION_FILE), { recursive: true });
  try {
    const raw = await readFile(EXECUTION_FILE, "utf-8");
    return migrateState(JSON.parse(raw) as ExecutionState);
  } catch {
    return null;
  }
}

async function persistState(state: ExecutionState): Promise<void> {
  await mkdir(path.dirname(EXECUTION_FILE), { recursive: true });
  await writeFile(EXECUTION_FILE, JSON.stringify(state, null, 2), "utf-8");
  if (isSupabaseEnabled()) {
    await saveSupabaseExecutionState(state);
  }
}

async function ensureStore(): Promise<ExecutionState> {
  if (isSupabaseEnabled()) {
    try {
      const remote = await loadSupabaseExecutionState();
      if (remote) {
        const migrated = migrateState(remote);
        await persistState(migrated);
        return migrated;
      }
    } catch {
      // fallback to local JSON
    }
  }

  const local = await loadJsonState();
  if (local) {
    await persistState(local);
    return local;
  }

  const seed = createSeedState();
  await persistState(seed);
  return seed;
}

async function saveState(state: ExecutionState): Promise<ExecutionState> {
  const synced = syncProductionMetrics(state);
  const next = { ...synced, updatedAt: new Date().toISOString() };
  await persistState(next);
  return next;
}

export async function getExecutionState(): Promise<ExecutionState> {
  return ensureStore();
}

export async function resetExecutionState(): Promise<ExecutionState> {
  return saveState(createSeedState());
}

export async function updatePlanDelivery(
  id: string,
  status: TaskStatus,
): Promise<ExecutionState> {
  const state = await ensureStore();
  const index = state.planDeliveries.findIndex((d) => d.id === id);
  if (index === -1) throw new Error("Entrega não encontrada.");

  state.planDeliveries[index] = { ...state.planDeliveries[index], status };
  return saveState(state);
}

export async function setCurrentWeek(week: number): Promise<ExecutionState> {
  const state = await ensureStore();
  state.currentWeek = week;
  return saveState(state);
}

export async function updateDelegation(
  id: string,
  patch: Partial<{
    status: DelegationStatus;
    hoursRecovered: number;
  }>,
): Promise<ExecutionState> {
  const state = await ensureStore();
  const index = state.delegations.findIndex((d) => d.id === id);
  if (index === -1) throw new Error("Delegação não encontrada.");

  state.delegations[index] = { ...state.delegations[index], ...patch };
  return saveState(state);
}

export async function moveBacklogItem(
  id: string,
  column: BacklogColumn,
): Promise<ExecutionState> {
  const state = await ensureStore();
  const index = state.backlog.findIndex((b) => b.id === id);
  if (index === -1) throw new Error("Item não encontrado.");

  if (column === "agora") {
    const agoraCount = state.backlog.filter((b) => b.column === "agora" && b.id !== id).length;
    if (agoraCount >= 3) {
      throw new Error('Coluna "Agora" aceita no máximo 3 itens.');
    }
  }

  state.backlog[index] = { ...state.backlog[index], column };
  return saveState(state);
}

export async function toggleImmediateAction(id: string): Promise<ExecutionState> {
  const state = await ensureStore();
  const index = state.immediateActions.findIndex((a) => a.id === id);
  if (index === -1) throw new Error("Ação não encontrada.");

  state.immediateActions[index] = {
    ...state.immediateActions[index],
    done: !state.immediateActions[index].done,
  };
  return saveState(state);
}

export async function updateMetrics(patch: {
  productionQueue?: number;
  avgDelayDays?: number;
}): Promise<ExecutionState> {
  const state = await ensureStore();
  state.metrics = { ...state.metrics, ...patch };

  const active = state.bottlenecks.find((b) => b.status === "active");
  if (active) {
    if (patch.productionQueue !== undefined) active.queueCount = patch.productionQueue;
    if (patch.avgDelayDays !== undefined) active.avgDelayDays = patch.avgDelayDays;
  }

  return saveState(state);
}

export async function savePlanningSession(session: PlanningSession): Promise<ExecutionState> {
  const state = await ensureStore();
  state.planningSession = session;
  return saveState(state);
}

export async function updateBottleneckMetrics(
  id: string,
  patch: { queueCount?: number; avgDelayDays?: number },
): Promise<ExecutionState> {
  const state = await ensureStore();
  const index = state.bottlenecks.findIndex((b) => b.id === id);
  if (index === -1) throw new Error("Gargalo não encontrado.");

  state.bottlenecks[index] = { ...state.bottlenecks[index], ...patch };
  if (state.bottlenecks[index].status === "active") {
    if (patch.queueCount !== undefined) state.metrics.productionQueue = patch.queueCount;
    if (patch.avgDelayDays !== undefined) state.metrics.avgDelayDays = patch.avgDelayDays;
  }
  return saveState(state);
}

export async function moveProductionCard(
  id: string,
  stage: ProductionStage,
): Promise<ExecutionState> {
  const state = await ensureStore();
  const index = state.productions.findIndex((p) => p.id === id);
  if (index === -1) throw new Error("Produção não encontrada.");

  const now = new Date().toISOString();
  state.productions[index] = {
    ...state.productions[index],
    stage,
    stageEnteredAt: now,
    daysInStage: 0,
  };
  return saveState(state);
}

export async function createProductionCard(
  input: Omit<ProductionCard, "id" | "daysInStage" | "stageEnteredAt">,
): Promise<ExecutionState> {
  const state = await ensureStore();
  const card: ProductionCard = {
    ...input,
    id: randomUUID(),
    daysInStage: 0,
    stageEnteredAt: new Date().toISOString(),
  };
  state.productions.unshift(card);
  return saveState(state);
}

export async function updateProductionCard(
  id: string,
  patch: Partial<Pick<ProductionCard, "title" | "briefing" | "notes" | "dueDate" | "owner">>,
): Promise<ExecutionState> {
  const state = await ensureStore();
  const index = state.productions.findIndex((p) => p.id === id);
  if (index === -1) throw new Error("Produção não encontrada.");

  state.productions[index] = { ...state.productions[index], ...patch };
  return saveState(state);
}

export async function deleteProductionCard(id: string): Promise<ExecutionState> {
  const state = await ensureStore();
  state.productions = state.productions.filter((p) => p.id !== id);
  return saveState(state);
}

export async function updateClient(
  id: string,
  patch: Partial<Pick<ClientRecord, "nextAction" | "observation" | "status">>,
): Promise<ExecutionState> {
  const state = await ensureStore();
  const index = state.clients.findIndex((c) => c.id === id);
  if (index === -1) throw new Error("Cliente não encontrado.");

  state.clients[index] = { ...state.clients[index], ...patch };
  return saveState(state);
}

export async function updateTeamCapacity(entries: TeamCapacityEntry[]): Promise<ExecutionState> {
  const state = await ensureStore();
  state.teamCapacity = entries.map((e) => ({
    ...e,
    freeHours: Math.max(0, e.totalHours - e.committedHours),
  }));
  return saveState(state);
}

export async function toggleSopItem(sopId: string, itemId: string): Promise<ExecutionState> {
  const state = await ensureStore();
  const sopIndex = state.sops.findIndex((s) => s.id === sopId);
  if (sopIndex === -1) throw new Error("SOP não encontrado.");

  const itemIndex = state.sops[sopIndex].items.findIndex((i) => i.id === itemId);
  if (itemIndex === -1) throw new Error("Item não encontrado.");

  const item = state.sops[sopIndex].items[itemIndex];
  state.sops[sopIndex].items[itemIndex] = { ...item, done: !item.done };
  return saveState(state);
}

export async function resetSopChecklist(sopId: string): Promise<ExecutionState> {
  const state = await ensureStore();
  const sopIndex = state.sops.findIndex((s) => s.id === sopId);
  if (sopIndex === -1) throw new Error("SOP não encontrado.");

  state.sops[sopIndex].items = state.sops[sopIndex].items.map((i) => ({ ...i, done: false }));
  return saveState(state);
}

export async function saveCheckinSession(session: CheckinSession): Promise<ExecutionState> {
  const state = await ensureStore();
  state.checkinSession = session;
  state.metrics.productionQueue = session.queueVideos;
  const active = state.bottlenecks.find((b) => b.status === "active");
  if (active) active.queueCount = session.queueVideos;
  return saveState(state);
}

export async function saveReviewSession(session: ReviewSession): Promise<ExecutionState> {
  const state = await ensureStore();
  state.reviewSession = session;
  state.metrics.productionQueue = session.queueVideos;
  state.metrics.avgDelayDays = session.avgDelayDays;
  const active = state.bottlenecks.find((b) => b.status === "active");
  if (active) {
    active.queueCount = session.queueVideos;
    active.avgDelayDays = session.avgDelayDays;
  }
  const snapshot = createHoursSnapshot(
    state,
    "review",
    session.weekLabel,
    getActivePerson() ?? undefined,
  );
  appendHoursSnapshot(state, snapshot);
  return saveState(state);
}

export async function recordHoursSnapshot(): Promise<ExecutionState> {
  const state = await ensureStore();
  const snapshot = createHoursSnapshot(
    state,
    "manual",
    `Manual ${new Date().toLocaleDateString("pt-BR")}`,
    getActivePerson() ?? undefined,
  );
  appendHoursSnapshot(state, snapshot);
  return saveState(state);
}

export async function updateTeamMemberCapacity(
  member: TeamMember,
  patch: Partial<Pick<TeamCapacityEntry, "totalHours" | "committedHours">>,
): Promise<ExecutionState> {
  const state = await ensureStore();
  const index = state.teamCapacity.findIndex((t) => t.member === member);
  if (index === -1) throw new Error("Membro não encontrado.");

  const entry = { ...state.teamCapacity[index], ...patch };
  entry.freeHours = Math.max(0, entry.totalHours - entry.committedHours);
  state.teamCapacity[index] = entry;
  return saveState(state);
}
