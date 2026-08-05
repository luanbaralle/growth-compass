import { getBlogArticle, blogCategories as blogCats, type BlogCategory } from "@/lib/blog/content";
import { getCaseStudy } from "@/lib/cases/content";
import { metodologiaSeo } from "@/lib/metodologia/content";
import { programaSeo } from "@/lib/programa/content";
import { getSolutionPage, solucoesSeo } from "@/lib/solutions/content";
import { casesSeo } from "@/lib/cases/content";
import { blogSeo } from "@/lib/blog/content";
import { diagnosticoSeo } from "@/lib/diagnostico/content";
import { tecnologiaSeo } from "@/lib/tecnologia/content";
import {
  articleSchema,
  buildPageHead,
  caseStudySchema,
  organizationSchema,
  serviceSchema,
  softwareApplicationSchema,
  webPageSchema,
  webSiteSchema,
} from "@/lib/seo/schema";
import type { JsonLdObject } from "@/lib/seo/types";

export function homeSeo() {
  return buildPageHead({
    title: "Raise One — Empresa de Growth, Marketing e Tecnologia",
    description:
      "Parceiro de crescimento digital. Programa de Crescimento, Google Ads, Meta Ads, conteúdo, IA, CRM, automações e tecnologia sob medida. Diagnóstico gratuito.",
    path: "/",
    keywords: [
      "empresa de growth",
      "programa de crescimento",
      "marketing e tecnologia",
      "aquisição de clientes",
      "automação comercial",
    ],
  });
}

export function homeSchemas(): JsonLdObject[] {
  return [
    organizationSchema(),
    webSiteSchema(),
    webPageSchema({
      title: "Raise One — Empresa de Growth, Marketing e Tecnologia",
      description: "Parceiro de crescimento digital integrando marketing, conteúdo e tecnologia.",
      path: "/",
    }),
  ];
}

export function programaSeoHead() {
  return buildPageHead({
    title: programaSeo.title,
    description: programaSeo.description,
    path: "/programa-de-crescimento",
    keywords: ["programa de crescimento", "parceiro estratégico", "growth marketing", "consultoria growth"],
  });
}

export function programaSchemas(): JsonLdObject[] {
  return [
    webPageSchema({ title: programaSeo.title, description: programaSeo.description, path: "/programa-de-crescimento" }),
    serviceSchema({
      name: "Programa de Crescimento Raise One",
      description: programaSeo.description,
      path: "/programa-de-crescimento",
      category: "Growth Marketing",
    }),
  ];
}

export function solucoesSeoHead() {
  return buildPageHead({
    title: solucoesSeo.title,
    description: solucoesSeo.description,
    path: "/solucoes",
    keywords: ["soluções de growth", "marketing digital", "tecnologia", "aquisição"],
  });
}

export function solucoesSchemas(): JsonLdObject[] {
  return [webPageSchema({ title: solucoesSeo.title, description: solucoesSeo.description, path: "/solucoes" })];
}

export function solutionSeoHead(slug: string) {
  const content = getSolutionPage(slug)!;
  return buildPageHead({
    title: content.seo.title,
    description: content.seo.description,
    path: `/solucoes/${slug}`,
    keywords: [content.hero.benefitFocus, content.hero.eyebrow, slug.replace(/-/g, " ")],
  });
}

export function solutionSchemas(slug: string): JsonLdObject[] {
  const content = getSolutionPage(slug)!;
  return [
    webPageSchema({ title: content.seo.title, description: content.seo.description, path: `/solucoes/${slug}` }),
    serviceSchema({
      name: content.hero.title,
      description: content.seo.description,
      path: `/solucoes/${slug}`,
      category: content.hero.eyebrow,
    }),
  ];
}

export function metodologiaSeoHead() {
  return buildPageHead({
    title: metodologiaSeo.title,
    description: metodologiaSeo.description,
    path: "/metodologia",
    keywords: ["metodologia growth", "framework marketing", "discover strategy build", "processo de crescimento"],
  });
}

export function metodologiaSchemas(): JsonLdObject[] {
  return [webPageSchema({ title: metodologiaSeo.title, description: metodologiaSeo.description, path: "/metodologia" })];
}

export function tecnologiaSeoHead() {
  return buildPageHead({
    title: tecnologiaSeo.title,
    description: tecnologiaSeo.description,
    path: "/tecnologia",
    keywords: ["tecnologia marketing", "Atlas imobiliário", "CRM", "automação IA", "dashboards"],
  });
}

export function tecnologiaSchemas(): JsonLdObject[] {
  return [
    webPageSchema({ title: tecnologiaSeo.title, description: tecnologiaSeo.description, path: "/tecnologia" }),
    softwareApplicationSchema({
      name: "Raise One — Tecnologia para crescimento",
      description: "CRM, automações, dashboards e produtos sob medida desenvolvidos pela Raise One.",
      path: "/tecnologia",
    }),
  ];
}

export function casesSeoHead() {
  return buildPageHead({
    title: casesSeo.title,
    description: casesSeo.description,
    path: "/cases",
    keywords: ["cases marketing", "portfólio growth", "resultados google ads", "cases tecnologia"],
  });
}

export function casesSchemas(): JsonLdObject[] {
  return [webPageSchema({ title: casesSeo.title, description: casesSeo.description, path: "/cases" })];
}

export function caseSeoHead(slug: string) {
  const c = getCaseStudy(slug)!;
  return buildPageHead({
    title: `Case ${c.title} — Raise One`,
    description: c.description,
    path: `/cases/${slug}`,
    keywords: [...c.deliverables, c.category, "case de sucesso"],
  });
}

export function caseSchemas(slug: string): JsonLdObject[] {
  const c = getCaseStudy(slug)!;
  return [
    caseStudySchema({
      name: c.title,
      description: c.description,
      path: `/cases/${slug}`,
      client: c.client,
      services: c.deliverables,
    }),
  ];
}

export function diagnosticoSeoHead() {
  return buildPageHead({
    title: diagnosticoSeo.title,
    description: diagnosticoSeo.description,
    path: "/diagnostico",
    keywords: ["diagnóstico de mercado", "análise gratuita", "oportunidades de growth", "diagnóstico inteligente"],
  });
}

export function diagnosticoSchemas(): JsonLdObject[] {
  return [
    webPageSchema({ title: diagnosticoSeo.title, description: diagnosticoSeo.description, path: "/diagnostico" }),
    softwareApplicationSchema({
      name: "Diagnóstico Inteligente Raise One",
      description: diagnosticoSeo.description,
      path: "/diagnostico",
    }),
  ];
}

export function blogSeoHead() {
  return buildPageHead({
    title: blogSeo.title,
    description: blogSeo.description,
    path: "/blog",
    keywords: ["blog marketing", "guias google ads", "growth marketing", "insights"],
  });
}

export function blogSchemas(): JsonLdObject[] {
  return [webPageSchema({ title: blogSeo.title, description: blogSeo.description, path: "/blog" })];
}

export function blogCategorySeoHead(category: BlogCategory) {
  const meta = blogCats.find((c) => c.id === category)!;
  return buildPageHead({
    title: `${meta.label} — Blog Raise One`,
    description: meta.description,
    path: `/blog/categoria/${category}`,
    keywords: [meta.label, "blog", "growth", "marketing"],
  });
}

export function blogCategorySchemas(category: BlogCategory): JsonLdObject[] {
  const meta = blogCats.find((c) => c.id === category)!;
  return [
    webPageSchema({
      title: `${meta.label} — Blog Raise One`,
      description: meta.description,
      path: `/blog/categoria/${category}`,
    }),
  ];
}

export function blogArticleSeoHead(slug: string) {
  const article = getBlogArticle(slug)!;
  const catLabel = blogCats.find((c) => c.id === article.category)?.label;
  return buildPageHead({
    title: article.seo.title,
    description: article.seo.description,
    path: `/blog/${slug}`,
    ogType: "article",
    keywords: [article.category, article.type, catLabel ?? ""],
    article: {
      publishedTime: article.publishedAt,
      author: article.author,
      section: catLabel,
      tags: [article.type, catLabel ?? ""].filter(Boolean),
    },
  });
}

export function blogArticleSchemas(slug: string): JsonLdObject[] {
  const article = getBlogArticle(slug)!;
  const catLabel = blogCats.find((c) => c.id === article.category)?.label;
  return [
    articleSchema({
      title: article.title,
      description: article.seo.description,
      path: `/blog/${slug}`,
      publishedTime: article.publishedAt,
      author: article.author,
      section: catLabel,
      keywords: [article.category, article.type],
    }),
  ];
}

export function segmentSeoHead(input: { title: string; description: string; slug: string }) {
  return buildPageHead({
    title: input.title,
    description: input.description,
    path: `/${input.slug}`,
    keywords: [input.slug.replace(/-/g, " "), "marketing digital", "google ads", "captação de clientes"],
  });
}

export function segmentSchemas(input: { title: string; description: string; slug: string }): JsonLdObject[] {
  return [
    webPageSchema({ title: input.title, description: input.description, path: `/${input.slug}` }),
    serviceSchema({
      name: input.title,
      description: input.description,
      path: `/${input.slug}`,
      category: "Marketing Digital",
    }),
  ];
}

export type { BlogCategory } from "@/lib/blog/content";
export { getArticlesByCategory, blogCategories } from "@/lib/blog/content";
