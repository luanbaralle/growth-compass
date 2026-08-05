import type { NextStepLink } from "@/components/marketing/shared/NextSteps";
import { homeBlogSection } from "@/lib/home/content";
import { blogCategories, blogSeo } from "@/lib/blog/categories";
import { blogArticles } from "@/lib/blog/articles";
import { getSegmentBlogSlugs } from "@/lib/blog/segment-articles";
import type {
  BlogArticle,
  BlogCategory,
  BlogCategoryMeta,
  BlogFaqItem,
  BlogPillar,
  BlogRelatedLink,
  BlogSection,
  BlogType,
} from "@/lib/blog/types";

export type {
  BlogArticle,
  BlogCategory,
  BlogCategoryMeta,
  BlogFaqItem,
  BlogPillar,
  BlogRelatedLink,
  BlogSection,
  BlogType,
};

export { blogCategories, blogSeo };
export { blogArticles };

export const blogTypeLabels: Record<BlogType, string> = {
  artigo: "Artigo",
  guia: "Guia",
  comparativo: "Comparativo",
};

export function getBlogArticle(slug: string): BlogArticle | undefined {
  return blogArticles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: BlogCategory | "all"): BlogArticle[] {
  if (category === "all") return blogArticles;
  return blogArticles.filter((a) => a.category === category);
}

export function getCategoryMeta(id: BlogCategory | "all"): BlogCategoryMeta {
  return blogCategories.find((c) => c.id === id) ?? blogCategories[0];
}

export function getRelatedArticles(slugs: string[]): BlogArticle[] {
  return slugs
    .map((slug) => getBlogArticle(slug))
    .filter((a): a is BlogArticle => a != null);
}

export function getArticlesForSegment(segmentSlug: string): BlogArticle[] {
  return getSegmentBlogSlugs(segmentSlug)
    .map((slug) => getBlogArticle(slug))
    .filter((a): a is BlogArticle => a != null);
}

export function getArticlesByPillar(pillar: BlogPillar): BlogArticle[] {
  return blogArticles.filter((a) => a.pillar === pillar);
}

function articleSortDate(article: BlogArticle): number {
  return new Date(article.modifiedAt ?? article.publishedAt).getTime();
}

export function getHomeFeaturedArticles(limit = homeBlogSection.carouselLimit): BlogArticle[] {
  const curated = homeBlogSection.featuredSlugs
    .map((slug) => getBlogArticle(slug))
    .filter((a): a is BlogArticle => a != null);

  if (curated.length >= limit) {
    return curated.slice(0, limit);
  }

  const curatedSlugs = new Set(curated.map((a) => a.slug));
  const rest = [...blogArticles]
    .filter((a) => !curatedSlugs.has(a.slug))
    .sort((a, b) => articleSortDate(b) - articleSortDate(a));

  return [...curated, ...rest].slice(0, limit);
}

export const blogNextSteps: NextStepLink[] = [
  {
    label: "Fazer diagnóstico",
    description: "Aplique o que aprendeu — analise seu mercado gratuitamente.",
    href: "/diagnostico",
    internal: true,
  },
  {
    label: "Programa de Crescimento",
    description: "Transforme insights em crescimento estruturado.",
    href: "/programa-de-crescimento",
    internal: true,
  },
  {
    label: "Ver cases",
    description: "Resultados reais de empresas que aplicaram essas estratégias.",
    href: "/cases",
    internal: true,
  },
];
