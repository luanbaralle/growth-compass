import { createServerFn } from "@tanstack/react-start";
import { withAuth } from "@/lib/api/auth.server";
import {
  addCopilotTurnSchema,
  analyzeCopilotSegmentSchema,
  appendCopilotSegmentSchema,
  copilotSessionIdSchema,
  endCopilotSessionSchema,
  overrideCopilotEvidenceSchema,
  askCopilotBriefingQuestionSchema,
  prospectIdParamSchema,
  transcribeCopilotAudioSchema,
  startCopilotSessionSchema,
} from "./schema";

export const startCopilotSession = createServerFn({ method: "POST" })
  .validator(startCopilotSessionSchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const service = await import("@/domains/copilot/service.server");
      return service.startSession(data, author);
    });
  });

export const getCopilotSession = createServerFn({ method: "GET" })
  .validator(copilotSessionIdSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/copilot/service.server");
      const result = await service.getSession(data.sessionId);
      if (!result) throw new Error("Sessão não encontrada.");
      return result;
    });
  });

export const appendCopilotSegment = createServerFn({ method: "POST" })
  .validator(appendCopilotSegmentSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/copilot/service.server");
      const { sessionId, ...segment } = data;
      const result = await service.appendSegment(sessionId, segment);
      return result.detail;
    });
  });

export const analyzeCopilotSegment = createServerFn({ method: "POST" })
  .validator(analyzeCopilotSegmentSchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const service = await import("@/domains/copilot/service.server");
      return service.analyzeSegment(data.sessionId, data.segmentId, author);
    });
  });

export const addCopilotTurn = createServerFn({ method: "POST" })
  .validator(addCopilotTurnSchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const service = await import("@/domains/copilot/service.server");
      const { sessionId, ...turn } = data;
      return service.addTurn(sessionId, turn, author);
    });
  });

export const transcribeCopilotAudio = createServerFn({ method: "POST" })
  .validator(transcribeCopilotAudioSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/copilot/service.server");
      return service.transcribeAudioChunk({
        audioBase64: data.audioBase64,
        format: data.format,
      });
    });
  });

export const endCopilotSession = createServerFn({ method: "POST" })
  .validator(endCopilotSessionSchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const service = await import("@/domains/copilot/service.server");
      return service.endSession(data.sessionId, author, {
        elapsedSeconds: data.elapsedSeconds,
      });
    });
  });

export const reprocessCopilotSession = createServerFn({ method: "POST" })
  .validator(copilotSessionIdSchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const service = await import("@/domains/copilot/service.server");
      return service.reprocessSession(data.sessionId, author);
    });
  });

export const overrideCopilotEvidence = createServerFn({ method: "POST" })
  .validator(overrideCopilotEvidenceSchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const service = await import("@/domains/copilot/service.server");
      const { sessionId, ...override } = data;
      return service.overrideEvidence(sessionId, override, author);
    });
  });

export const listRecentCopilotSessions = createServerFn({ method: "GET" }).handler(async () => {
  return withAuth(async () => {
    const service = await import("@/domains/copilot/service.server");
    return service.listRecentSessions();
  });
});

export const listProspectCopilotSessions = createServerFn({ method: "GET" })
  .validator(prospectIdParamSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/copilot/service.server");
      return service.listProspectSessions(data.prospectId);
    });
  });

export const exportCopilotBriefingPdf = createServerFn({ method: "GET" })
  .validator(copilotSessionIdSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/copilot/service.server");
      return service.exportBriefingPdf(data.sessionId);
    });
  });

export const exportCopilotCreativeBriefPdf = createServerFn({ method: "POST" })
  .validator(copilotSessionIdSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/copilot/service.server");
      return service.exportCreativeBriefPdf(data.sessionId);
    });
  });

export const pushCopilotSessionToCompany = createServerFn({ method: "POST" })
  .validator(copilotSessionIdSchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const service = await import("@/domains/copilot/service.server");
      return service.pushSessionToCompany(data.sessionId, author);
    });
  });

export const askCopilotBriefingQuestion = createServerFn({ method: "POST" })
  .validator(askCopilotBriefingQuestionSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/copilot/service.server");
      const { sessionId, question } = data;
      return service.askBriefingQuestion(sessionId, question);
    });
  });

export const deleteCopilotSession = createServerFn({ method: "POST" })
  .validator(copilotSessionIdSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const service = await import("@/domains/copilot/service.server");
      await service.deleteSession(data.sessionId);
      return { ok: true as const };
    });
  });

export const cancelCopilotSession = createServerFn({ method: "POST" })
  .validator(copilotSessionIdSchema)
  .handler(async ({ data }) => {
    return withAuth(async (author) => {
      const service = await import("@/domains/copilot/service.server");
      return service.cancelSession(data.sessionId, author);
    });
  });
