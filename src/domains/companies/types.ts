export type CompanyStage =
  | "lead"
  | "contato"
  | "proposta"
  | "negociacao"
  | "ativo"
  | "pausado"
  | "encerrado";

export type ActivityType =
  | "note"
  | "stage_change"
  | "file_added"
  | "project_created"
  | "payment"
  | "meeting"
  | "system";

export type FileCategory =
  | "contract"
  | "receipt"
  | "invoice"
  | "proposal_doc"
  | "analysis"
  | "document"
  | "other";

export type LinkType =
  | "google_ads"
  | "meta_ads"
  | "landing_page"
  | "analytics"
  | "search_console"
  | "google_business"
  | "website"
  | "instagram"
  | "facebook"
  | "tiktok"
  | "youtube"
  | "proposal"
  | "contract"
  | "drive"
  | "other";

export type CredentialPlatform =
  | "google"
  | "instagram"
  | "facebook"
  | "tiktok"
  | "youtube"
  | "crm"
  | "ads"
  | "hosting"
  | "other";

export type OperationItemType =
  | "roadmap_note"
  | "report"
  | "analysis"
  | "audit"
  | "alignment_meeting"
  | "scope_change"
  | "other";

export type ServiceStatus = "active" | "paused" | "completed";

export interface Company {
  id: string;
  name: string;
  legal_name: string | null;
  cnpj: string | null;
  city: string | null;
  city_state: string | null;
  responsible_name: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  origin: string | null;
  segment: string | null;
  stage: CompanyStage;
  notes: string | null;
  logo_storage_path?: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  template_slug: string | null;
  microvertical_id: string | null;
  match_level: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompanyActivity {
  id: string;
  company_id: string;
  type: ActivityType;
  title: string;
  body: string | null;
  metadata: Record<string, unknown>;
  author_id: string | null;
  created_at: string;
}

export interface CompanyFile {
  id: string;
  company_id: string;
  finance_entry_id: string | null;
  name: string;
  storage_path: string;
  category: FileCategory;
  mime_type: string | null;
  size_bytes: number | null;
  uploaded_by: string | null;
  created_at: string;
}

export interface CompanyLink {
  id: string;
  company_id: string;
  type: LinkType;
  label: string;
  url: string;
  created_at: string;
}

export interface CompanyService {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  status: ServiceStatus;
  created_at: string;
}

/** Resposta da API — nunca inclui secret_encrypted em listagens. */
export interface CompanyCredential {
  id: string;
  company_id: string;
  platform: CredentialPlatform;
  label: string;
  username: string | null;
  has_secret: boolean;
  url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompanyOperationItem {
  id: string;
  company_id: string;
  project_id: string | null;
  item_type: OperationItemType;
  title: string;
  body: string | null;
  url: string | null;
  occurred_at: string | null;
  author_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompanyListFilters {
  search?: string;
  stage?: CompanyStage | "all";
  sort?: "name" | "created_at" | "stage";
  order?: "asc" | "desc";
}

export interface CompanyStageCounts {
  all: number;
  lead: number;
  contato: number;
  proposta: number;
  negociacao: number;
  ativo: number;
  pausado: number;
  encerrado: number;
}

/** Empresa com URL assinada do logo (resposta da API). */
export type CompanyWithLogo = Company & { logo_url: string | null };

export const COMPANY_STAGES: CompanyStage[] = [
  "lead",
  "contato",
  "proposta",
  "negociacao",
  "ativo",
  "pausado",
  "encerrado",
];

export const STAGE_LABELS: Record<CompanyStage, string> = {
  lead: "Lead",
  contato: "Contato realizado",
  proposta: "Proposta enviada",
  negociacao: "Negociação",
  ativo: "Cliente ativo",
  pausado: "Pausado",
  encerrado: "Encerrado",
};

export const LINK_TYPE_LABELS: Record<LinkType, string> = {
  google_ads: "Google Ads",
  meta_ads: "Meta Ads",
  landing_page: "Landing Page",
  analytics: "Analytics",
  search_console: "Search Console",
  google_business: "Google Meu Negócio",
  website: "Site",
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  youtube: "YouTube",
  proposal: "Proposta",
  contract: "Contrato",
  drive: "Drive",
  other: "Outro",
};

export const FILE_CATEGORY_LABELS: Record<FileCategory, string> = {
  contract: "Contrato",
  receipt: "Recibo",
  invoice: "Nota fiscal",
  proposal_doc: "Proposta",
  analysis: "Análise",
  document: "Documento",
  other: "Outro",
};

export const CREDENTIAL_PLATFORM_LABELS: Record<CredentialPlatform, string> = {
  google: "Google",
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  youtube: "YouTube",
  crm: "CRM",
  ads: "Ads",
  hosting: "Hospedagem",
  other: "Outro",
};

export const OPERATION_ITEM_TYPE_LABELS: Record<OperationItemType, string> = {
  roadmap_note: "Nota de roadmap",
  report: "Relatório",
  analysis: "Análise",
  audit: "Auditoria",
  alignment_meeting: "Reunião de alinhamento",
  scope_change: "Mudança de escopo",
  other: "Outro",
};

export const CREDENTIAL_PLATFORMS: CredentialPlatform[] = [
  "google",
  "instagram",
  "facebook",
  "tiktok",
  "youtube",
  "crm",
  "ads",
  "hosting",
  "other",
];

export const OPERATION_ITEM_TYPES: OperationItemType[] = [
  "roadmap_note",
  "report",
  "analysis",
  "audit",
  "alignment_meeting",
  "scope_change",
  "other",
];

export interface SubmitCompanyFormInput {
  name: string;
  phone: string;
  city: string;
  cityState?: string;
  business: string;
  segment: string;
  templateSlug: string;
  negocio?: string;
  displayLabel?: string;
  microverticalId?: string;
  matchLevel?: "exact" | "related" | "dynamic";
  source: "hub" | "lp" | "direct";
  link?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
}
