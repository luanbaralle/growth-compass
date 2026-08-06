import { TEAM_LABELS, TEAM_MEMBERS, type TeamMember } from "@/lib/auth/types";
import * as repo from "./repository.server";
import type {
  IntegrationStatus,
  OSPreferences,
  SettingsPageData,
  SystemStatus,
  TeamMemberStatus,
} from "./types";

function getSystemStatus(): SystemStatus {
  const url = process.env.SUPABASE_URL ?? "";
  let supabaseHost: string | null = null;
  if (url) {
    try {
      supabaseHost = new URL(url).hostname;
    } catch {
      supabaseHost = null;
    }
  }

  return {
    supabaseConfigured: Boolean(url && process.env.SUPABASE_SERVICE_ROLE_KEY),
    supabaseHost,
    adminPasswordConfigured: Boolean(process.env.ADMIN_PASSWORD),
    sessionSecretConfigured: Boolean(process.env.SESSION_SECRET),
    whatsappConfigured: Boolean(process.env.VITE_WHATSAPP_NUMBER),
  };
}

function getTeamStatus(): TeamMemberStatus[] {
  return TEAM_MEMBERS.map((id) => {
    const envKey = `ADMIN_PIN_${id.toUpperCase()}` as keyof NodeJS.ProcessEnv;
    return {
      id,
      label: TEAM_LABELS[id],
      pinConfigured: Boolean(process.env[envKey]),
    };
  });
}

function getIntegrations(): IntegrationStatus[] {
  return [
    {
      id: "google_ads",
      label: "Google Ads",
      mode: "manual",
      description: "Métricas registradas manualmente em Marketing.",
    },
    {
      id: "meta_ads",
      label: "Meta Ads",
      mode: "manual",
      description: "Métricas registradas manualmente em Marketing.",
    },
    {
      id: "supabase",
      label: "Supabase",
      mode: "api",
      description: "Banco de dados e storage do OS.",
    },
    {
      id: "whatsapp",
      label: "WhatsApp (site)",
      mode: getSystemStatus().whatsappConfigured ? "api" : "soon",
      description: "Links wa.me nos formulários públicos via VITE_WHATSAPP_NUMBER.",
    },
  ];
}

export async function getSettingsPageData(): Promise<SettingsPageData> {
  const preferences = await repo.getOSPreferences();
  return {
    preferences,
    team: getTeamStatus(),
    system: getSystemStatus(),
    integrations: getIntegrations(),
  };
}

export async function updateOSPreferences(input: OSPreferences): Promise<OSPreferences> {
  return repo.saveOSPreferences(input);
}
