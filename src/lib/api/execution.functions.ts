import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-auth.server";
import {
  createProductionCard,
  deleteProductionCard,
  getExecutionState,
  moveBacklogItem,
  moveProductionCard,
  recordHoursSnapshot,
  resetExecutionState,
  resetSopChecklist,
  saveCheckinSession,
  savePlanningSession,
  saveReviewSession,
  setCurrentWeek,
  toggleImmediateAction,
  toggleSopItem,
  updateBottleneckMetrics,
  updateClient,
  updateDelegation,
  updateMetrics,
  updatePlanDelivery,
  updateProductionCard,
  updateTeamMemberCapacity,
} from "@/lib/execution/store.server";
import { formatAllSopsForNotion, formatSingleSopForNotion } from "@/lib/execution/notion-export";

function requireAuth() {
  if (!isAdminAuthenticated()) {
    throw new Error("Não autorizado.");
  }
}

export const fetchExecutionState = createServerFn({ method: "GET" }).handler(async () => {
  requireAuth();
  return getExecutionState();
});

export const resetExecution = createServerFn({ method: "POST" }).handler(async () => {
  requireAuth();
  return resetExecutionState();
});

export const patchPlanDelivery = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string().min(1),
      status: z.enum(["pending", "in_progress", "done", "blocked"]),
    }),
  )
  .handler(async ({ data }) => {
    requireAuth();
    return updatePlanDelivery(data.id, data.status);
  });

export const patchCurrentWeek = createServerFn({ method: "POST" })
  .validator(z.object({ week: z.number().int().min(1).max(4) }))
  .handler(async ({ data }) => {
    requireAuth();
    return setCurrentWeek(data.week);
  });

export const patchDelegation = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string().min(1),
      status: z.enum(["not_started", "in_transition", "delegated"]).optional(),
      hoursRecovered: z.number().min(0).max(168).optional(),
    }),
  )
  .handler(async ({ data }) => {
    requireAuth();
    const { id, ...patch } = data;
    return updateDelegation(id, patch);
  });

export const patchBacklogColumn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string().min(1),
      column: z.enum(["agora", "proximo", "depois", "nao_agora"]),
    }),
  )
  .handler(async ({ data }) => {
    requireAuth();
    return moveBacklogItem(data.id, data.column);
  });

export const patchImmediateAction = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    requireAuth();
    return toggleImmediateAction(data.id);
  });

export const patchMetrics = createServerFn({ method: "POST" })
  .validator(
    z.object({
      productionQueue: z.number().int().min(0).optional(),
      avgDelayDays: z.number().min(0).optional(),
    }),
  )
  .handler(async ({ data }) => {
    requireAuth();
    return updateMetrics(data);
  });

export const patchBottleneckMetrics = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string().min(1),
      queueCount: z.number().int().min(0).optional(),
      avgDelayDays: z.number().min(0).optional(),
    }),
  )
  .handler(async ({ data }) => {
    requireAuth();
    const { id, ...patch } = data;
    return updateBottleneckMetrics(id, patch);
  });

const planningPrioritySchema = z.object({
  text: z.string().min(1).max(300),
  owner: z.enum(["luan", "vini", "caio"]),
  dueDate: z.string().min(1).max(20),
});

export const savePlanning = createServerFn({ method: "POST" })
  .validator(
    z.object({
      week: z.number().int().min(1).max(4),
      weekLabel: z.string().min(1).max(40),
      priorities: z.array(planningPrioritySchema).min(1).max(3),
      blockers: z.string().max(500),
      queueVideos: z.number().int().min(0),
      avgDelayDays: z.number().min(0),
    }),
  )
  .handler(async ({ data }) => {
    requireAuth();
    return savePlanningSession({
      ...data,
      updatedAt: new Date().toISOString(),
    });
  });

export const patchProductionStage = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string().min(1),
      stage: z.enum([
        "briefing",
        "editando",
        "revisao",
        "aprovado",
        "agendado",
        "publicado",
      ]),
    }),
  )
  .handler(async ({ data }) => {
    requireAuth();
    return moveProductionCard(data.id, data.stage);
  });

export const addProductionCard = createServerFn({ method: "POST" })
  .validator(
    z.object({
      title: z.string().min(1).max(200),
      clientId: z.string().min(1),
      type: z.enum(["imovel", "prova_social", "autoridade"]),
      stage: z
        .enum(["briefing", "editando", "revisao", "aprovado", "agendado", "publicado"])
        .default("briefing"),
      owner: z.enum(["luan", "vini", "caio"]),
      dueDate: z.string().min(1),
      briefing: z.string().max(500).optional(),
      notes: z.string().max(500).optional(),
    }),
  )
  .handler(async ({ data }) => {
    requireAuth();
    return createProductionCard(data);
  });

export const patchProductionCard = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string().min(1),
      title: z.string().min(1).max(200).optional(),
      briefing: z.string().max(500).optional(),
      notes: z.string().max(500).optional(),
      dueDate: z.string().optional(),
      owner: z.enum(["luan", "vini", "caio"]).optional(),
    }),
  )
  .handler(async ({ data }) => {
    requireAuth();
    const { id, ...patch } = data;
    return updateProductionCard(id, patch);
  });

export const removeProductionCard = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    requireAuth();
    return deleteProductionCard(data.id);
  });

export const patchClient = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string().min(1),
      nextAction: z.string().max(300).optional(),
      observation: z.string().max(300).optional(),
      status: z.enum(["active", "prospect", "paused"]).optional(),
    }),
  )
  .handler(async ({ data }) => {
    requireAuth();
    const { id, ...patch } = data;
    return updateClient(id, patch);
  });

export const patchTeamCapacity = createServerFn({ method: "POST" })
  .validator(
    z.object({
      member: z.enum(["luan", "vini", "caio"]),
      totalHours: z.number().min(0).max(168),
      committedHours: z.number().min(0).max(168),
    }),
  )
  .handler(async ({ data }) => {
    requireAuth();
    const { member, ...patch } = data;
    return updateTeamMemberCapacity(member, patch);
  });

export const patchSopItem = createServerFn({ method: "POST" })
  .validator(z.object({ sopId: z.string().min(1), itemId: z.string().min(1) }))
  .handler(async ({ data }) => {
    requireAuth();
    return toggleSopItem(data.sopId, data.itemId);
  });

export const resetSop = createServerFn({ method: "POST" })
  .validator(z.object({ sopId: z.string().min(1) }))
  .handler(async ({ data }) => {
    requireAuth();
    return resetSopChecklist(data.sopId);
  });

export const saveCheckin = createServerFn({ method: "POST" })
  .validator(
    z.object({
      queueVideos: z.number().int().min(0),
      delayedCount: z.number().int().min(0),
      blockedPerson: z.enum(["luan", "vini", "caio"]).optional(),
      outOfScopeAppeared: z.boolean(),
      outOfScopeDetail: z.string().max(300).optional(),
      editorStatus: z.string().min(1).max(200),
    }),
  )
  .handler(async ({ data }) => {
    requireAuth();
    return saveCheckinSession({ ...data, updatedAt: new Date().toISOString() });
  });

const reviewNotCompletedSchema = z.object({
  text: z.string().min(1).max(300),
  reason: z.string().max(300),
});

export const saveReview = createServerFn({ method: "POST" })
  .validator(
    z.object({
      week: z.number().int().min(1).max(4),
      weekLabel: z.string().min(1).max(40),
      completed: z.array(z.string().max(300)),
      notCompleted: z.array(reviewNotCompletedSchema),
      queueVideos: z.number().int().min(0),
      avgDelayDays: z.number().min(0),
      outOfScopeTotal: z.number().int().min(0),
      outOfScopeRejected: z.number().int().min(0),
      nextWeekPriorities: z.array(z.string().max(300)).max(3),
    }),
  )
  .handler(async ({ data }) => {
    requireAuth();
    return saveReviewSession({ ...data, updatedAt: new Date().toISOString() });
  });

export const snapshotHours = createServerFn({ method: "POST" }).handler(async () => {
  requireAuth();
  return recordHoursSnapshot();
});

export const exportNotionSops = createServerFn({ method: "POST" })
  .validator(z.object({ sopId: z.string().optional() }))
  .handler(async ({ data }) => {
    requireAuth();
    const state = await getExecutionState();
    if (data.sopId) {
      const markdown = formatSingleSopForNotion(state, data.sopId);
      if (!markdown) throw new Error("SOP não encontrado.");
      return { markdown, filename: `sop-${data.sopId}.md` };
    }
    return {
      markdown: formatAllSopsForNotion(state),
      filename: "raise-one-playbooks.md",
    };
  });
