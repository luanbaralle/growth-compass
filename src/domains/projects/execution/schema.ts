import { z } from "zod";
import { PROJECT_PRIORITIES } from "../types";
import { WORKFLOW_TASK_STATUSES } from "./types";

const prioritySchema = z.enum(PROJECT_PRIORITIES as [string, ...string[]]);
const taskStatusSchema = z.enum(WORKFLOW_TASK_STATUSES as [string, ...string[]]);

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
