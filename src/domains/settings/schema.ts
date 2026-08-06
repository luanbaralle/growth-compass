import { z } from "zod";

export const updatePreferencesSchema = z.object({
  agencyName: z.string().min(1).max(120),
  defaultWhatsApp: z.string().max(20).optional(),
  opsNotes: z.string().max(5000).optional(),
});
