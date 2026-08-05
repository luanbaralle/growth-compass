import type { HomeFaqItem } from "@/lib/home/content";
import { absoluteOgImage, absoluteUrl, SITE } from "@/lib/seo/site";

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface PageSeoInput {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogType?: "website" | "article" | "product";
  ogImage?: string;
  noindex?: boolean;
  article?: {
    publishedTime: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
}

export function buildPageHead(input: PageSeoInput) {
  const url = absoluteUrl(input.path);
  const ogImage = absoluteOgImage(input.ogImage);
  const keywords = [...SITE.defaultKeywords, ...(input.keywords ?? [])].join(", ");

  const meta: Array<Record<string, string>> = [
    { title: input.title },
    { name: "description", content: input.description },
    { name: "keywords", content: keywords },
    { name: "author", content: SITE.name },
    { name: "language", content: SITE.language },
    { name: "robots", content: input.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large" },
    { name: "googlebot", content: input.noindex ? "noindex, nofollow" : "index, follow" },

    // Open Graph
    { property: "og:site_name", content: SITE.name },
    { property: "og:title", content: input.title },
    { property: "og:description", content: input.description },
    { property: "og:type", content: input.ogType ?? "website" },
    { property: "og:url", content: url },
    { property: "og:locale", content: SITE.locale },
    { property: "og:image", content: ogImage },
    { property: "og:image:alt", content: `${SITE.name} — ${SITE.tagline}` },

    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: input.title },
    { name: "twitter:description", content: input.description },
    { name: "twitter:image", content: ogImage },
  ];

  if (input.article) {
    meta.push(
      { property: "article:published_time", content: input.article.publishedTime },
      { property: "article:author", content: input.article.author ?? SITE.name },
    );
    if (input.article.modifiedTime) {
      meta.push({ property: "article:modified_time", content: input.article.modifiedTime });
    }
    if (input.article.section) {
      meta.push({ property: "article:section", content: input.article.section });
    }
    for (const tag of input.article.tags ?? []) {
      meta.push({ property: "article:tag", content: tag });
    }
  }

  const links = [{ rel: "canonical", href: url }];

  return { meta, links };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${absoluteUrl("/")}#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: absoluteUrl("/"),
    logo: absoluteOgImage("/og-default.png"),
    description: SITE.description,
    email: SITE.email,
    sameAs: [
      "https://www.instagram.com/raiseone",
      "https://www.linkedin.com/company/raiseone",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: SITE.email,
      availableLanguage: ["Portuguese"],
    },
  };
}

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${absoluteUrl("/")}#website`,
    name: SITE.name,
    url: absoluteUrl("/"),
    description: SITE.description,
    inLanguage: SITE.language,
    publisher: { "@id": `${absoluteUrl("/")}#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl("/blog")}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(items: HomeFaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function serviceSchema(input: {
  name: string;
  description: string;
  path: string;
  category?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    provider: { "@id": `${absoluteUrl("/")}#organization` },
    areaServed: { "@type": "Country", name: "Brasil" },
    serviceType: input.category ?? "Marketing Digital",
  };
}

export function articleSchema(input: {
  title: string;
  description: string;
  path: string;
  publishedTime: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  keywords?: string[];
  image?: string;
  wordCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    datePublished: input.publishedTime,
    dateModified: input.modifiedTime ?? input.publishedTime,
    author: {
      "@type": "Organization",
      name: input.author ?? SITE.name,
      url: absoluteUrl("/"),
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteOgImage(),
      },
    },
    inLanguage: SITE.language,
    articleSection: input.section,
    keywords: input.keywords?.join(", "),
    mainEntityOfPage: absoluteUrl(input.path),
    ...(input.image
      ? {
          image: {
            "@type": "ImageObject",
            url: absoluteOgImage(input.image),
          },
        }
      : {}),
    ...(input.wordCount ? { wordCount: input.wordCount } : {}),
  };
}

export function itemListSchema(input: {
  name: string;
  description: string;
  path: string;
  items: { name: string; path: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    numberOfItems: input.items.length,
    itemListElement: input.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

export function caseStudySchema(input: {
  name: string;
  description: string;
  path: string;
  client: string;
  services: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `Case ${input.name}`,
    description: input.description,
    url: absoluteUrl(input.path),
    author: { "@id": `${absoluteUrl("/")}#organization` },
    about: input.client,
    keywords: input.services.join(", "),
  };
}

export function webPageSchema(input: {
  title: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    inLanguage: SITE.language,
    isPartOf: { "@id": `${absoluteUrl("/")}#website` },
    publisher: { "@id": `${absoluteUrl("/")}#organization` },
  };
}

export function softwareApplicationSchema(input: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BRL",
      description: "Diagnóstico gratuito disponível",
    },
    provider: { "@id": `${absoluteUrl("/")}#organization` },
  };
}
