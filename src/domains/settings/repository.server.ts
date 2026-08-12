import { dbSelect, requireSupabaseConfig } from "@/lib/supabase/server";
import type { OSPreferences } from "./types";
import { DEFAULT_OS_PREFERENCES, OS_PREFERENCES_KEY } from "./types";

function encodeQuery(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
}

export async function getSettingValue(key: string): Promise<Record<string, unknown> | null> {
  const rows = await dbSelect<{ value: Record<string, unknown> }>(
    "settings",
    encodeQuery({ select: "value", key: `eq.${key}` }),
  );
  return rows[0]?.value ?? null;
}

export async function upsertSetting(key: string, value: Record<string, unknown>): Promise<void> {
  const { url, key: serviceKey } = requireSupabaseConfig();
  const res = await fetch(`${url}/rest/v1/settings`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify({ key, value }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`UPSERT settings: ${res.status} ${text}`);
  }
}

export async function getOSPreferences(): Promise<OSPreferences> {
  const raw = await getSettingValue(OS_PREFERENCES_KEY);
  if (!raw) return { ...DEFAULT_OS_PREFERENCES };

  return {
    agencyName:
      typeof raw.agencyName === "string" ? raw.agencyName : DEFAULT_OS_PREFERENCES.agencyName,
    defaultWhatsApp:
      typeof raw.defaultWhatsApp === "string"
        ? raw.defaultWhatsApp
        : DEFAULT_OS_PREFERENCES.defaultWhatsApp,
    opsNotes:
      typeof raw.opsNotes === "string" ? raw.opsNotes : DEFAULT_OS_PREFERENCES.opsNotes,
    receiptPrefix:
      typeof raw.receiptPrefix === "string"
        ? raw.receiptPrefix
        : DEFAULT_OS_PREFERENCES.receiptPrefix,
    issuerName:
      typeof raw.issuerName === "string" ? raw.issuerName : DEFAULT_OS_PREFERENCES.issuerName,
    issuerCpf:
      typeof raw.issuerCpf === "string" ? raw.issuerCpf : DEFAULT_OS_PREFERENCES.issuerCpf,
    issuerEmail:
      typeof raw.issuerEmail === "string" ? raw.issuerEmail : DEFAULT_OS_PREFERENCES.issuerEmail,
    issuerPhone:
      typeof raw.issuerPhone === "string" ? raw.issuerPhone : DEFAULT_OS_PREFERENCES.issuerPhone,
  };
}

export async function saveOSPreferences(preferences: OSPreferences): Promise<OSPreferences> {
  await upsertSetting(OS_PREFERENCES_KEY, preferences);
  return preferences;
}
