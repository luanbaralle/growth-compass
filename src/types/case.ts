export interface CaseMetric {
  value: string;
  label: string;
}

export interface CaseGalleryItem {
  src: string;
  alt: string;
  caption?: string;
}

export interface CaseColor {
  name: string;
  hex: string;
}

export interface CaseTypography {
  heading: string;
  body: string;
}

export interface CaseTestimonial {
  quote: string;
  author: string;
  role?: string;
}

export interface CaseNextProject {
  slug: string;
  title: string;
  coverImage: string;
}

export interface CaseProcessStep {
  phase: string;
  title: string;
  description: string;
}

export interface CaseBeforeAfterItem {
  label?: string;
  before: CaseGalleryItem;
  after: CaseGalleryItem;
}

/* ─── Storytelling ─── */

export interface CaseDecision {
  title: string;
  description: string;
  rationale?: string;
}

export interface CaseStoryTimelineEvent {
  date?: string;
  phase?: string;
  title: string;
  description: string;
}

export interface CaseBackstageItem {
  title: string;
  description: string;
  image?: CaseGalleryItem;
}

export interface CaseStorytelling {
  /** Contexto de mercado, cliente e cenário inicial */
  context?: string;
  /** Narrativa estendida do desafio — complementa `Case.challenge` */
  challenge?: string;
  strategy?: string;
  decisions?: CaseDecision[];
  lessonsLearned?: string[];
  impact?: string;
  timeline?: CaseStoryTimelineEvent[];
  backstage?: CaseBackstageItem[];
  processGallery?: CaseGalleryItem[];
}

/* ─── Design ─── */

export interface CaseUIHighlight {
  title: string;
  description: string;
  image?: CaseGalleryItem;
}

export interface CaseDesignComponent {
  name: string;
  description: string;
  usage?: string;
}

export interface CaseInteraction {
  name: string;
  description: string;
}

export interface CaseDesignDetails {
  /** Complementa `Case.typography` com detalhes adicionais */
  typography?: CaseTypography;
  /** Complementa `Case.colors` com detalhes adicionais */
  colors?: CaseColor[];
  uiHighlights?: CaseUIHighlight[];
  components?: CaseDesignComponent[];
  interactions?: CaseInteraction[];
}

/* ─── Desenvolvimento ─── */

export interface CaseIntegration {
  name: string;
  description: string;
  purpose?: string;
}

export interface CaseDevelopment {
  architecture?: string;
  integrations?: CaseIntegration[];
  performanceOptimizations?: string[];
  accessibility?: string[];
  seo?: string[];
}

/* ─── Marketing ─── */

export interface CaseMarketing {
  positioning?: string;
  copyStrategy?: string;
  conversionStrategy?: string;
  ctaPrimary?: string;
}

/** Configuração estendida do hero — casos curados (ex.: UNIP) */
export interface CaseHeroMetaSheet {
  client: string[];
  segment: string;
  services: string[];
  period: string;
}

export interface CaseHeroExtended {
  logo?: string;
  brand?: string;
  location?: string;
  badge?: string;
  /** Identidade de coleção — ex.: "01" + "Educação" */
  caseNumber?: string;
  caseVertical?: string;
  headlineLines?: string[];
  heroMetrics?: CaseMetric[];
  ctaLabel?: string;
  ctaHref?: string;
  metaSheet?: CaseHeroMetaSheet;
  /** `ambient` = fundo escuro sem imagem (evita poluição visual com LP) */
  background?: "image" | "ambient";
  /** Preview da LP ou site no painel direito do split hero */
  panelImage?: string;
}

/* ─── Resultados estendidos ─── */

export interface CaseQualitativeResult {
  title: string;
  description: string;
}

export interface CaseClientWin {
  title: string;
  description: string;
}

export interface CaseResultsExtended {
  /** Complementa `Case.metrics` com métricas adicionais */
  metrics?: CaseMetric[];
  qualitativeResults?: CaseQualitativeResult[];
  clientWins?: CaseClientWin[];
}

/* ─── Conteúdo ─── */

export interface CaseFAQ {
  question: string;
  answer: string;
}

export interface CaseCuriosity {
  title: string;
  description: string;
}

export interface CaseQuote {
  quote: string;
  author: string;
  role?: string;
  context?: string;
}

export interface CaseContentBlock {
  faqs?: CaseFAQ[];
  curiosities?: CaseCuriosity[];
  quotes?: CaseQuote[];
  problemClosing?: string;
  problemChannels?: string[];
  quoteContext?: string;
  landingTitle?: string;
  landingScrollHint?: string;
  transformBefore?: { channels: string[]; outcome: string };
  transformAfter?: { channels: string[]; outcome: string };
  /** Entregáveis Raise One — seção discreta de autoria */
  agencyDeliverables?: string[];
}

/* ─── Case ─── */

export interface Case {
  slug: string;
  title: string;
  subtitle: string;
  client: string;
  industry: string;
  category: string;
  year: number;
  website?: string;
  coverImage: string;
  heroImage: string;
  description: string;
  challenge: string;
  solution: string;
  goals: string[];
  deliverables: string[];
  technologies: string[];
  gallery: CaseGalleryItem[];
  colors: CaseColor[];
  typography: CaseTypography;
  metrics: CaseMetric[];
  testimonial?: CaseTestimonial;
  nextProjects: CaseNextProject[];
  process?: CaseProcessStep[];
  beforeAfter?: CaseBeforeAfterItem[];

  /** Narrativa e storytelling do projeto */
  storytelling?: CaseStorytelling;
  /** Detalhes de design além dos campos base */
  design?: CaseDesignDetails;
  /** Arquitetura, integrações e otimizações técnicas */
  development?: CaseDevelopment;
  /** Posicionamento e estratégia de conversão */
  marketing?: CaseMarketing;
  /** Resultados qualitativos e vitórias do cliente */
  results?: CaseResultsExtended;
  /** FAQs, curiosidades e citações adicionais */
  content?: CaseContentBlock;
  /** Hero estendido — identidade, ficha, métricas */
  heroExtended?: CaseHeroExtended;
}
