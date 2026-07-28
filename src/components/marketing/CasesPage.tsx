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
import { casesSchemas } from "@/lib/seo/pages";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import {
  caseCategories,
  caseStudies,
  casesNextSteps,
  type CaseCategory,
} from "@/lib/cases/content";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function CasesPage() {
  const [filter, setFilter] = useState<CaseCategory | "all">("all");

  const filtered =
    filter === "all"
      ? caseStudies
      : caseStudies.filter((c) => c.categories.includes(filter));

  return (
    <MarketingLayout schemas={casesSchemas()}>
      <div className="mx-auto max-w-7xl px-5 pt-6 sm:px-8">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Cases", path: "/cases" },
          ]}
        />
      </div>
      <PageHero
        eyebrow="Portfólio"
        title="Projetos que geram resultados reais"
        description="Cases de marketing, tecnologia e crescimento — com métricas, desafios reais e soluções que fecham contrato."
        primaryCta={{ label: "Programa de Crescimento", href: "/programa-de-crescimento" }}
        secondaryCta={{ label: "Fazer diagnóstico", href: "/diagnostico" }}
      />

      <SectionShell className="border-b border-border/60 py-16 lg:py-20">
        {/* Filtros */}
        <div className="flex flex-wrap gap-2">
          {caseCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilter(cat.id)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                filter === cat.id
                  ? "border-brand bg-brand text-primary-foreground shadow-brand"
                  : "border-border bg-surface/40 text-muted-foreground hover:border-brand/30 hover:text-foreground",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid de cases */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {filtered.map((caseStudy) => (
            <Link
              key={caseStudy.slug}
              to="/cases/$slug"
              params={{ slug: caseStudy.slug }}
              className="group relative overflow-hidden rounded-[1.35rem] border border-border bg-surface/30 transition-transform hover:-translate-y-1"
            >
              <div
                className={cn(
                  "relative aspect-[16/10] overflow-hidden bg-gradient-to-br",
                  caseStudy.gradient,
                )}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,146,60,0.18),transparent_45%)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute left-4 top-4">
                  <span className="rounded-full bg-brand/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand">
                    {caseStudy.tag}
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="text-2xl font-bold tracking-tight">{caseStudy.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/72">
                    {caseStudy.summary}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand opacity-0 transition-opacity group-hover:opacity-100">
                    Ver case completo
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>

              {/* Métricas preview */}
              <div className="grid grid-cols-2 gap-px border-t border-border bg-border sm:grid-cols-4">
                {caseStudy.results.slice(0, 4).map((result) => (
                  <div key={result.label} className="bg-surface/40 px-3 py-3 text-center">
                    <p className="text-lg font-bold text-brand">{result.metric}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {result.label}
                    </p>
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-10 text-center text-muted-foreground">
            Nenhum case nesta categoria ainda.
          </p>
        )}
      </SectionShell>

      <SectionShell className="border-b border-border/60 py-16 lg:py-20">
        <div className="max-w-2xl">
          <SectionEyebrow>Resultados</SectionEyebrow>
          <SectionTitle>Cases fecham contrato</SectionTitle>
          <SectionDescription>
            Cada case mostra desafio real, solução integrada e métricas concretas — exatamente o que
            prospects precisam ver antes de decidir.
          </SectionDescription>
        </div>
      </SectionShell>

      <NextSteps steps={casesNextSteps} />

      <PageCTA
        title="Quer resultados como esses?"
        description="Agende uma conversa. Analisamos seu mercado e desenhamos o caminho."
        whatsappMessage="Olá! Vi os cases da Raise One e gostaria de conversar sobre um projeto de crescimento."
      />
    </MarketingLayout>
  );
}
