export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function getWhatsAppNumber(): string {
  const raw = import.meta.env.VITE_WHATSAPP_NUMBER ?? "";
  return normalizePhone(raw);
}

export function buildWhatsAppUrl(message: string, phone?: string): string | null {
  const number = normalizePhone(phone ?? getWhatsAppNumber());
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildLeadWhatsAppMessage(params: {
  name: string;
  business: string;
  city: string;
  cityState?: string;
  link?: string;
}): string {
  const location = params.cityState ? `${params.city}, ${params.cityState}` : params.city;
  const linkNote = params.link?.trim()
    ? ` Meu site/Instagram: ${params.link.trim()}.`
    : "";
  return `Olá! Sou ${params.name}, tenho um ${params.business} em ${location}. Acabei de solicitar o diagnóstico gratuito da Raise One e gostaria de falar sobre oportunidades de crescimento.${linkNote}`;
}

export function buildClientWhatsAppUrl(phone: string, message?: string): string {
  const normalized = normalizePhone(phone);
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/55${normalized.replace(/^55/, "")}${text}`;
}
