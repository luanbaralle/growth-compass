import { z } from "zod";

export const updatePreferencesSchema = z.object({
  agencyName: z.string().min(1).max(120),
  defaultWhatsApp: z.string().max(20).optional(),
  opsNotes: z.string().max(5000).optional(),
  receiptPrefix: z.string().max(10).optional(),
  issuerName: z.string().max(120).optional(),
  issuerCpf: z.string().max(20).optional(),
  issuerEmail: z.string().max(120).optional(),
  issuerPhone: z.string().max(30).optional(),
});
