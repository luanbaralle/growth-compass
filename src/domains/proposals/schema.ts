import { z } from "zod";

export const proposalTemplateSchema = z.enum(["acceleration", "custom_solution"]);
export const proposalStatusSchema = z.enum(["draft", "published", "archived"]);

export const proposalIdSchema = z.object({ id: z.string().uuid() });
export const proposalSlugSchema = z.object({ slug: z.string().min(1).max(80) });

export const createProposalFromCopilotSchema = z.object({
  sessionId: z.string().uuid(),
  slug: z.string().min(2).max(80).optional(),
});

export const updateProposalSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).optional(),
  slug: z.string().min(2).max(80).optional(),
  status: proposalStatusSchema.optional(),
  content: z.record(z.unknown()).optional(),
});

export const listProposalsSchema = z
  .object({
    status: z.union([proposalStatusSchema, z.literal("all")]).optional(),
  })
  .optional();
