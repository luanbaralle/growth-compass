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
import { programaSchemas } from "@/lib/seo/pages";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import {
  marketProblem,
  programaCta,
  programaDeliveries,
  programaHero,
  programaIntro,
  programaMethod,
  programaMonths,
  programaNextSteps,
  programaFaq,
  vendorProblem,
} from "@/lib/programa/content";
import { CheckCircle2, XCircle } from "lucide-react";

export function ProgramaDeCrescimentoPage() {
  return (
    <MarketingLayout schemas={programaSchemas()}>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Programa de Crescimento", path: "/programa-de-crescimento" },
            ]}
          />
        }
        eyebrow={programaHero.eyebrow}
        title={programaHero.title}
        description={programaHero.description}
        badge={programaHero.badge}
        primaryCta={{
          label: "Agendar conversa estratégica",
          href: "/#diagnostico",
        }}
        secondaryCta={{
          label: "Explorar soluções",
          href: "/solucoes",
        }}
      />

      {/* Problema do mercado */}
      <SectionShell className="border-b border-border/60 py-20 lg:py-28">
        <div className="max-w-2xl">
          <SectionEyebrow>O mercado</SectionEyebrow>
          <SectionTitle>{marketProblem.title}</SectionTitle>
          <SectionDescription>{marketProblem.description}</SectionDescription>
        </div>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {marketProblem.points.map((point) => (
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

      {/* Por que vários fornecedores */}
      <SectionShell className="border-b border-border/60 py-20 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionEyebrow>O problema</SectionEyebrow>
            <SectionTitle>{vendorProblem.title}</SectionTitle>
            <SectionDescription>{vendorProblem.description}</SectionDescription>
            <p className="mt-6 text-base font-medium leading-relaxed text-foreground">
              {vendorProblem.conclusion}
            </p>
          </div>
          <div className="space-y-3">
            {vendorProblem.vendors.map((vendor) => (
              <div
                key={vendor.role}
                className="rounded-xl border border-border bg-surface/30 px-5 py-4"
              >
                <p className="font-semibold text-foreground">{vendor.role}</p>
                <p className="mt-1 text-sm text-muted-foreground">{vendor.gap}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>

      {/* Conheça o Programa */}
      <SectionShell className="border-b border-border/60 py-20 lg:py-28">
        <div className="max-w-3xl">
          <SectionEyebrow>O programa</SectionEyebrow>
          <SectionTitle>{programaIntro.title}</SectionTitle>
          <SectionDescription>{programaIntro.description}</SectionDescription>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {programaIntro.pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article
                key={pillar.title}
                className="rounded-[1.35rem] border border-border bg-surface/40 p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand/20 bg-brand-soft text-brand">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {pillar.description}
                </p>
              </article>
            );
          })}
        </div>
      </SectionShell>

      {/* Os 6 meses */}
      <SectionShell className="border-b border-border/60 py-20 lg:py-28">
        <div className="max-w-2xl">
          <SectionEyebrow>Cronograma</SectionEyebrow>
          <SectionTitle>Os 6 meses do programa</SectionTitle>
          <SectionDescription>
            Um roadmap claro — mês a mês — com entregas concretas e marcos de progresso.
          </SectionDescription>
        </div>
        <div className="mt-12 space-y-4">
          {programaMonths.map((month, index) => (
            <article
              key={month.month}
              className="grid gap-6 rounded-[1.35rem] border border-border bg-surface/30 p-6 lg:grid-cols-[140px_1fr_1fr]"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">
                  {month.month}
                </p>
                <p className="mt-2 text-lg font-semibold tracking-tight">{month.title}</p>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{month.description}</p>
              <ul className="space-y-2">
                {month.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                    {item}
                  </li>
                ))}
              </ul>
              {index < programaMonths.length - 1 && (
                <div className="hidden lg:col-span-3 lg:block">
                  <div className="mx-auto h-px w-full max-w-xs bg-brand/20" />
                </div>
              )}
            </article>
          ))}
        </div>
      </SectionShell>

      {/* Entregas */}
      <SectionShell className="border-b border-border/60 py-20 lg:py-28">
        <div className="max-w-2xl">
          <SectionEyebrow>Entregas</SectionEyebrow>
          <SectionTitle>O que está incluso</SectionTitle>
          <SectionDescription>
            Marketing, conteúdo e tecnologia — tudo integrado em um único programa.
          </SectionDescription>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {programaDeliveries.map((delivery) => {
            const Icon = delivery.icon;
            return (
              <article
                key={delivery.title}
                className="rounded-[1.35rem] border border-border bg-surface/40 p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand/20 bg-brand-soft text-brand">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-semibold tracking-tight">{delivery.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {delivery.description}
                </p>
              </article>
            );
          })}
        </div>
      </SectionShell>

      {/* Método */}
      <SectionShell className="border-b border-border/60 py-20 lg:py-28">
        <div className="max-w-2xl">
          <SectionEyebrow>Framework</SectionEyebrow>
          <SectionTitle>{programaMethod.title}</SectionTitle>
          <SectionDescription>{programaMethod.description}</SectionDescription>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {programaMethod.steps.map((step) => (
            <article
              key={step.number}
              className="rounded-[1.35rem] border border-border bg-surface/30 p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">
                {step.number}
              </p>
              <h3 className="mt-3 text-lg font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </SectionShell>

      <PageFAQ
        title="Dúvidas sobre o Programa"
        description="O essencial para quem está avaliando uma parceria de crescimento integrada."
        items={programaFaq}
      />

      <NextSteps steps={programaNextSteps} />

      <PageCTA
        title={programaCta.title}
        description={programaCta.description}
        ctaLabel="Agendar conversa estratégica"
        whatsappMessage={programaCta.whatsappMessage}
      />
    </MarketingLayout>
  );
}
