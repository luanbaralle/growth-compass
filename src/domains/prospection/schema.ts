import { z } from "zod";
import { PROSPECT_STATUSES } from "./types";

export const prospectStatusSchema = z.enum(PROSPECT_STATUSES as [string, ...string[]]);
export const checklistStatusSchema = z.enum(["yes", "no", "partial"]);

export const createProspectSchema = z.object({
  name: z.string().min(1).max(200),
  segmentSlug: z.string().max(40).optional(),
  category: z.string().max(120).optional(),
  city: z.string().max(120).optional(),
  state: z.string().max(2).optional(),
  phone: z.string().max(30).optional(),
  whatsapp: z.string().max(30).optional(),
  instagram: z.string().max(120).optional(),
  website: z.string().max(300).optional(),
  googleMapsUrl: z.string().max(500).optional(),
  ownerId: z.enum(["luan", "vini", "caio"]).optional(),
  source: z.string().max(120).optional(),
  notes: z.string().max(5000).optional(),
  tags: z.array(z.string().max(40)).optional(),
});

export const updateProspectSchema = createProspectSchema.partial().extend({
  id: z.string().uuid(),
  status: prospectStatusSchema.optional(),
  nextAction: z.string().max(300).optional(),
  nextActionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
});

export const listProspectsSchema = z.object({
  search: z.string().max(200).optional(),
  status: z.union([prospectStatusSchema, z.literal("all")]).optional(),
  category: z.string().max(120).optional(),
  city: z.string().max(120).optional(),
  source: z.string().max(120).optional(),
  ownerId: z.union([z.enum(["luan", "vini", "caio"]), z.literal("all")]).optional(),
  sort: z.enum(["last_interaction_at", "created_at", "name", "next_action_date"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

export const prospectIdSchema = z.object({ id: z.string().uuid() });

export const moveProspectSchema = z.object({
  id: z.string().uuid(),
  status: prospectStatusSchema,
});

export const updateChecklistSchema = z.object({
  prospectId: z.string().uuid(),
  itemKey: z.string().min(1).max(80),
  status: checklistStatusSchema,
  notes: z.string().max(1000).optional(),
});

export const updateOpportunitySchema = z.object({
  prospectId: z.string().uuid(),
  opportunityKey: z.string().min(1).max(80),
  checked: z.boolean(),
});

export const createInteractionSchema = z.object({
  prospectId: z.string().uuid(),
  type: z.enum([
    "registered",
    "message_sent",
    "message_received",
    "follow_up",
    "proposal_sent",
    "diagnosis_sent",
    "converted",
    "note",
    "status_change",
  ]),
  title: z.string().min(1).max(200),
  body: z.string().max(5000).optional(),
  direction: z.enum(["out", "in", "internal"]).optional(),
  occurredAt: z.string().datetime().optional(),
});

export const updateScriptSchema = z.object({
  id: z.string().uuid(),
  content: z.string().max(20000),
});

export const updateObjectionSchema = z.object({
  id: z.string().uuid(),
  objection: z.string().min(1).max(500).optional(),
  response: z.string().max(5000).optional(),
  objective: z.string().max(500).optional(),
});

export const createObjectionSchema = z.object({
  segmentId: z.string().uuid(),
  objection: z.string().min(1).max(500),
  response: z.string().max(5000).optional(),
  objective: z.string().max(500).optional(),
});

export const updateQualificationSchema = z.object({
  id: z.string().uuid(),
  question: z.string().min(1).max(500),
});

export const updateCaseSchema = z.object({
  segmentId: z.string().uuid(),
  caseSlug: z.string().max(120).optional(),
  title: z.string().max(200).optional(),
});

export const segmentIdSchema = z.object({ segmentId: z.string().uuid() });

export const filterByOpportunitySchema = z.object({
  opportunityKey: z.string().min(1).max(80),
});

export const saveAssistantStateSchema = z.object({
  prospectId: z.string().uuid(),
  step: z
    .enum([
      "observations",
      "openings",
      "opening",
      "awaiting_reply",
      "no_reply",
      "response_state",
      "continuation",
      "conversation",
      "raise_one",
      "done",
    ])
    .optional(),
  selectedObservations: z.array(z.string().max(80)).optional(),
  selectedOpeningId: z.string().max(80).nullable().optional(),
  openingText: z.string().max(5000).nullable().optional(),
  openingUsed: z.boolean().optional(),
  replyStatus: z.enum(["waiting", "no_reply", "replied"]).nullable().optional(),
  responseStateKey: z.string().max(80).nullable().optional(),
  currentObjectiveKey: z.string().max(80).nullable().optional(),
  discoveries: z.record(z.string(), z.string()).optional(),
  registerDiscovery: z
    .object({
      discoveryKey: z.string().max(80),
      discoveryValue: z.string().max(80),
      inboundReplyText: z.string().max(5000).optional(),
    })
    .optional(),
});
