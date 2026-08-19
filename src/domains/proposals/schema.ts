import { z } from "zod";

export const proposalTemplateSchema = z.enum(["acceleration", "custom_solution"]);
export const proposalStatusSchema = z.enum(["draft", "published", "archived"]);

export const proposalIdSchema = z.object({ id: z.string().uuid() });
export const proposalSlugSchema = z.object({ slug: z.string().min(1).max(80) });

export const createProposalFromCopilotSchema = z.object({
  sessionId: z.string().uuid(),
  slug: z.string().min(2).max(80).optional(),
  enrichWithLlm: z.boolean().optional(),
});

export const updateProposalSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).optional(),
  slug: z.string().min(2).max(80).optional(),
  status: proposalStatusSchema.optional(),
  content: z.record(z.unknown()).optional(),
});

export const saveProposalPresentationSchema = z.object({
  id: z.string().uuid(),
  outcome: z.enum(["approved", "adjustments", "postponed"]).optional(),
  notes: z.string().max(5000).optional(),
  publishFirst: z.boolean().optional(),
});

export const copilotSessionIdParamSchema = z.object({
  sessionId: z.string().uuid(),
});

export const blueprintIdSchema = z.object({ id: z.string().uuid() });

export const updateBlueprintSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["draft", "in_review", "approved"]).optional(),
  blueprint: z.record(z.unknown()).optional(),
  internal_notes: z.string().max(10000).nullable().optional(),
});

export const listProposalsSchema = z
  .object({
    status: z.union([proposalStatusSchema, z.literal("all")]).optional(),
  })
  .optional();
