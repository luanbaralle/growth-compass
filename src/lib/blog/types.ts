export type BlogCategory =
  | "insights"
  | "google-ads"
  | "meta-ads"
  | "seo"
  | "ia"
  | "tecnologia"
  | "imobiliario"
  | "growth";

export type BlogType = "artigo" | "guia" | "comparativo";

export type BlogPillar = "aquisicao" | "funil" | "presenca" | "imobiliario";

export type RelatedLinkType = "case" | "segment" | "solution" | "article";

export interface BlogRelatedLink {
  label: string;
  href: string;
  type: RelatedLinkType;
  description?: string;
}

export interface BlogFaqItem {
  question: string;
  answer: string;
}

export type BlogSection =
  | { kind: "paragraph"; text: string }
  | { kind: "heading"; text: string; level: 2 | 3; id?: string }
  | { kind: "list"; items: string[]; ordered?: boolean }
  | { kind: "callout"; text: string; title?: string }
  | {
      kind: "comparison";
      left: { title: string; items: string[] };
      right: { title: string; items: string[] };
    }
  | { kind: "image"; src: string; alt: string; caption?: string }
  | { kind: "quote"; text: string; author?: string }
  | {
      kind: "table";
      headers: string[];
      rows: string[][];
    }
  | {
      kind: "cta";
      title: string;
      description: string;
      primaryLabel: string;
      primaryHref: string;
      secondaryLabel?: string;
      secondaryHref?: string;
    }
  | {
      kind: "linkCard";
      label: string;
      href: string;
      type: RelatedLinkType;
      description?: string;
    };

export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  type: BlogType;
  readTime: string;
  publishedAt: string;
  modifiedAt?: string;
  author: string;
  seo: { title: string; description: string };
  sections: BlogSection[];
  relatedSlugs: string[];
  featuredImage?: string;
  faq?: BlogFaqItem[];
  relatedLinks?: BlogRelatedLink[];
  targetKeywords?: string[];
  pillar?: BlogPillar;
  segments?: string[];
}

export interface BlogCategoryMeta {
  id: BlogCategory | "all";
  label: string;
  description: string;
}
