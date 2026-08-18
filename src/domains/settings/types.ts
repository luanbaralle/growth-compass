/** Preços e simulador padrão para propostas de aceleração (UNIP). */
export interface OSCommercialDefaults {
  implementationAmount: string;
  mediaAmount: string;
  managementAmount: string;
  simulatorMediaBudgetCents: number;
  simulatorCpcCents: number;
  simulatorLeadRatePercent: number;
  simulatorConversionRatePercent: number;
  simulatorLtvCents: number;
}

export const DEFAULT_OS_COMMERCIAL: OSCommercialDefaults = {
  implementationAmount: "R$ 1.997",
  mediaAmount: "R$ 1.500 a R$ 2.000",
  managementAmount: "R$ 997/mês",
  simulatorMediaBudgetCents: 150_000,
  simulatorCpcCents: 250,
  simulatorLeadRatePercent: 12.5,
  simulatorConversionRatePercent: 10,
  simulatorLtvCents: 400_000,
};

export interface OSPreferences {
  agencyName: string;
  defaultWhatsApp: string;
  opsNotes: string;
  receiptPrefix: string;
  issuerName: string;
  issuerCpf: string;
  issuerEmail: string;
  issuerPhone: string;
  commercial: OSCommercialDefaults;
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
  commercial: { ...DEFAULT_OS_COMMERCIAL },
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
