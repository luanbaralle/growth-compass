import { z } from "zod";
import { PROJECT_PRIORITIES, PROJECT_STATUSES, PROJECT_TYPES } from "./types";

export const projectStatusSchema = z.enum(PROJECT_STATUSES as [string, ...string[]]);
export const projectPrioritySchema = z.enum(PROJECT_PRIORITIES as [string, ...string[]]);
export const projectTypeSchema = z.enum(PROJECT_TYPES as [string, ...string[]]);

export const createProjectSchema = z.object({
  companyId: z.string().uuid(),
  title: z.string().min(2).max(200),
  type: projectTypeSchema,
  status: projectStatusSchema.optional(),
  ownerId: z.enum(["luan", "vini", "caio"]).optional(),
  priority: projectPrioritySchema.optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
  description: z.string().max(5000).optional(),
});

export const updateProjectSchema = createProjectSchema
  .omit({ companyId: true })
  .partial()
  .extend({
    id: z.string().uuid(),
    companyId: z.string().uuid(),
  });

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
