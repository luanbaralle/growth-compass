import { z } from "zod";
import { MARKETING_CHANNELS } from "./types";

export const marketingChannelSchema = z.enum(MARKETING_CHANNELS as [string, ...string[]]);

export const createMarketingSnapshotSchema = z.object({
  companyId: z.string().uuid(),
  channel: marketingChannelSchema,
  periodStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  periodEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  investmentCents: z.number().int().min(0).optional().nullable(),
  leads: z.number().int().min(0).optional().nullable(),
  conversions: z.number().int().min(0).optional().nullable(),
  ctr: z.number().min(0).max(1).optional().nullable(),
  cpcCents: z.number().int().min(0).optional().nullable(),
  cpaCents: z.number().int().min(0).optional().nullable(),
  notes: z.string().max(2000).optional(),
});

export const updateMarketingSnapshotSchema = createMarketingSnapshotSchema
  .omit({ companyId: true })
  .partial()
  .extend({
    id: z.string().uuid(),
    companyId: z.string().uuid(),
  });

export const listMarketingSnapshotsSchema = z.object({
  search: z.string().max(200).optional(),
  channel: z.union([marketingChannelSchema, z.literal("all")]).optional(),
  companyId: z.string().uuid().optional(),
  sort: z.enum(["period_start", "created_at", "investment_cents"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

export const marketingSnapshotIdSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
});
