import { z } from "zod";

const dueDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .optional()
  .or(z.literal(""));

export const createTaskSchema = z.object({
  title: z.string().min(2).max(200),
  dueDate: dueDateSchema,
  companyId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
});

export const taskIdSchema = z.object({
  id: z.string().uuid(),
});

export const completeTaskSchema = taskIdSchema.extend({
  done: z.boolean(),
});
