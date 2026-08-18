import { createServerFn } from "@tanstack/react-start";
import { withAuth } from "@/lib/api/auth.server";
import {
  createProposalFromCopilotSchema,
  listProposalsSchema,
  proposalIdSchema,
  proposalSlugSchema,
  updateProposalSchema,
} from "./schema";

export const listProposals = createServerFn({ method: "GET" })
  .validator(listProposalsSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/proposals/service.server");
      return service.listProposals(data ?? undefined);
    });
  });

export const getProposal = createServerFn({ method: "GET" })
  .validator(proposalIdSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/proposals/service.server");
      const proposal = await service.getProposal(data.id);
      if (!proposal) throw new Error("Proposta não encontrada.");
      return proposal;
    });
  });

export const getProposalBySlug = createServerFn({ method: "GET" })
  .validator(proposalSlugSchema)
  .handler(async ({ data }) => {
    const service = await import("@/domains/proposals/service.server");
    const proposal = await service.getPublishedProposalBySlug(data.slug);
    if (!proposal) throw new Error("Proposta não encontrada ou não publicada.");
    return proposal;
  });

export const createProposalFromCopilot = createServerFn({ method: "POST" })
  .validator(createProposalFromCopilotSchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const service = await import("@/domains/proposals/service.server");
      return service.createDraftFromCopilotSession(data.sessionId, { slug: data.slug }, author);
    });
  });

export const updateProposal = createServerFn({ method: "POST" })
  .validator(updateProposalSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/proposals/service.server");
      const { id, ...patch } = data;
      const updated = await service.updateProposal(id, patch as Parameters<typeof service.updateProposal>[1]);
      if (!updated) throw new Error("Proposta não encontrada.");
      return updated;
    });
  });

export const publishProposal = createServerFn({ method: "POST" })
  .validator(proposalIdSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/proposals/service.server");
      const updated = await service.publishProposal(data.id);
      if (!updated) throw new Error("Proposta não encontrada.");
      return updated;
    });
  });
