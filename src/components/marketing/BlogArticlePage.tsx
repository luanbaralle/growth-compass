import { ArticleBody, extractTableOfContents } from "@/components/marketing/blog/ArticleBody";
import { ArticleFAQ } from "@/components/marketing/blog/ArticleFAQ";
import { ArticleRelatedLinks } from "@/components/marketing/blog/ArticleRelatedLinks";
import { ArticleTOC } from "@/components/marketing/blog/ArticleTOC";
import { BlogArticleHero } from "@/components/marketing/blog/BlogArticleHero";
import { SectionShell, SectionTitle } from "@/components/home/shared/SectionShell";
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
import { blogImageAlt } from "@/lib/blog/images";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

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
  const toc = extractTableOfContents(article.sections);
  const showToc = toc.filter((item) => item.level === 2).length >= 4;
  const modifiedLabel =
    article.modifiedAt && article.modifiedAt !== article.publishedAt
      ? formatDate(article.modifiedAt)
      : null;

  return (
    <MarketingLayout schemas={blogArticleSchemas(article.slug)}>
      <article itemScope itemType="https://schema.org/Article">
        <BlogArticleHero
          breadcrumbs={
            <Breadcrumbs
              items={[
                { name: "Home", path: "/" },
                { name: "Blog", path: "/blog" },
                { name: categoryLabel, path: `/blog/categoria/${article.category}` },
                { name: article.title, path: `/blog/${article.slug}` },
              ]}
            />
          }
          categoryLabel={categoryLabel}
          typeLabel={blogTypeLabels[article.type]}
          title={<span itemProp="headline">{article.title}</span>}
          excerpt={article.excerpt}
          author={article.author}
          publishedAt={article.publishedAt}
          publishedLabel={formatDate(article.publishedAt)}
          modifiedLabel={modifiedLabel}
          readTime={article.readTime}
          imageSrc={article.featuredImage}
          imageAlt={blogImageAlt(article.slug)}
        />

        <SectionShell className="py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-3xl">
            {showToc && <ArticleTOC items={toc} />}
            <ArticleBody sections={article.sections} />
            {article.faq && article.faq.length > 0 && <ArticleFAQ items={article.faq} />}
          </div>
        </SectionShell>

        {article.relatedLinks && article.relatedLinks.length > 0 && (
          <SectionShell className="border-y border-border/60 py-12">
            <div className="mx-auto max-w-3xl">
              <ArticleRelatedLinks links={article.relatedLinks} />
            </div>
          </SectionShell>
        )}

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

        {related.length > 0 && (
          <SectionShell className="py-16 lg:py-20">
            <h2 className="text-xl font-bold tracking-tight">Conteúdos relacionados</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {related.map((relatedArticle) => (
                <Link
                  key={relatedArticle.slug}
                  to="/blog/$slug"
                  params={{ slug: relatedArticle.slug }}
                  className="group overflow-hidden rounded-[1.25rem] border border-border bg-surface/30 transition-all hover:border-brand/25"
                >
                  {relatedArticle.featuredImage && (
                    <img
                      src={relatedArticle.featuredImage.replace(/w=\d+&h=\d+/, "w=400&h=225")}
                      alt=""
                      className="aspect-[16/9] w-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="p-4">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-brand">
                      {blogTypeLabels[relatedArticle.type]}
                    </span>
                    <h3 className="mt-2 text-sm font-semibold leading-snug group-hover:text-brand">
                      {relatedArticle.title}
                    </h3>
                  </div>
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
