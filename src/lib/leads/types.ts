export type LeadStatus = "new" | "contacted" | "converted" | "lost";

export type LeadSource = "hub" | "lp" | "direct";

export interface Lead {
  id: string;
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
  source: LeadSource;
  link?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  status: LeadStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitLeadInput {
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
  source: LeadSource;
  link?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
}
