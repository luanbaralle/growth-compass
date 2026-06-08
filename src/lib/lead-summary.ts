export type DigitalPresenceType = "instagram" | "website" | "none";

export interface DigitalPresence {
  type: DigitalPresenceType;
  label: string;
  detail: string;
}

export interface LeadConfirmationSummary {
  name: string;
  business: string;
  city: string;
  cityState?: string;
  link?: string;
  searchExamples?: string[];
  digitalPresence: DigitalPresence;
}

export const LEAD_SUMMARY_STORAGE_KEY = "raise_lead_summary";

export function parseDigitalPresence(link?: string): DigitalPresence {
  const raw = link?.trim();
  if (!raw) {
    return {
      type: "none",
      label: "Não informada",
      detail: "Vamos mapear o que encontrarmos sobre seu negócio online.",
    };
  }

  const normalized = raw.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "");

  if (
    normalized.includes("instagram.com") ||
    normalized.startsWith("@") ||
    normalized.includes("instagr.am")
  ) {
    const handle = normalized
      .replace(/.*instagram\.com\//, "")
      .replace(/^@/, "")
      .split(/[/?#]/)[0];
    return {
      type: "instagram",
      label: handle ? `@${handle}` : "Instagram",
      detail: "Analisaremos perfil, engajamento e gaps frente aos concorrentes locais.",
    };
  }

  const display = raw.startsWith("http") ? raw : `https://${raw}`;
  let host = raw;
  try {
    host = new URL(display).hostname.replace(/^www\./, "");
  } catch {
    // mantém raw
  }

  return {
    type: "website",
    label: host,
    detail: "Analisaremos SEO, visibilidade no Google e posicionamento frente à concorrência.",
  };
}

export function buildLeadConfirmationSummary(params: {
  name: string;
  business: string;
  city: string;
  cityState?: string;
  link?: string;
  searchExamples?: string[];
}): LeadConfirmationSummary {
  return {
    ...params,
    digitalPresence: parseDigitalPresence(params.link),
  };
}

export function saveLeadSummary(summary: LeadConfirmationSummary): void {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(LEAD_SUMMARY_STORAGE_KEY, JSON.stringify(summary));
}

export function readLeadSummary(): LeadConfirmationSummary | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(LEAD_SUMMARY_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LeadConfirmationSummary;
  } catch {
    return null;
  }
}

export function clearLeadSummary(): void {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.removeItem(LEAD_SUMMARY_STORAGE_KEY);
}
