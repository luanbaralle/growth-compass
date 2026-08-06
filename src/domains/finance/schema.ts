import { z } from "zod";
import { FINANCE_STATUSES, FINANCE_TYPES } from "./types";

export const financeTypeSchema = z.enum(FINANCE_TYPES as [string, ...string[]]);
export const financeStatusSchema = z.enum(FINANCE_STATUSES as [string, ...string[]]);

export const createFinanceEntrySchema = z.object({
  companyId: z.string().uuid(),
  type: financeTypeSchema,
  description: z.string().min(2).max(300),
  amountCents: z.number().int().positive(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: financeStatusSchema.optional(),
  paidAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
  paymentMethod: z.string().max(50).optional(),
});

export const updateFinanceEntrySchema = createFinanceEntrySchema
  .omit({ companyId: true })
  .partial()
  .extend({
    id: z.string().uuid(),
    companyId: z.string().uuid(),
  });

export const listFinanceEntriesSchema = z.object({
  search: z.string().max(200).optional(),
  status: z.union([financeStatusSchema, z.literal("all")]).optional(),
  type: z.union([financeTypeSchema, z.literal("all")]).optional(),
  companyId: z.string().uuid().optional(),
  sort: z.enum(["due_date", "created_at", "amount_cents"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

export const financeEntryIdSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
});

export const markFinancePaidSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  paidAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  paymentMethod: z.string().max(50).optional(),
});

export const financeEntryFilesSchema = z.object({
  financeEntryId: z.string().uuid(),
  companyId: z.string().uuid(),
});

export const uploadFinanceReceiptSchema = z.object({
  companyId: z.string().uuid(),
  financeEntryId: z.string().uuid(),
  name: z.string().min(1).max(255),
  mimeType: z.string().max(100),
  base64: z.string().min(1),
});
