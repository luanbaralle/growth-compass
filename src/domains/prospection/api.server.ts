import { createServerFn } from "@tanstack/react-start";
import { withAuth } from "@/lib/api/auth.server";
import {
  createInteractionSchema,
  createObjectionSchema,
  createProspectSchema,
  filterByOpportunitySchema,
  listProspectsSchema,
  moveProspectSchema,
  prospectIdSchema,
  updateCaseSchema,
  updateChecklistSchema,
  updateObjectionSchema,
  updateOpportunitySchema,
  updateProspectSchema,
  updateQualificationSchema,
  updateScriptSchema,
  saveAssistantStateSchema,
} from "@/domains/prospection/schema";

export const listProspects = createServerFn({ method: "GET" })
  .validator(listProspectsSchema.optional())
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/prospection/service.server");
      return service.listProspects(data ?? {});
    });
  });

export const getProspect = createServerFn({ method: "GET" })
  .validator(prospectIdSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/prospection/service.server");
      const result = await service.getProspect(data.id);
      if (!result) throw new Error("Prospect não encontrado.");
      return result;
    });
  });

export const createProspect = createServerFn({ method: "POST" })
  .validator(createProspectSchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const service = await import("@/domains/prospection/service.server");
      return service.createProspect(data, author);
    });
  });

export const updateProspect = createServerFn({ method: "POST" })
  .validator(updateProspectSchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const service = await import("@/domains/prospection/service.server");
      const { id, ...patch } = data;
      const prospect = await service.updateProspect(id, patch, author);
      if (!prospect) throw new Error("Prospect não encontrado.");
      return prospect;
    });
  });

export const moveProspect = createServerFn({ method: "POST" })
  .validator(moveProspectSchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const service = await import("@/domains/prospection/service.server");
      const prospect = await service.moveProspect(data.id, data.status, author);
      if (!prospect) throw new Error("Prospect não encontrado.");
      return prospect;
    });
  });

export const updateProspectChecklist = createServerFn({ method: "POST" })
  .validator(updateChecklistSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/prospection/service.server");
      await service.updateChecklistItem(
        data.prospectId,
        data.itemKey,
        data.status,
        data.notes,
      );
      return { ok: true };
    });
  });

export const updateProspectOpportunity = createServerFn({ method: "POST" })
  .validator(updateOpportunitySchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/prospection/service.server");
      await service.updateOpportunityItem(data.prospectId, data.opportunityKey, data.checked);
      return { ok: true };
    });
  });

export const addProspectInteraction = createServerFn({ method: "POST" })
  .validator(createInteractionSchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const service = await import("@/domains/prospection/service.server");
      const { prospectId, ...input } = data;
      return service.addInteraction(prospectId, input, author);
    });
  });

export const convertProspect = createServerFn({ method: "POST" })
  .validator(prospectIdSchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const service = await import("@/domains/prospection/service.server");
      return service.convertProspectToCompany(data.id, author);
    });
  });

export const getProspectionMetrics = createServerFn({ method: "GET" }).handler(async () => {
  return withAuth(async () => {
    const service = await import("@/domains/prospection/service.server");
    return service.getProspectionMetrics();
  });
});

export const getCommercialLibrary = createServerFn({ method: "GET" }).handler(async () => {
  return withAuth(async () => {
    const service = await import("@/domains/prospection/service.server");
    return service.getCommercialLibrary();
  });
});

export const updateCommercialScript = createServerFn({ method: "POST" })
  .validator(updateScriptSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/prospection/service.server");
      return service.updateCommercialScript(data.id, data.content);
    });
  });

export const updateCommercialObjection = createServerFn({ method: "POST" })
  .validator(updateObjectionSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/prospection/service.server");
      const { id, ...patch } = data;
      return service.updateCommercialObjection(id, patch);
    });
  });

export const addCommercialObjection = createServerFn({ method: "POST" })
  .validator(createObjectionSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/prospection/service.server");
      return service.addCommercialObjection(data.segmentId, data);
    });
  });

export const updateCommercialQualification = createServerFn({ method: "POST" })
  .validator(updateQualificationSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/prospection/service.server");
      return service.updateCommercialQualification(data.id, data.question);
    });
  });

export const updateCommercialCase = createServerFn({ method: "POST" })
  .validator(updateCaseSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/prospection/service.server");
      await service.updateCommercialCase(
        data.segmentId,
        data.caseSlug ?? "",
        data.title ?? "",
      );
      return { ok: true };
    });
  });

export const listProspectsWithoutOpportunity = createServerFn({ method: "GET" })
  .validator(filterByOpportunitySchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/prospection/service.server");
      return service.listProspectsWithoutOpportunity(data.opportunityKey);
    });
  });

export const getCopilotBundle = createServerFn({ method: "GET" })
  .validator(prospectIdSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/prospection/service.server");
      const bundle = await service.getCopilotBundle(data.id);
      if (!bundle) throw new Error("Prospect não encontrado.");
      return bundle;
    });
  });

export const saveAssistantState = createServerFn({ method: "POST" })
  .validator(saveAssistantStateSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/prospection/service.server");
      const { prospectId, ...patch } = data;
      return service.saveAssistantState({ prospectId, ...patch });
    });
  });
