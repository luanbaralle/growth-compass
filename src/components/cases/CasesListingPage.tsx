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
import { getAllCases } from "@/data/cases";
import { casesNextSteps, caseCategories } from "@/lib/cases/content";
import { casesSchemas } from "@/lib/seo/pages";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { CaseImage } from "./CaseImage";
import nobreLogo from "@/assets/case-nobre/logo.png";
import heroLpDesktop from "@/assets/case-unip/hero-lp-desktop.png";
import studio21HeroLp from "@/assets/case-studio21/hero-lp.png";
import type { Case } from "@/types/case";

function getCaseCoverImage(caseItem: Case): string {
  if (caseItem.slug === "unip") return heroLpDesktop;
  if (caseItem.slug === "studio21") return studio21HeroLp;
  if (caseItem.slug === "nobre") return nobreLogo;
  return caseItem.coverImage;
}

export function CasesListingPage() {
  const allCases = useMemo(() => getAllCases(), []);
  const categories = useMemo(
    () => ["all", ...new Set(allCases.map((c) => c.category))],
    [allCases],
  );

  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all" ? allCases : allCases.filter((c) => c.category === filter);

  return (
    <MarketingLayout schemas={casesSchemas()}>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Cases", path: "/cases" },
            ]}
          />
        }
        eyebrow="Portfólio"
        title="Projetos que geram resultados reais"
        description="Cases reais de marketing, tecnologia e crescimento — do imobiliário à educação e serviços."
        primaryCta={{ label: "Programa de Crescimento", href: "/programa-de-crescimento" }}
        secondaryCta={{ label: "Fazer diagnóstico", href: "/diagnostico" }}
      />

      <SectionShell className="border-b border-border/60 py-16 lg:py-20">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const label =
              cat === "all"
                ? "Todos"
                : caseCategories.find((c) => c.label === cat)?.label ?? cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                  filter === cat
                    ? "border-brand bg-brand text-primary-foreground shadow-brand"
                    : "border-border bg-surface/40 text-muted-foreground hover:border-brand/30 hover:text-foreground",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((caseItem) => (
            <Link
              key={caseItem.slug}
              to="/cases/$slug"
              params={{ slug: caseItem.slug }}
              className="group overflow-hidden rounded-[1.35rem] border border-border bg-surface/30 transition-transform hover:-translate-y-1"
            >
              <CaseImage
                src={getCaseCoverImage(caseItem)}
                alt={caseItem.title}
                className="aspect-[16/10] w-full object-cover object-left-top"
              />

              <div className="p-5">
                <span className="rounded-full bg-brand/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand">
                  {caseItem.category}
                </span>
                <h3 className="mt-3 text-xl font-bold tracking-tight">{caseItem.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {caseItem.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand opacity-0 transition-opacity group-hover:opacity-100">
                  Ver case completo
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>

              <div className="grid grid-cols-2 gap-px border-t border-border bg-border sm:grid-cols-3">
                {caseItem.metrics.slice(0, 3).map((metric) => (
                  <div key={metric.label} className="bg-surface/40 px-3 py-3 text-center">
                    <p className="text-lg font-bold text-brand">{metric.value}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {metric.label}
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
            TODO: Texto introdutório da listagem. Cada case é gerado dinamicamente a partir do
            objeto de dados correspondente.
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
