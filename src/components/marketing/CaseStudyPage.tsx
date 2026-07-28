import {
  SectionDescription,
  SectionEyebrow,
  SectionShell,
  SectionTitle,
} from "@/components/home/shared/SectionShell";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { NextSteps } from "@/components/marketing/shared/NextSteps";
import { PageCTA } from "@/components/marketing/shared/PageCTA";
import { caseSchemas } from "@/lib/seo/pages";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { casesNextSteps, type CaseStudy } from "@/lib/cases/content";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

interface CaseStudyPageProps {
  caseStudy: CaseStudy;
}

export function CaseStudyPage({ caseStudy }: CaseStudyPageProps) {
  return (
    <MarketingLayout schemas={caseSchemas(caseStudy.slug)}>
      {/* Hero do case */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-40",
            caseStudy.gradient,
          )}
        />
        <div className="absolute inset-0 grid-bg opacity-20" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Cases", path: "/cases" },
              { name: caseStudy.name, path: `/cases/${caseStudy.slug}` },
            ]}
          />

          <span className="mt-6 inline-flex rounded-full border border-brand/30 bg-brand-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            {caseStudy.tag}
          </span>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {caseStudy.name}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">{caseStudy.client}</p>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {caseStudy.summary}
          </p>

          {/* Métricas */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {caseStudy.results.map((result) => (
              <div
                key={result.label}
                className="rounded-xl border border-border/60 bg-background/60 px-4 py-4 backdrop-blur-sm"
              >
                <p className="text-2xl font-bold text-brand sm:text-3xl">{result.metric}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {result.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Desafio & Solução */}
      <SectionShell className="border-b border-border/60 py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionEyebrow>Desafio</SectionEyebrow>
            <SectionTitle>O problema</SectionTitle>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {caseStudy.challenge}
            </p>
          </div>
          <div>
            <SectionEyebrow>Solução</SectionEyebrow>
            <SectionTitle>O que fizemos</SectionTitle>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {caseStudy.solution}
            </p>
          </div>
        </div>
      </SectionShell>

      {/* Serviços & Timeline */}
      <SectionShell className="border-b border-border/60 py-16 lg:py-20">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <SectionEyebrow>Escopo</SectionEyebrow>
            <SectionTitle className="text-2xl">Serviços entregues</SectionTitle>
            <ul className="mt-4 flex flex-wrap gap-2">
              {caseStudy.services.map((service) => (
                <li
                  key={service}
                  className="rounded-full border border-border bg-surface/40 px-3 py-1.5 text-sm text-muted-foreground"
                >
                  {service}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionEyebrow>Prazo</SectionEyebrow>
            <SectionTitle className="text-2xl">Timeline</SectionTitle>
            <p className="mt-4 text-3xl font-bold text-brand">{caseStudy.timeline}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Do diagnóstico aos primeiros resultados mensuráveis.
            </p>
          </div>
        </div>
      </SectionShell>

      {/* Quote */}
      {caseStudy.quote && (
        <SectionShell className="border-b border-border/60 py-16 lg:py-20">
          <blockquote className="mx-auto max-w-3xl text-center">
            <p className="text-xl font-medium leading-relaxed text-foreground sm:text-2xl">
              "{caseStudy.quote.text}"
            </p>
            <footer className="mt-4 text-sm text-muted-foreground">
              — {caseStudy.quote.author}
            </footer>
          </blockquote>
        </SectionShell>
      )}

      {/* CTA interno */}
      <SectionShell className="border-b border-border/60 py-16 lg:py-20">
        <div className="flex flex-col items-center gap-6 text-center">
          <SectionTitle>Quer resultados similares?</SectionTitle>
          <SectionDescription className="mx-auto max-w-xl">
            Cada projeto começa com um diagnóstico. Descubra suas oportunidades e veja como
            replicamos esses resultados no seu negócio.
          </SectionDescription>
          <div className="flex flex-wrap justify-center gap-3">
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

      <NextSteps steps={casesNextSteps} title="Explore mais" />

      <PageCTA
        title={`Vamos construir o próximo case como ${caseStudy.name}?`}
        description="Agende uma conversa estratégica. Sem compromisso."
        whatsappMessage={`Olá! Vi o case ${caseStudy.name} e gostaria de conversar sobre um projeto similar.`}
      />
    </MarketingLayout>
  );
}
