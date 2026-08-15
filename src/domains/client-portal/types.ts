export interface CompanyUser {
  id: string;
  company_id: string;
  email: string;
  name: string;
  phone: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompanyUserWithCompany extends CompanyUser {
  companies: { name: string } | null;
}

export interface ClientSessionUser {
  id: string;
  email: string;
  name: string;
  companyId: string;
  companyName: string;
  companyLogoUrl: string | null;
}

export type ClientPendingActionKind = "content_approval" | "project_input" | "material_request";

export interface ClientPendingAction {
  id: string;
  kind: ClientPendingActionKind;
  title: string;
  subtitle: string;
  href: string;
}

export interface ClientProjectPreview {
  id: string;
  title: string;
  typeLabel: string;
  statusLabel: string;
  progressPct: number | null;
  href: string;
}

export interface ClientHomeSummary {
  greetingName: string;
  periodLabel: string;
  metrics: {
    leads: number;
    investmentCents: number;
    conversions: number;
    cplCents: number | null;
    leadsDeltaPct: number | null;
    cplDeltaPct: number | null;
    hasData: boolean;
  };
  pendingActions: ClientPendingAction[];
  workSummary: {
    periodLabel: string;
    contentsProduced: number;
    contentsInPipeline: number;
    campaignOptimizations: number;
    landingImprovements: number;
    leadsGenerated: number;
    investmentManagedCents: number;
  };
  highlight: string | null;
  projects: ClientProjectPreview[];
  contentCounts: {
    emProducao: number;
    aguardandoAprovacao: number;
    programados: number;
    publicados: number;
  };
  monthReport: ClientMonthReport | null;
}

export interface ClientMonthReport {
  periodLabel: string;
  leads: number;
  leadsDeltaPct: number | null;
  investmentCents: number;
  cplCents: number | null;
  cplDeltaPct: number | null;
  highlight: string | null;
  nextFocus: string | null;
}

export interface ClientResultsOverview {
  periodLabel: string;
  previousPeriodLabel: string;
  hasData: boolean;
  summary: {
    investmentCents: number;
    leads: number;
    conversions: number;
    cplCents: number | null;
    ctr: number | null;
  };
  comparison: {
    leads: { current: number; previous: number; deltaPct: number | null };
    investment: { current: number; previous: number; deltaPct: number | null };
    cpl: { current: number | null; previous: number | null; deltaPct: number | null };
  };
  channels: Array<{
    channel: import("@/domains/marketing/types").MarketingChannel;
    label: string;
    hasData: boolean;
    periodLabel: string | null;
    investmentCents: number;
    leads: number;
    conversions: number;
    cplCents: number | null;
    ctr: number | null;
  }>;
  leadsTrend: Array<{ key: string; label: string; leads: number }>;
  monthReport: ClientMonthReport;
}

export interface ClientMagicLinkRow {
  id: string;
  company_user_id: string;
  token_hash: string;
  expires_at: string;
  used_at: string | null;
  created_at: string;
}

export interface ClientContentListItem {
  id: string;
  title: string;
  status: import("@/domains/content-production/types").ContentTaskStatus;
  statusLabel: string;
  contentTypeLabel: string;
  channelsLabel: string;
  postDate: string | null;
  canApprove: boolean;
}

export interface ClientContentDetail extends ClientContentListItem {
  companyName: string;
  channels: Array<{ id: import("@/domains/content-production/types").ContentChannel; label: string }>;
  contentType: import("@/domains/content-production/types").ContentType;
  briefingCaption: string;
  briefingCta: string;
  raiseOneNote: string | null;
  previewChannel: import("@/domains/content-production/types").ContentChannel;
  previewMediaUrl: string | null;
  previewMimeType: string | null;
  clientApprovedAt: string | null;
  clientApprovedBy: string | null;
}

export interface ClientProjectListItem {
  id: string;
  title: string;
  typeLabel: string;
  status: import("@/domains/projects/types").ProjectStatus;
  statusLabel: string;
  progressPct: number | null;
  dueDate: string | null;
  needsClient: boolean;
}

export interface ClientProjectHistoryItem {
  id: string;
  title: string;
  body: string | null;
  occurredAt: string;
}

export interface ClientProjectDetail extends ClientProjectListItem {
  nextStepLabel: string | null;
  forecastDate: string | null;
  lastUpdatedAt: string;
  history: ClientProjectHistoryItem[];
}

export interface ClientFinanceSubscription {
  label: string;
  amountCents: number;
  nextDueDate: string | null;
  nextDueDateLabel: string | null;
  statusLabel: string;
  statusTone: "ok" | "warning" | "critical";
}

export interface ClientFinanceMediaInvestment {
  periodLabel: string;
  googleAdsCents: number;
  metaAdsCents: number;
  totalCents: number;
}

export interface ClientFinanceHistoryItem {
  id: string;
  periodLabel: string;
  description: string;
  amountCents: number;
  statusLabel: string;
  status: import("@/domains/finance/types").FinanceEntryStatus;
}

export interface ClientFinanceOverview {
  subscription: ClientFinanceSubscription | null;
  mediaInvestment: ClientFinanceMediaInvestment;
  history: ClientFinanceHistoryItem[];
}
