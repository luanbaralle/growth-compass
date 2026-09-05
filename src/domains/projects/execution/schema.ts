import { z } from "zod";
import { PROJECT_PRIORITIES, PROJECT_STATUSES } from "../types";
import { WORKFLOW_TASK_STATUSES } from "./types";

const prioritySchema = z.enum(PROJECT_PRIORITIES as [string, ...string[]]);
const taskStatusSchema = z.enum(WORKFLOW_TASK_STATUSES as [string, ...string[]]);
const projectStatusSchema = z.enum(PROJECT_STATUSES as [string, ...string[]]);

const keySchema = z
  .string()
  .min(1)
  .max(80)
  .regex(/^[a-z][a-z0-9_]*$/, "Use snake_case (ex.: formalization, send_contract)");

const checklistItemSchema = z.object({
  id: z.string().min(1).max(80),
  label: z.string().min(1).max(500),
  done: z.boolean(),
  group: z.string().max(120).optional(),
});

const templateTaskDraftSchema = z.object({
  key: keySchema,
  title: z.string().min(1).max(200),
  description: z.string().max(5000).nullable().optional(),
  defaultPriority: prioritySchema.default("medium"),
  defaultAssigneeId: z.enum(["luan", "vini", "caio"]).nullable().optional(),
  isRecurring: z.boolean().default(false),
  blocksPhaseCompletion: z.boolean().default(true),
  waitingClientDefault: z.boolean().default(false),
  checklist: z.array(checklistItemSchema).default([]),
  dependsOnTaskKeys: z.array(z.string().min(1).max(80)).default([]),
});

const templatePhaseDraftSchema = z.object({
  key: keySchema,
  name: z.string().min(1).max(120),
  objective: z.string().max(2000).nullable().optional(),
  isRecurring: z.boolean().default(false),
  completionCriteria: z.string().max(2000).nullable().optional(),
  projectStatusOnEnter: projectStatusSchema.nullable().optional(),
  deliverables: z.array(z.string().min(1).max(200)).default([]),
  tasks: z.array(templateTaskDraftSchema).default([]),
});

export const templateIdSchema = z.object({
  templateId: z.string().uuid(),
});

export const createWorkflowTemplateSchema = z.object({
  name: z.string().min(1).max(160),
  description: z.string().max(2000).nullable().optional(),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z][a-z0-9-]*$/, "Slug inválido")
    .optional(),
});

export const updateWorkflowTemplateMetaSchema = z.object({
  templateId: z.string().uuid(),
  name: z.string().min(1).max(160).optional(),
  description: z.string().max(2000).nullable().optional(),
  isActive: z.boolean().optional(),
});

export const saveWorkflowTemplateStructureSchema = z.object({
  templateId: z.string().uuid(),
  phases: z.array(templatePhaseDraftSchema).min(1).max(40),
});

export const duplicateWorkflowTemplateSchema = z.object({
  templateId: z.string().uuid(),
  name: z.string().min(1).max(160).optional(),
});

export const applyWorkflowTemplateSchema = z.object({
  projectId: z.string().uuid(),
  templateSlug: z.string().min(1).max(100).optional(),
});

export const projectWorkflowIdSchema = z.object({
  projectId: z.string().uuid(),
});

export const updateWorkflowTaskSchema = z.object({
  projectId: z.string().uuid(),
  taskId: z.string().uuid(),
  status: taskStatusSchema.optional(),
  priority: prioritySchema.optional(),
  assigneeId: z.enum(["luan", "vini", "caio"]).nullable().optional(),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .optional()
    .or(z.literal("")),
  notes: z.string().max(5000).nullable().optional(),
  checklistJson: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        done: z.boolean(),
        group: z.string().optional(),
      }),
    )
    .optional(),
  dependencyOverride: z.boolean().optional(),
  waitingClientName: z.string().max(200).nullable().optional(),
  waitingClientDue: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .optional()
    .or(z.literal("")),
});

export const setWaitingClientSchema = z.object({
  projectId: z.string().uuid(),
  taskId: z.string().uuid(),
  clientName: z.string().min(1).max(200),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .or(z.literal("")),
  notes: z.string().max(5000).optional(),
});

export const resumeWorkflowTaskSchema = z.object({
  projectId: z.string().uuid(),
  taskId: z.string().uuid(),
  status: z.enum(["todo", "in_progress"]).optional(),
});

export const completeWorkflowTaskSchema = z.object({
  projectId: z.string().uuid(),
  taskId: z.string().uuid(),
  overrideDependencies: z.boolean().optional(),
});

export const completeDeliverableSchema = z.object({
  projectId: z.string().uuid(),
  deliverableId: z.string().uuid(),
});

export const upsertBriefingSchema = z.object({
  projectId: z.string().uuid(),
  objective: z.string().max(5000).optional().nullable(),
  offer: z.string().max(5000).optional().nullable(),
  audience: z.string().max(5000).optional().nullable(),
  location: z.string().max(2000).optional().nullable(),
  differentials: z.string().max(5000).optional().nullable(),
  services: z.string().max(5000).optional().nullable(),
  hours: z.string().max(2000).optional().nullable(),
  pricing: z.string().max(2000).optional().nullable(),
  availability: z.string().max(2000).optional().nullable(),
  commercialProcess: z.string().max(5000).optional().nullable(),
  currentChannels: z.string().max(2000).optional().nullable(),
  competitors: z.string().max(2000).optional().nullable(),
  notes: z.string().max(5000).optional().nullable(),
  status: z.enum(["draft", "sent", "received", "approved"]).optional(),
});
