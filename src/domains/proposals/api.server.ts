import { createServerFn } from "@tanstack/react-start";
import { withAuth } from "@/lib/api/auth.server";
import {
  copilotSessionIdParamSchema,
  createProposalFromCopilotSchema,
  listProposalsSchema,
  proposalIdSchema,
  proposalSlugSchema,
  updateProposalSchema,
  saveProposalPresentationSchema,
  blueprintIdSchema,
  updateBlueprintSchema,
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
      return service.createDraftFromCopilotSession(
        data.sessionId,
        { slug: data.slug, enrichWithLlm: data.enrichWithLlm },
        author,
      );
    });
  });

export const getProposalForCopilotSession = createServerFn({ method: "GET" })
  .validator(copilotSessionIdParamSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/proposals/service.server");
      return service.getProposalByCopilotSession(data.sessionId);
    });
  });

export const enrichProposalFromCopilot = createServerFn({ method: "POST" })
  .validator(proposalIdSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/proposals/service.server");
      return service.enrichProposalFromCopilot(data.id);
    });
  });

export const rebuildProposalFromCopilot = createServerFn({ method: "POST" })
  .validator(proposalIdSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/proposals/service.server");
      return service.rebuildProposalFromCopilot(data.id);
    });
  });

export const getBlueprintForCopilotSession = createServerFn({ method: "GET" })
  .validator(copilotSessionIdParamSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/proposals/service.server");
      return service.getBlueprintForSession(data.sessionId);
    });
  });

export const getBlueprintById = createServerFn({ method: "GET" })
  .validator(blueprintIdSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/proposals/service.server");
      const blueprint = await service.getBlueprint(data.id);
      if (!blueprint) throw new Error("Blueprint não encontrado.");
      return blueprint;
    });
  });

export const createBlueprintFromCopilot = createServerFn({ method: "POST" })
  .validator(copilotSessionIdParamSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/proposals/service.server");
      return service.createBlueprintFromCopilotSession(data.sessionId);
    });
  });

export const updateBlueprint = createServerFn({ method: "POST" })
  .validator(updateBlueprintSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/proposals/service.server");
      const { id, ...patch } = data;
      const updated = await service.updateBlueprint(id, patch as Parameters<typeof service.updateBlueprint>[1]);
      if (!updated) throw new Error("Blueprint não encontrado.");
      return updated;
    });
  });

export const approveBlueprint = createServerFn({ method: "POST" })
  .validator(blueprintIdSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/proposals/service.server");
      return service.approveBlueprint(data.id);
    });
  });

export const generateProposalFromBlueprint = createServerFn({ method: "POST" })
  .validator(blueprintIdSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/proposals/service.server");
      return service.generateProposalFromBlueprint(data.id);
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

export const saveProposalPresentation = createServerFn({ method: "POST" })
  .validator(saveProposalPresentationSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/proposals/service.server");
      const updated = await service.saveProposalPresentation(data.id, {
        outcome: data.outcome,
        notes: data.notes,
        publishFirst: data.publishFirst,
      });
      if (!updated) throw new Error("Proposta não encontrada.");
      return updated;
    });
  });
