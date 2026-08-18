import { createServerFn } from "@tanstack/react-start";
import { withAuth } from "@/lib/api/auth.server";
import { updatePreferencesSchema } from "@/domains/settings/schema";

export const getSettings = createServerFn({ method: "GET" }).handler(async () => {
  return withAuth(async () => {
    const settingsService = await import("@/domains/settings/service.server");
    return settingsService.getSettingsPageData();
  });
});

export const updateSettings = createServerFn({ method: "POST" })
  .validator(updatePreferencesSchema)
  .handler(async ({ data }) => {
    return withAuth(async () => {
      const settingsService = await import("@/domains/settings/service.server");
      const existing = await settingsService.getSettingsPageData();
      const commercialInput = data.commercial ?? {};
      return settingsService.updateOSPreferences({
        agencyName: data.agencyName.trim(),
        defaultWhatsApp: data.defaultWhatsApp?.trim() ?? "",
        opsNotes: data.opsNotes?.trim() ?? "",
        receiptPrefix: data.receiptPrefix?.trim() ?? "R1",
        issuerName: data.issuerName?.trim() ?? "",
        issuerCpf: data.issuerCpf?.trim() ?? "",
        issuerEmail: data.issuerEmail?.trim() ?? "",
        issuerPhone: data.issuerPhone?.trim() ?? "",
        commercial: {
          implementationAmount:
            commercialInput.implementationAmount?.trim() ??
            existing.preferences.commercial.implementationAmount,
          mediaAmount:
            commercialInput.mediaAmount?.trim() ?? existing.preferences.commercial.mediaAmount,
          managementAmount:
            commercialInput.managementAmount?.trim() ??
            existing.preferences.commercial.managementAmount,
          simulatorMediaBudgetCents:
            commercialInput.simulatorMediaBudgetCents ??
            existing.preferences.commercial.simulatorMediaBudgetCents,
          simulatorCpcCents:
            commercialInput.simulatorCpcCents ?? existing.preferences.commercial.simulatorCpcCents,
          simulatorLeadRatePercent:
            commercialInput.simulatorLeadRatePercent ??
            existing.preferences.commercial.simulatorLeadRatePercent,
          simulatorConversionRatePercent:
            commercialInput.simulatorConversionRatePercent ??
            existing.preferences.commercial.simulatorConversionRatePercent,
          simulatorLtvCents:
            commercialInput.simulatorLtvCents ?? existing.preferences.commercial.simulatorLtvCents,
        },
      });
    });
  });
