import {
  SectionDescription,
  SectionEyebrow,
  SectionShell,
  SectionTitle,
} from "@/components/home/shared/SectionShell";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { NextSteps } from "@/components/marketing/shared/NextSteps";
import { PageCTA } from "@/components/marketing/shared/PageCTA";
import { PageFAQ } from "@/components/marketing/shared/PageFAQ";
import { PageHero } from "@/components/marketing/shared/PageHero";
import { solutionSchemas } from "@/lib/seo/pages";
import type { SolutionPageContent } from "@/lib/solutions/content";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ArrowRight, XCircle } from "lucide-react";

interface SolutionPageProps {
  content: SolutionPageContent;
}

export function SolutionPage({ content }: SolutionPageProps) {
  return (
    <MarketingLayout schemas={solutionSchemas(content.slug)}>
      <div className="mx-auto max-w-7xl px-5 pt-6 sm:px-8">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Soluções", path: "/solucoes" },
            { name: content.hero.title, path: `/solucoes/${content.slug}` },
          ]}
        />
      </div>
      <PageHero
        eyebrow={content.hero.eyebrow}
        title={content.hero.title}
        description={content.hero.description}
        badge={content.hero.benefitFocus}
        primaryCta={{
          label: "Agendar conversa",
          href: "/#diagnostico",
        }}
        secondaryCta={{
          label: "Ver Programa de Crescimento",
          href: "/programa-de-crescimento",
        }}
      />

      {/* Problema */}
      <SectionShell className="border-b border-border/60 py-20 lg:py-28">
        <div className="max-w-2xl">
          <SectionEyebrow>Desafio</SectionEyebrow>
          <SectionTitle>{content.problem.title}</SectionTitle>
          <SectionDescription>{content.problem.description}</SectionDescription>
        </div>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {content.problem.points.map((point) => (
            <li
              key={point}
              className="flex items-start gap-3 rounded-xl border border-border bg-surface/30 px-4 py-3.5"
            >
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand/70" />
              <span className="text-sm leading-relaxed text-muted-foreground">{point}</span>
            </li>
          ))}
        </ul>
      </SectionShell>

      {/* Como fazemos */}
      <SectionShell className="border-b border-border/60 py-20 lg:py-28">
        <div className="max-w-2xl">
          <SectionEyebrow>Abordagem</SectionEyebrow>
          <SectionTitle>{content.approach.title}</SectionTitle>
          <SectionDescription>{content.approach.description}</SectionDescription>
        </div>
        <div className="mt-10 space-y-3">
          {content.approach.items.map((item, index) => (
            <article
              key={item.title}
              className="grid gap-4 rounded-xl border border-border bg-surface/30 px-5 py-4 sm:grid-cols-[48px_1fr]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-sm font-bold text-brand">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </SectionShell>

      {/* Processo */}
      <SectionShell className="border-b border-border/60 py-20 lg:py-28">
        <div className="max-w-2xl">
          <SectionEyebrow>Processo</SectionEyebrow>
          <SectionTitle>{content.process.title}</SectionTitle>
          <SectionDescription>
            Um processo documentado — transparente e replicável.
          </SectionDescription>
        </div>
        <div className="mt-12 grid gap-4 lg:grid-cols-5">
          {content.process.steps.map((step, index) => (
            <div key={step.number} className="relative">
              <article className="h-full rounded-[1.35rem] border border-border bg-surface/30 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">
                  {step.number}
                </p>
                <h3 className="mt-3 text-lg font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </article>
              {index < content.process.steps.length - 1 && (
                <div className="absolute -right-2 top-1/2 hidden h-px w-4 bg-brand/30 lg:block" />
              )}
            </div>
          ))}
        </div>
      </SectionShell>

      {/* Cases */}
      <SectionShell className="border-b border-border/60 py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <SectionEyebrow>Resultados</SectionEyebrow>
            <SectionTitle>{content.cases.title}</SectionTitle>
          </div>
          <a
            href="/#casos"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand/80"
          >
            Ver todos os cases
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.cases.items.map((caseItem) => (
            <article
              key={caseItem.name}
              className="rounded-[1.35rem] border border-border bg-surface/40 p-6"
            >
              <span className="inline-flex rounded-full border border-brand/20 bg-brand-soft px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
                {caseItem.tag}
              </span>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">{caseItem.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {caseItem.description}
              </p>
            </article>
          ))}
        </div>
      </SectionShell>

      <PageFAQ items={content.faq} />

      <NextSteps steps={content.nextSteps} />

      <PageCTA
        title={content.cta.title}
        description={content.cta.description}
        whatsappMessage={content.cta.whatsappMessage}
      />
    </MarketingLayout>
  );
}
