export type ReportAccent = "blue" | "red" | "yellow" | "green";

export type ReportIconKey =
  | "target"
  | "pause"
  | "mapPin"
  | "users"
  | "calendar"
  | "search"
  | "trendingUp"
  | "scissors"
  | "sparkles";

export type ReportMetricTotals = {
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  cpc: number;
  costPerConv?: number;
  convRate?: number;
  ctr?: number;
};

export type ReportCampaign = {
  id: string;
  name: string;
  subtitle: string;
  accent: "blue" | "yellow";
  iconKey: "scissors" | "sparkles";
  metrics: ReportMetricTotals;
};

export type ReportKpi = {
  value: string;
  label: string;
  description: string;
  accent: ReportAccent;
};

export type ReportMonth = {
  slug: string;
  monthLabel: string;
  cycleLabel: string;
  cycleShort: string;
  headerPeriod: string;
  period: string;
  periodShort: string;
  dashboardPeriodLabel: string;
  heroSubtitle: string;
  heroEmphasis?: string;
  metaChips: { k: string; v: string }[];
  overviewIntro: string;
  overviewHighlight?: string;
  kpis: ReportKpi[];
  dashboardImage: "maio" | "junho" | "julho" | "agosto";
  /** O que a agência executou no ciclo (a partir de agosto). */
  agencyWork?: {
    intro: string;
    items: string[];
  };
  campaignsNote?: string;
  campaignsIntro?: string;
  campaignsInsight?: string;
  campaigns?: ReportCampaign[];
  comparison?: {
    leftLabel: string;
    rightLabel: string;
    intro: string;
    warning?: string;
    prev: ReportMetricTotals;
    current: ReportMetricTotals;
  };
  investment: {
    intro: string;
    mediaCostDisplay: string;
    daysLabel: string;
    bars: { label: string; value: string; pct: number; note: string; muted?: boolean }[];
    sideNotes: string[];
    proofTitle?: string;
    proofText?: string;
  };
  reach: {
    highlightNumber: string;
    intro: string;
    cards: { title: string; text: string; iconKey: ReportIconKey }[];
  };
  clicks: {
    highlightNumber: string;
    titleAfter: string;
    intro: string;
    funnel: { label: string; value: number; max: number; accent: ReportAccent }[];
    cpcDisplay: string;
    cpcBadge: string;
    cpcNote: string;
    miniStats: { v: string; l: string }[];
  };
  audience: {
    intro: string;
    cards: { title: string; big: string; text: string; iconKey: ReportIconKey }[];
  };
  funnel: {
    intro: string;
    steps: { label: string; value: string }[];
    afterTitle: string;
    afterText: string;
  };
  strategy: {
    title: string;
    titleSoft: string;
    intro: string;
    badTitle: string;
    badItems: string[];
    goodTitle: string;
    goodItems: string[];
    extraTitle?: string;
    extraText?: string;
  };
  budget: {
    cards: {
      label: string;
      value: string;
      suffix?: string;
      note: string;
      highlight?: boolean;
    }[];
  };
  opportunity?: {
    highlight: string;
    titleAfter: string;
    intro: string;
    investTarget: string;
    deadline: string;
    bonus: string;
    progressDisplay: string;
    progressPct: number;
    remaining: string;
    cards: { label: string; value: string; desc: string }[];
    howToTitle: string;
    howToText: string;
    creditsTitle: string;
    creditsText: string;
  };
  conclusion: {
    title: string;
    titleSoft: string;
    intro: string;
    items: { n: string; title: string; text: string }[];
    quote: string;
  };
  footerLabel: string;
};

export type ReportCompany = {
  slug: string;
  name: string;
  legalName: string;
  region: string;
  platform: string;
  logo: string;
  months: ReportMonth[];
};
