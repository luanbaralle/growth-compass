export interface OSPreferences {
  agencyName: string;
  defaultWhatsApp: string;
  opsNotes: string;
}

export const DEFAULT_OS_PREFERENCES: OSPreferences = {
  agencyName: "Raise One",
  defaultWhatsApp: "",
  opsNotes: "",
};

export const OS_PREFERENCES_KEY = "os.preferences";

export interface TeamMemberStatus {
  id: "luan" | "vini" | "caio";
  label: string;
  pinConfigured: boolean;
}

export interface SystemStatus {
  supabaseConfigured: boolean;
  supabaseHost: string | null;
  adminPasswordConfigured: boolean;
  sessionSecretConfigured: boolean;
  whatsappConfigured: boolean;
}

export interface IntegrationStatus {
  id: string;
  label: string;
  mode: "manual" | "api" | "soon";
  description: string;
}

export interface SettingsPageData {
  preferences: OSPreferences;
  team: TeamMemberStatus[];
  system: SystemStatus;
  integrations: IntegrationStatus[];
}
