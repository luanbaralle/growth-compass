/** Configuração global de SEO — URL canônica via VITE_SITE_URL. */
export const SITE = {
  name: "Raise One",
  legalName: "Raise One Hub",
  tagline: "Empresa de Growth, Marketing e Tecnologia",
  description:
    "Raise One — parceiro de crescimento digital. Google Ads, Meta Ads, conteúdo, IA, CRM, automações e tecnologia sob medida para empresas que querem escalar.",
  locale: "pt_BR",
  language: "pt-BR",
  email: "contato@raiseone.com.br",
  phone: "+55",
  twitterHandle: "@raiseone",
  defaultKeywords: [
    "growth marketing",
    "google ads",
    "meta ads",
    "agência de growth",
    "marketing digital",
    "tecnologia",
    "automação",
    "CRM",
    "landing pages",
    "aquisição de clientes",
  ],
} as const;

export function getSiteUrl(): string {
  const envUrl =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_SITE_URL) ||
    (typeof process !== "undefined" && process.env?.VITE_SITE_URL);
  if (envUrl && typeof envUrl === "string") return envUrl.replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "https://raiseone.com.br";
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

export const DEFAULT_OG_IMAGE = "/og-default.png";

export function absoluteOgImage(imagePath?: string): string {
  const path = imagePath ?? DEFAULT_OG_IMAGE;
  if (path.startsWith("http")) return path;
  return absoluteUrl(path);
}
