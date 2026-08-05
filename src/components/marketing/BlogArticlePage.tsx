import { ArticleBody } from "@/components/marketing/blog/ArticleBody";
import {
  SectionShell,
  SectionTitle,
} from "@/components/home/shared/SectionShell";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { NextSteps } from "@/components/marketing/shared/NextSteps";
import { PageCTA } from "@/components/marketing/shared/PageCTA";
import { blogArticleSchemas } from "@/lib/seo/pages";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import {
  blogCategories,
  blogNextSteps,
  blogTypeLabels,
  getRelatedArticles,
  type BlogArticle,
} from "@/lib/blog/content";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock } from "lucide-react";

interface BlogArticlePageProps {
  article: BlogArticle;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogArticlePage({ article }: BlogArticlePageProps) {
  const related = getRelatedArticles(article.relatedSlugs);
  const categoryLabel =
    blogCategories.find((c) => c.id === article.category)?.label ?? article.category;

  return (
    <MarketingLayout schemas={blogArticleSchemas(article.slug)}>
      <article itemScope itemType="https://schema.org/Article">
        {/* Header */}
        <header className="border-b border-border/60">
          <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24">
            <Breadcrumbs
              items={[
                { name: "Home", path: "/" },
                { name: "Blog", path: "/blog" },
                ...(categoryLabel
                  ? [{ name: categoryLabel, path: `/blog/categoria/${article.category}` }]
                  : []),
                { name: article.title, path: `/blog/${article.slug}` },
              ]}
            />

            <div className="mt-2 flex flex-wrap items-center gap-2 sm:mt-0">
              <span className="rounded-full border border-border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {categoryLabel}
              </span>
              <span className="rounded-full border border-brand/30 bg-brand-soft px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
                {blogTypeLabels[article.type]}
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl" itemProp="headline">
              {article.title}
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              {article.excerpt}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>{article.author}</span>
              <span>·</span>
              <span>{formatDate(article.publishedAt)}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {article.readTime} de leitura
              </span>
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
          <ArticleBody sections={article.sections} />
        </div>

        {/* Inline CTA */}
        <SectionShell className="border-y border-border/60 py-12">
          <div className="mx-auto max-w-3xl rounded-[1.35rem] border border-brand/25 bg-brand-soft/30 p-6 text-center sm:p-8">
            <SectionTitle className="text-2xl sm:text-3xl">
              Quer aplicar isso no seu negócio?
            </SectionTitle>
            <p className="mt-3 text-muted-foreground">
              Faça o diagnóstico gratuito e descubra suas oportunidades de crescimento.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/diagnostico"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-brand"
              >
                Fazer diagnóstico gratuito
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/programa-de-crescimento"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-6 py-3 text-sm font-semibold"
              >
                Programa de Crescimento
              </Link>
            </div>
          </div>
        </SectionShell>

        {/* Related */}
        {related.length > 0 && (
          <SectionShell className="py-16 lg:py-20">
            <h2 className="text-xl font-bold tracking-tight">Conteúdos relacionados</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {related.map((relatedArticle) => (
                <Link
                  key={relatedArticle.slug}
                  to="/blog/$slug"
                  params={{ slug: relatedArticle.slug }}
                  className="group rounded-[1.25rem] border border-border bg-surface/30 p-4 transition-all hover:border-brand/25"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-brand">
                    {blogTypeLabels[relatedArticle.type]}
                  </span>
                  <h3 className="mt-2 text-sm font-semibold leading-snug group-hover:text-brand">
                    {relatedArticle.title}
                  </h3>
                </Link>
              ))}
            </div>
          </SectionShell>
        )}
      </article>

      <NextSteps steps={blogNextSteps} />

      <PageCTA
        title="Transforme conhecimento em crescimento"
        description="Agende uma conversa estratégica com a Raise One."
        whatsappMessage={`Olá! Li o artigo "${article.title}" no blog e gostaria de conversar sobre meu negócio.`}
      />
    </MarketingLayout>
  );
}
