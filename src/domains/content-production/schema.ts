import { z } from "zod";
import {
  CONTENT_CHANNELS,
  CONTENT_STATUSES,
  CONTENT_TASK_FILE_TYPES,
  CONTENT_TYPES,
} from "./types";

export const contentStatusSchema = z.enum(CONTENT_STATUSES as [string, ...string[]]);
export const contentChannelSchema = z.enum(CONTENT_CHANNELS as [string, ...string[]]);
export const contentTypeSchema = z.enum(CONTENT_TYPES as [string, ...string[]]);
export const contentTaskFileTypeSchema = z.enum(
  CONTENT_TASK_FILE_TYPES as [string, ...string[]],
);

const postDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .optional()
  .or(z.literal(""));

const optionalTextSchema = z.string().max(10000).optional().or(z.literal(""));

const publicationEntrySchema = z.object({
  published_at: z.string().max(40).nullable().optional(),
  url: z.string().max(2000).nullable().optional(),
});

export const contentPublicationSchema = z
  .object({
    instagram: publicationEntrySchema.optional(),
    facebook: publicationEntrySchema.optional(),
    youtube: publicationEntrySchema.optional(),
    tiktok: publicationEntrySchema.optional(),
  })
  .optional();

export const contentChannelsSchema = z
  .array(contentChannelSchema)
  .min(1, "Selecione ao menos um canal");

export const createContentTaskSchema = z.object({
  companyId: z.string().uuid(),
  title: z.string().min(2).max(200),
  status: contentStatusSchema.optional(),
  channels: contentChannelsSchema,
  themeObjective: z.string().max(5000).optional(),
  contentType: contentTypeSchema,
  postDate: postDateSchema,
  productionOwnerId: z.enum(["luan", "vini", "caio"]).optional(),
  notes: z.string().max(10000).optional(),
  briefingHook: optionalTextSchema,
  briefingScript: optionalTextSchema,
  briefingCta: z.string().max(500).optional().or(z.literal("")),
  briefingReferences: optionalTextSchema,
  briefingCaption: optionalTextSchema,
  clientApprovedAt: z.string().max(40).optional().or(z.literal("")).nullable(),
  clientApprovedBy: z.string().max(200).optional().or(z.literal("")),
  publication: contentPublicationSchema,
});

export const updateContentTaskSchema = createContentTaskSchema.partial().extend({
  id: z.string().uuid(),
});

export const moveContentTaskSchema = z.object({
  id: z.string().uuid(),
  status: contentStatusSchema,
});

export const contentTaskIdSchema = z.object({ id: z.string().uuid() });

export const listContentTasksSchema = z.object({
  search: z.string().max(200).optional(),
  status: z.union([contentStatusSchema, z.literal("all")]).optional(),
  channel: z.union([contentChannelSchema, z.literal("all")]).optional(),
  companyId: z.string().uuid().optional(),
  productionOwnerId: z.union([z.enum(["luan", "vini", "caio"]), z.literal("all")]).optional(),
  postDateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  postDateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export const deleteContentTaskSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
});

export const addContentTaskNoteSchema = z.object({
  taskId: z.string().uuid(),
  body: z.string().min(1).max(5000),
});

export const contentTaskFileIdSchema = z.object({
  taskId: z.string().uuid(),
  fileId: z.string().uuid(),
});

export const uploadContentTaskFileSchema = z.object({
  taskId: z.string().uuid(),
  name: z.string().min(1).max(255),
  fileType: contentTaskFileTypeSchema,
  mimeType: z.string().max(100),
  base64: z.string().min(1),
});
