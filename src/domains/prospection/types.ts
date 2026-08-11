import type { TeamMember } from "@/lib/auth/types";

export type ProspectStatus =
  | "novo"
  | "primeiro_contato"
  | "respondeu"
  | "diagnostico_enviado"
  | "interessado"
  | "proposta_enviada"
  | "negociacao"
  | "cliente"
  | "perdido";

export type ChecklistStatus = "yes" | "no" | "partial";

export type InteractionType =
  | "registered"
  | "message_sent"
  | "message_received"
  | "follow_up"
  | "proposal_sent"
  | "diagnosis_sent"
  | "converted"
  | "note"
  | "status_change";

export type InteractionDirection = "out" | "in" | "internal";

export type ScriptType =
  | "segment_overview"
  | "pre_contact_checklist"
  | "conversation_philosophy"
  | "first_approach_examples"
  | "conversation_patterns"
  | "conversation_questions"
  | "when_to_present_raise_one"
  | "how_to_present_raise_one"
  | "best_practices";

export interface Prospect {
  id: string;
  name: string;
  category: string | null;
  segment_slug: string | null;
  city: string | null;
  state: string | null;
  phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  website: string | null;
  google_maps_url: string | null;
  owner_id: string | null;
  source: string | null;
  notes: string | null;
  status: ProspectStatus;
  tags: string[];
  next_action: string | null;
  next_action_date: string | null;
  company_id: string | null;
  converted_at: string | null;
  last_interaction_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProspectInteraction {
  id: string;
  prospect_id: string;
  type: InteractionType;
  title: string;
  body: string | null;
  direction: InteractionDirection | null;
  occurred_at: string;
  author_id: string | null;
  created_at: string;
}

export interface ProspectChecklistItem {
  prospect_id: string;
  item_key: string;
  status: ChecklistStatus;
  notes: string | null;
  updated_at: string;
}

export interface ProspectOpportunityItem {
  prospect_id: string;
  opportunity_key: string;
  checked: boolean;
  updated_at: string;
}

export interface CommercialSegment {
  id: string;
  slug: string;
  name: string;
  sort_order: number;
  created_at: string;
}

export interface CommercialScript {
  id: string;
  segment_id: string;
  script_type: ScriptType;
  content: string;
  updated_at: string;
}

export interface CommercialObjection {
  id: string;
  segment_id: string;
  objection: string;
  response: string;
  objective: string;
  sort_order: number;
  updated_at: string;
}

export interface CommercialQualification {
  id: string;
  segment_id: string;
  question: string;
  sort_order: number;
  updated_at: string;
}

export interface CommercialCase {
  id: string;
  segment_id: string;
  case_slug: string;
  title: string;
  updated_at: string;
}

export interface ProspectListFilters {
  search?: string;
  status?: ProspectStatus | "all";
  category?: string;
  city?: string;
  source?: string;
  ownerId?: TeamMember | "all";
  sort?: "last_interaction_at" | "created_at" | "name" | "next_action_date";
  order?: "asc" | "desc";
}

export interface ProspectStatusCounts {
  all: number;
  novo: number;
  primeiro_contato: number;
  respondeu: number;
  diagnostico_enviado: number;
  interessado: number;
  proposta_enviada: number;
  negociacao: number;
  cliente: number;
  perdido: number;
}

export interface ProspectionMetrics {
  prospected: number;
  messagesSent: number;
  responses: number;
  diagnosesSent: number;
  proposals: number;
  clients: number;
  lost: number;
  responseRate: number;
  conversionRate: number;
  upcomingActions: Prospect[];
}

export const PROSPECT_STATUSES: ProspectStatus[] = [
  "novo",
  "primeiro_contato",
  "respondeu",
  "diagnostico_enviado",
  "interessado",
  "proposta_enviada",
  "negociacao",
  "cliente",
  "perdido",
];

export const STATUS_LABELS: Record<ProspectStatus, string> = {
  novo: "Novo",
  primeiro_contato: "Primeiro contato",
  respondeu: "Respondeu",
  diagnostico_enviado: "Diagnóstico enviado",
  interessado: "Interessado",
  proposta_enviada: "Proposta enviada",
  negociacao: "Negociação",
  cliente: "Cliente",
  perdido: "Perdido",
};

export const CHECKLIST_ITEMS: { key: string; label: string }[] = [
  { key: "google_business", label: "Google Meu Negócio" },
  { key: "website", label: "Website" },
  { key: "landing_page", label: "Landing Page" },
  { key: "google_ads", label: "Google Ads" },
  { key: "meta_ads", label: "Meta Ads" },
  { key: "instagram", label: "Instagram" },
  { key: "pixel", label: "Pixel" },
  { key: "google_analytics", label: "Google Analytics" },
  { key: "search_console", label: "Search Console" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "cta", label: "CTA" },
  { key: "seo_basic", label: "SEO básico" },
  { key: "performance", label: "Performance" },
  { key: "visual_identity", label: "Identidade visual" },
  { key: "measurement", label: "Mensuração" },
];

export const OPPORTUNITY_ITEMS: { key: string; label: string }[] = [
  { key: "landing_page", label: "Landing Page" },
  { key: "google_ads", label: "Google Ads" },
  { key: "meta_ads", label: "Meta Ads" },
  { key: "seo", label: "SEO" },
  { key: "crm", label: "CRM" },
  { key: "automation", label: "Automação" },
  { key: "analytics", label: "Analytics" },
  { key: "measurement", label: "Mensuração" },
  { key: "conversion", label: "Conversão" },
  { key: "copywriting", label: "Copywriting" },
  { key: "positioning", label: "Posicionamento" },
  { key: "branding", label: "Branding" },
  { key: "funnel", label: "Funil" },
];

export const SCRIPT_TYPE_LABELS: Record<ScriptType, string> = {
  segment_overview: "Visão geral do segmento",
  pre_contact_checklist: "O que observar antes do contato",
  conversation_philosophy: "Filosofia da conversa",
  first_approach_examples: "Padrões de primeira abordagem",
  conversation_patterns: "Como reagir às respostas",
  conversation_questions: "Perguntas que surgem na conversa",
  when_to_present_raise_one: "Quando faz sentido falar da Raise One",
  how_to_present_raise_one: "Como falar da Raise One (só se perguntarem)",
  best_practices: "Boas práticas",
};

export const INTERACTION_TYPE_LABELS: Record<InteractionType, string> = {
  registered: "Empresa cadastrada",
  message_sent: "Mensagem enviada",
  message_received: "Resposta recebida",
  follow_up: "Follow-up",
  proposal_sent: "Proposta enviada",
  diagnosis_sent: "Diagnóstico enviado",
  converted: "Cliente convertido",
  note: "Nota",
  status_change: "Status alterado",
};

export function formatProspectDate(iso: string | null): string {
  if (!iso) return "—";
  const d = iso.includes("T") ? iso.slice(0, 10) : iso;
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

export function formatRelativeDate(iso: string | null): string {
  if (!iso) return "Sem interação";
  const date = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Hoje";
  if (diff === 1) return "Ontem";
  if (diff < 7) return `${diff}d atrás`;
  return formatProspectDate(iso);
}

export type NextActionUrgency = "overdue" | "today" | "future";

export const NEXT_ACTION_URGENCY_LABELS: Record<NextActionUrgency, string> = {
  overdue: "Vencida",
  today: "Hoje",
  future: "Futura",
};

export function getNextActionUrgency(date: string | null): NextActionUrgency | null {
  if (!date) return null;
  const today = new Date().toISOString().slice(0, 10);
  if (date < today) return "overdue";
  if (date === today) return "today";
  return "future";
}

/** Link wa.me — retorna null se o número tiver menos de 10 dígitos. */
export function buildWhatsAppUrl(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return null;
  const normalized = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${normalized}`;
}
