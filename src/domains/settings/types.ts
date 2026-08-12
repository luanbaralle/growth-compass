export interface OSPreferences {
  agencyName: string;
  defaultWhatsApp: string;
  opsNotes: string;
  receiptPrefix: string;
  issuerName: string;
  issuerCpf: string;
  issuerEmail: string;
  issuerPhone: string;
}

export const DEFAULT_OS_PREFERENCES: OSPreferences = {
  agencyName: "Raise One",
  defaultWhatsApp: "",
  opsNotes: "",
  receiptPrefix: "R1",
  issuerName: "",
  issuerCpf: "",
  issuerEmail: "",
  issuerPhone: "",
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
