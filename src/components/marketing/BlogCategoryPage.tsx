import { useState } from "react";
import {
  SectionDescription,
  SectionEyebrow,
  SectionShell,
  SectionTitle,
} from "@/components/home/shared/SectionShell";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { NextSteps } from "@/components/marketing/shared/NextSteps";
import { PageCTA } from "@/components/marketing/shared/PageCTA";
import { PageHero } from "@/components/marketing/shared/PageHero";
import {
  blogCategories,
  blogNextSteps,
  blogTypeLabels,
  getArticlesByCategory,
  type BlogCategory,
} from "@/lib/blog/content";
import { blogCategorySchemas } from "@/lib/seo/pages";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, GitCompare, Newspaper } from "lucide-react";
import type { BlogType } from "@/lib/blog/content";

const typeIcons: Record<BlogType, typeof Newspaper> = {
  artigo: Newspaper,
  guia: BookOpen,
  comparativo: GitCompare,
};

interface BlogCategoryPageProps {
  category: BlogCategory;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogCategoryPage({ category }: BlogCategoryPageProps) {
  const meta = blogCategories.find((c) => c.id === category)!;
  const articles = getArticlesByCategory(category);

  return (
    <MarketingLayout schemas={blogCategorySchemas(category)}>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
              { name: meta.label, path: `/blog/categoria/${category}` },
            ]}
          />
        }
        eyebrow="Blog"
        title={meta.label}
        description={meta.description}
        primaryCta={{ label: "Ver todo o blog", href: "/blog" }}
        secondaryCta={{ label: "Fazer diagnóstico", href: "/diagnostico" }}
      />

      <SectionShell className="border-b border-border/60 py-16 lg:py-20">
        <div className="mb-8 flex flex-wrap gap-2">
          {blogCategories
            .filter((c) => c.id !== "all")
            .map((cat) => (
              <Link
                key={cat.id}
                to="/blog/categoria/$category"
                params={{ category: cat.id as BlogCategory }}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                  category === cat.id
                    ? "border-brand bg-brand text-primary-foreground shadow-brand"
                    : "border-border bg-surface/40 text-muted-foreground hover:border-brand/30 hover:text-foreground",
                )}
              >
                {cat.label}
              </Link>
            ))}
        </div>

        <div className="space-y-4">
          {articles.map((article) => {
            const TypeIcon = typeIcons[article.type];
            return (
              <Link
                key={article.slug}
                to="/blog/$slug"
                params={{ slug: article.slug }}
                className="group grid gap-4 rounded-[1.25rem] border border-border bg-surface/30 p-5 transition-all hover:border-brand/25 hover:bg-surface/50 sm:grid-cols-[1fr_auto]"
              >
                <div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-brand">
                    <TypeIcon className="h-3 w-3" />
                    {blogTypeLabels[article.type]}
                  </span>
                  <h2 className="mt-2 text-lg font-semibold tracking-tight group-hover:text-brand">
                    {article.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>
                <div className="flex flex-col items-start gap-1 sm:items-end sm:text-right">
                  <span className="text-xs text-muted-foreground">{article.readTime}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(article.publishedAt)}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {articles.length === 0 && (
          <p className="text-center text-muted-foreground">Nenhum artigo nesta categoria.</p>
        )}
      </SectionShell>

      <NextSteps steps={blogNextSteps} />

      <PageCTA
        title="Quer aplicar essas estratégias?"
        description="Faça o diagnóstico gratuito e descubra oportunidades no seu mercado."
        whatsappMessage="Olá! Li conteúdos no blog da Raise One e gostaria de conversar sobre growth."
      />
    </MarketingLayout>
  );
}
