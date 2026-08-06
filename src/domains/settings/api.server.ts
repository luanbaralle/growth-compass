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
      return settingsService.updateOSPreferences({
        agencyName: data.agencyName.trim(),
        defaultWhatsApp: data.defaultWhatsApp?.trim() ?? "",
        opsNotes: data.opsNotes?.trim() ?? "",
      });
    });
  });
