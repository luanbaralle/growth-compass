export interface UtmParams {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
}

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

const STORAGE_KEY = "raise_utm";

export function parseUtmFromSearch(search: Record<string, unknown>): UtmParams {
  return {
    utmSource: typeof search.utm_source === "string" ? search.utm_source : undefined,
    utmMedium: typeof search.utm_medium === "string" ? search.utm_medium : undefined,
    utmCampaign: typeof search.utm_campaign === "string" ? search.utm_campaign : undefined,
    utmContent: typeof search.utm_content === "string" ? search.utm_content : undefined,
    utmTerm: typeof search.utm_term === "string" ? search.utm_term : undefined,
  };
}

export function persistUtm(params: UtmParams): void {
  if (typeof window === "undefined") return;
  const hasAny = Object.values(params).some(Boolean);
  if (!hasAny) return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(params));
}

export function readPersistedUtm(): UtmParams {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UtmParams) : {};
  } catch {
    return {};
  }
}

const UTM_TO_FIELD: Record<(typeof UTM_KEYS)[number], keyof UtmParams> = {
  utm_source: "utmSource",
  utm_medium: "utmMedium",
  utm_campaign: "utmCampaign",
  utm_content: "utmContent",
  utm_term: "utmTerm",
};

export function captureUtmFromUrl(): UtmParams {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const utm: UtmParams = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) utm[UTM_TO_FIELD[key]] = value;
  }
  persistUtm(utm);
  return utm;
}
