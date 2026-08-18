import { z } from "zod";

export const startCopilotSessionSchema = z.object({
  prospectName: z.string().min(1),
  companyName: z.string().min(1),
  prospectId: z.string().uuid().optional().nullable(),
  mode: z
    .enum([
      "discovery_qualification",
      "briefing",
      "strategy",
      "review",
      "sales_proposal",
    ])
    .optional(),
});

export const copilotSessionIdSchema = z.object({
  sessionId: z.string().uuid(),
});

export const endCopilotSessionSchema = z.object({
  sessionId: z.string().uuid(),
  elapsedSeconds: z.number().int().min(0).optional(),
});

export const appendCopilotSegmentSchema = z.object({
  sessionId: z.string().uuid(),
  segmentId: z.string().uuid().optional(),
  speaker: z.enum(["prospect", "consultant", "unknown"]),
  text: z.string().min(1),
  source: z.enum(["manual_paste", "live_stt"]).optional(),
  startedAt: z.string().optional(),
  confidence: z.number().min(0).max(1).optional(),
});

export const transcribeCopilotAudioSchema = z.object({
  sessionId: z.string().uuid(),
  audioBase64: z.string().min(1),
  format: z.enum(["webm", "ogg", "wav", "mp3"]).default("webm"),
});

export const analyzeCopilotSegmentSchema = z.object({
  sessionId: z.string().uuid(),
  segmentId: z.string().uuid(),
});

export const addCopilotTurnSchema = z.object({
  sessionId: z.string().uuid(),
  segmentId: z.string().uuid().optional(),
  speaker: z.enum(["prospect", "consultant", "unknown"]),
  text: z.string().min(1),
  source: z.enum(["manual_paste", "live_stt"]).optional(),
});

export const overrideCopilotEvidenceSchema = z.object({
  sessionId: z.string().uuid(),
  objectiveKey: z.string().min(1),
  value: z.string().min(1),
});

export const askCopilotBriefingQuestionSchema = z.object({
  sessionId: z.string().uuid(),
  question: z.string().min(1).max(2000),
});

export const prospectIdParamSchema = z.object({
  prospectId: z.string().uuid(),
});
