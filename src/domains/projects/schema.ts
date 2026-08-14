import { z } from "zod";
import {
  PROJECT_BLOCKED_BY_TYPES,
  PROJECT_PRIORITIES,
  PROJECT_STATUSES,
  PROJECT_TYPES,
} from "./types";

export const projectStatusSchema = z.enum(PROJECT_STATUSES as [string, ...string[]]);
export const projectPrioritySchema = z.enum(PROJECT_PRIORITIES as [string, ...string[]]);
export const projectTypeSchema = z.enum(PROJECT_TYPES as [string, ...string[]]);
export const projectBlockedByTypeSchema = z.enum(
  PROJECT_BLOCKED_BY_TYPES as [string, ...string[]],
);

const optionalDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .optional()
  .or(z.literal(""));

const optionalTextSchema = z.string().max(5000).optional().or(z.literal(""));

const projectOperationalFields = {
  blockedByType: projectBlockedByTypeSchema.optional().nullable(),
  blockedByDetail: optionalTextSchema.nullable(),
  nextAction: z.string().max(500).optional().or(z.literal("")),
  nextActionDue: optionalDateSchema,
};

function validateBlockedProject(
  data: {
    status?: string;
    blockedByType?: string | null;
    blockedByDetail?: string | null;
  },
  ctx: z.RefinementCtx,
) {
  if (data.status !== "blocked") return;
  if (!data.blockedByType) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Informe o motivo do bloqueio.",
      path: ["blockedByType"],
    });
  }
  if (!data.blockedByDetail?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Descreva o bloqueio.",
      path: ["blockedByDetail"],
    });
  }
}

const projectFieldsSchema = z.object({
  companyId: z.string().uuid(),
  title: z.string().min(2).max(200),
  type: projectTypeSchema,
  status: projectStatusSchema.optional(),
  ownerId: z.enum(["luan", "vini", "caio"]).optional(),
  priority: projectPrioritySchema.optional(),
  dueDate: optionalDateSchema,
  description: z.string().max(5000).optional(),
  ...projectOperationalFields,
});

export const createProjectSchema = projectFieldsSchema.superRefine(validateBlockedProject);

export const updateProjectSchema = projectFieldsSchema
  .omit({ companyId: true })
  .partial()
  .extend({
    id: z.string().uuid(),
    companyId: z.string().uuid(),
  })
  .superRefine(validateBlockedProject);

export const listProjectsSchema = z.object({
  search: z.string().max(200).optional(),
  status: z.union([projectStatusSchema, z.literal("all")]).optional(),
  companyId: z.string().uuid().optional(),
  ownerId: z.union([z.enum(["luan", "vini", "caio"]), z.literal("all")]).optional(),
  sort: z.enum(["due_date", "created_at", "title", "priority"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

export const projectIdSchema = z.object({ id: z.string().uuid() });

export const projectCompanyIdSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
});

export const createChecklistItemSchema = z.object({
  projectId: z.string().uuid(),
  companyId: z.string().uuid(),
  text: z.string().min(1).max(500),
});

export const updateChecklistItemSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  companyId: z.string().uuid(),
  text: z.string().min(1).max(500).optional(),
  done: z.boolean().optional(),
});

export const deleteChecklistItemSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  companyId: z.string().uuid(),
});

export const createCommentSchema = z.object({
  projectId: z.string().uuid(),
  companyId: z.string().uuid(),
  body: z.string().min(1).max(5000),
});

export const deleteCommentSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  companyId: z.string().uuid(),
});
