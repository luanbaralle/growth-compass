import { z } from "zod";

const commercialDefaultsSchema = z.object({
  implementationAmount: z.string().max(40).optional(),
  mediaAmount: z.string().max(60).optional(),
  managementAmount: z.string().max(40).optional(),
  simulatorMediaBudgetCents: z.number().int().min(0).max(10_000_000).optional(),
  simulatorCpcCents: z.number().int().min(0).max(100_000).optional(),
  simulatorLeadRatePercent: z.number().min(0).max(100).optional(),
  simulatorConversionRatePercent: z.number().min(0).max(100).optional(),
  simulatorLtvCents: z.number().int().min(0).max(100_000_000).optional(),
});

export const updatePreferencesSchema = z.object({
  agencyName: z.string().min(1).max(120),
  defaultWhatsApp: z.string().max(20).optional(),
  opsNotes: z.string().max(5000).optional(),
  receiptPrefix: z.string().max(10).optional(),
  issuerName: z.string().max(120).optional(),
  issuerCpf: z.string().max(20).optional(),
  issuerEmail: z.string().max(120).optional(),
  issuerPhone: z.string().max(30).optional(),
  commercial: commercialDefaultsSchema.optional(),
});
