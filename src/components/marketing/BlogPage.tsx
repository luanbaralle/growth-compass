import { useState } from "react";
import {
  SectionDescription,
  SectionEyebrow,
  SectionShell,
  SectionTitle,
} from "@/components/home/shared/SectionShell";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { NextSteps } from "@/components/marketing/shared/NextSteps";
import { PageCTA } from "@/components/marketing/shared/PageCTA";
import { PageHero } from "@/components/marketing/shared/PageHero";
import { blogSchemas } from "@/lib/seo/pages";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import {
  blogArticles,
  blogCategories,
  blogNextSteps,
  blogTypeLabels,
  getArticlesByCategory,
  type BlogCategory,
  type BlogType,
} from "@/lib/blog/content";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, GitCompare, Newspaper } from "lucide-react";

const typeIcons: Record<BlogType, typeof Newspaper> = {
  artigo: Newspaper,
  guia: BookOpen,
  comparativo: GitCompare,
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogPage() {
  const [category, setCategory] = useState<BlogCategory | "all">("all");
  const [typeFilter, setTypeFilter] = useState<BlogType | "all">("all");

  const filtered = getArticlesByCategory(category).filter(
    (a) => typeFilter === "all" || a.type === typeFilter,
  );

  const guias = blogArticles.filter((a) => a.type === "guia").slice(0, 3);
  const comparativos = blogArticles.filter((a) => a.type === "comparativo");

  return (
    <MarketingLayout schemas={blogSchemas()}>
      <div className="mx-auto max-w-7xl px-5 pt-6 sm:px-8">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]}
        />
      </div>
      <PageHero
        eyebrow="Conteúdo"
        title="Insights de growth, marketing e tecnologia"
        description="Artigos, guias e comparativos práticos — para empresas que querem crescer com estratégia, não com achismo."
        primaryCta={{ label: "Fazer diagnóstico gratuito", href: "/diagnostico" }}
        secondaryCta={{ label: "Programa de Crescimento", href: "/programa-de-crescimento" }}
      />

      {/* Destaques: Guias */}
      <SectionShell className="border-b border-border/60 py-16 lg:py-20">
        <div className="max-w-2xl">
          <SectionEyebrow>Guias</SectionEyebrow>
          <SectionTitle>Aprenda passo a passo</SectionTitle>
          <SectionDescription>
            Conteúdo aprofundado para implementar estratégias de aquisição e crescimento.
          </SectionDescription>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {guias.map((article) => (
            <Link
              key={article.slug}
              to="/blog/$slug"
              params={{ slug: article.slug }}
              className="group flex flex-col rounded-[1.35rem] border border-border bg-surface/40 p-5 transition-all hover:-translate-y-0.5 hover:border-brand/25"
            >
              <span className="inline-flex w-fit rounded-full border border-brand/20 bg-brand-soft px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
                Guia
              </span>
              <h3 className="mt-3 flex-1 font-semibold tracking-tight group-hover:text-brand">
                {article.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                {article.excerpt}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                Ler guia
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </SectionShell>

      {/* Destaques: Comparativos */}
      {comparativos.length > 0 && (
        <SectionShell className="border-b border-border/60 py-16 lg:py-20">
          <div className="max-w-2xl">
            <SectionEyebrow>Comparativos</SectionEyebrow>
            <SectionTitle>Decisões mais claras</SectionTitle>
            <SectionDescription>
              Compare abordagens, canais e estratégias para tomar decisões informadas.
            </SectionDescription>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {comparativos.map((article) => (
              <Link
                key={article.slug}
                to="/blog/$slug"
                params={{ slug: article.slug }}
                className="group flex flex-col rounded-[1.35rem] border border-border bg-surface/40 p-6 transition-all hover:-translate-y-0.5 hover:border-brand/25"
              >
                <span className="inline-flex w-fit rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-300">
                  Comparativo
                </span>
                <h3 className="mt-3 flex-1 text-lg font-semibold tracking-tight group-hover:text-brand">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {article.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </SectionShell>
      )}

      {/* Catálogo com filtros */}
      <SectionShell className="border-b border-border/60 py-16 lg:py-20">
        <div className="max-w-2xl">
          <SectionEyebrow>Biblioteca</SectionEyebrow>
          <SectionTitle>Todos os conteúdos</SectionTitle>
        </div>

        {/* Filtro categorias */}
        <div className="mt-8 flex flex-wrap gap-2">
          {blogCategories.map((cat) =>
            cat.id === "all" ? (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory("all")}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                  category === "all"
                    ? "border-brand bg-brand text-primary-foreground shadow-brand"
                    : "border-border bg-surface/40 text-muted-foreground hover:border-brand/30 hover:text-foreground",
                )}
              >
                {cat.label}
              </button>
            ) : (
              <Link
                key={cat.id}
                to="/blog/categoria/$category"
                params={{ category: cat.id }}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                  category === cat.id
                    ? "border-brand bg-brand text-primary-foreground shadow-brand"
                    : "border-border bg-surface/40 text-muted-foreground hover:border-brand/30 hover:text-foreground",
                )}
              >
                {cat.label}
              </Link>
            ),
          )}
        </div>

        {/* Filtro tipo */}
        <div className="mt-4 flex flex-wrap gap-2">
          {(["all", "artigo", "guia", "comparativo"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setTypeFilter(type)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                typeFilter === type
                  ? "border-foreground/30 bg-foreground/10 text-foreground"
                  : "border-border/60 text-muted-foreground hover:text-foreground",
              )}
            >
              {type === "all" ? "Todos os tipos" : blogTypeLabels[type]}
            </button>
          ))}
        </div>

        {/* Lista */}
        <div className="mt-10 space-y-4">
          {filtered.map((article) => {
            const TypeIcon = typeIcons[article.type];
            const catLabel =
              blogCategories.find((c) => c.id === article.category)?.label ?? article.category;

            return (
              <Link
                key={article.slug}
                to="/blog/$slug"
                params={{ slug: article.slug }}
                className="group grid gap-4 rounded-[1.25rem] border border-border bg-surface/30 p-5 transition-all hover:border-brand/25 hover:bg-surface/50 sm:grid-cols-[1fr_auto]"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {catLabel}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-brand">
                      <TypeIcon className="h-3 w-3" />
                      {blogTypeLabels[article.type]}
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold tracking-tight group-hover:text-brand">
                    {article.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>
                <div className="flex flex-col items-start justify-between gap-2 sm:items-end sm:text-right">
                  <span className="text-xs text-muted-foreground">{article.readTime}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(article.publishedAt)}
                  </span>
                  <ArrowRight className="hidden h-4 w-4 text-brand sm:block" />
                </div>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="mt-10 text-center text-muted-foreground">
            Nenhum conteúdo nesta categoria ainda.
          </p>
        )}
      </SectionShell>

      <NextSteps steps={blogNextSteps} title="Aplique o que aprendeu" />

      <PageCTA
        title="Conteúdo é o começo. Crescimento é o objetivo."
        description="Agende uma conversa e transforme insights em resultados concretos."
        whatsappMessage="Olá! Li conteúdos no blog da Raise One e gostaria de conversar sobre crescimento para meu negócio."
      />
    </MarketingLayout>
  );
}
