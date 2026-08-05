import { useState } from "react";
import { BlogArticleCard } from "@/components/marketing/blog/BlogArticleCard";
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
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
            ]}
          />
        }
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
            <BlogArticleCard key={article.slug} article={article} variant="grid" />
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
              <BlogArticleCard key={article.slug} article={article} variant="comparativo" />
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
            const catLabel =
              blogCategories.find((c) => c.id === article.category)?.label ?? article.category;

            return (
              <div key={article.slug} className="relative">
                <div className="mb-2 flex flex-wrap items-center gap-2 px-1 sm:hidden">
                  <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {catLabel}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-brand">
                    {blogTypeLabels[article.type]}
                  </span>
                </div>
                <BlogArticleCard article={article} variant="list" />
              </div>
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
