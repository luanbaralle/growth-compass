import type { LucideIcon } from "lucide-react";

export interface SegmentVisual {
  heroImage: string;
  heroImageAlt: string;
  overlayLabel: string;
}

export interface JourneyStep {
  label: string;
  icon: LucideIcon;
}

export interface SearchResultItem {
  /** Nome exibido no resultado simulado */
  name: string;
  /** Se true, exibe badge "Anúncio" */
  isAd?: boolean;
  /** URL futura para screenshot real — substitui o mock quando preenchida */
  screenshotUrl?: string;
  /** URL real do resultado (Google CSE) */
  url?: string;
  /** Descrição/snippet do resultado */
  snippet?: string;
}

export interface DemandBar {
  label: string;
  value: number;
}

export interface AnalysisCard {
  title: string;
  description: string;
}

export interface SolutionCard {
  tag: string;
  title: string;
  description: string;
}

export interface SegmentSEO {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
}

export interface SegmentConfig {
  slug: string;
  name: string;
  /** Rótulo exibido no card do hub */
  hubLabel: string;
  icon: LucideIcon;
  /** Cor secundária da vertical (oklch) — identidade Raise One permanece laranja */
  accentColor: string;
  accentSoft: string;

  seo: SegmentSEO;

  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    ctaLabel: string;
    trustItems: string[];
    monthlySearches: string;
  };

  visibility: {
    eyebrow: string;
    title: string;
    titleMuted: string;
    qualities: string[];
    closingLine: string;
    searchExamples: string[];
    ctaQuestion: string;
    businessType: string;
  };

  invisibleClient: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    searchQuery: string;
    paragraphs: string[];
    closingLine: string;
  };

  journey: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    steps: JourneyStep[];
    instagramNote: string;
    googleNote: string;
  };

  ahaMoment: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    winFlow: string[];
    loseFlow: string[];
    winOutcome: string;
    loseOutcome: string;
  };

  demand: {
    eyebrow: string;
    title: string;
    titleMuted: string;
    paragraphs: string[];
    bars: DemandBar[];
    totalSearches: string;
    capturedLabel: string;
    availableLabel: string;
  };

  fomo: {
    title: string;
    subtitle: string;
    searchQuery: string;
    competitors: SearchResultItem[];
    yourBusinessLabel: string;
    notFoundLabel: string;
  };

  missedOpportunity: {
    title: string;
    subtitle: string;
    flowSteps: string[];
    sideTitle: string;
    sideLines: string[];
  };

  analysis: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    checklist: string[];
    cards: AnalysisCard[];
    footerLine: string;
    footerSub: string;
  };

  mission: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    paragraphs: string[];
    dependencyTags: string[];
    cardDescription: string;
  };

  solutions: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    cards: SolutionCard[];
    footerLine: string;
    footerHighlight: string;
  };

  form: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    submitLabel: string;
    businessFieldLabel: string;
    footerNote: string;
    trustItems: string[];
  };
}

export interface HubSegmentCard {
  slug: string;
  label: string;
  description: string;
  icon: LucideIcon;
  accentColor: string;
}

export type PartialSegmentConfig = Omit<
  SegmentConfig,
  "slug" | "name" | "hubLabel" | "icon" | "accentColor" | "accentSoft" | "seo"
> &
  Partial<
    Pick<
      SegmentConfig,
      "slug" | "name" | "hubLabel" | "icon" | "accentColor" | "accentSoft" | "seo"
    >
  >;
