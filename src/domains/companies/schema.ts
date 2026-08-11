import { z } from "zod";
import { COMPANY_STAGES } from "./types";

export const companyStageSchema = z.enum(COMPANY_STAGES as [string, ...string[]]);

export const createCompanySchema = z.object({
  name: z.string().min(2).max(200),
  legal_name: z.string().max(200).optional(),
  cnpj: z.string().max(18).optional(),
  city: z.string().max(120).optional(),
  city_state: z.string().max(2).optional(),
  responsible_name: z.string().max(120).optional(),
  whatsapp: z.string().max(20).optional(),
  email: z.string().max(200).optional(),
  website: z.string().max(300).optional(),
  origin: z.string().max(100).optional(),
  segment: z.string().max(100).optional(),
  stage: companyStageSchema.optional(),
  notes: z.string().max(5000).optional(),
});

export const updateCompanySchema = createCompanySchema.partial().extend({
  id: z.string().uuid(),
  responsible_name: z.string().max(120).nullable().optional(),
});

export const listCompaniesSchema = z.object({
  search: z.string().max(200).optional(),
  stage: z.union([companyStageSchema, z.literal("all")]).optional(),
  sort: z.enum(["name", "created_at", "stage"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

export const addNoteSchema = z.object({
  companyId: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
  body: z.string().min(1).max(5000),
});

export const changeStageSchema = z.object({
  companyId: z.string().uuid(),
  stage: companyStageSchema,
});

export const createLinkSchema = z.object({
  companyId: z.string().uuid(),
  type: z.enum([
    "google_ads",
    "meta_ads",
    "landing_page",
    "analytics",
    "search_console",
    "google_business",
    "other",
  ]),
  label: z.string().min(1).max(100),
  url: z.string().url().max(500),
});

export const updateLinkSchema = createLinkSchema.partial().extend({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
});

export const createServiceSchema = z.object({
  companyId: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  status: z.enum(["active", "paused", "completed"]).optional(),
});

export const updateServiceSchema = createServiceSchema.partial().extend({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
});

export const uploadLogoSchema = z.object({
  companyId: z.string().uuid(),
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]),
  base64: z.string().min(1),
});

export const uploadFileSchema = z.object({
  companyId: z.string().uuid(),
  name: z.string().min(1).max(255),
  category: z.enum(["contract", "receipt", "invoice", "other"]),
  mimeType: z.string().max(100),
  base64: z.string().min(1),
  financeEntryId: z.string().uuid().optional(),
});

export const submitCompanyFormSchema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().min(8).max(20),
  city: z.string().min(2).max(120),
  cityState: z.string().max(2).optional(),
  business: z.string().min(2).max(120),
  segment: z.string().min(1),
  templateSlug: z.string().min(1),
  negocio: z.string().optional(),
  displayLabel: z.string().optional(),
  microverticalId: z.string().optional(),
  matchLevel: z.enum(["exact", "related", "dynamic"]).optional(),
  source: z.enum(["hub", "lp", "direct"]),
  link: z.string().max(200).optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmContent: z.string().optional(),
  utmTerm: z.string().optional(),
});

export const idSchema = z.object({ id: z.string().uuid() });

export const companyIdSchema = z.object({ companyId: z.string().uuid() });

export const fileIdSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
});

export const linkIdSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
});

export const serviceIdSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
});
