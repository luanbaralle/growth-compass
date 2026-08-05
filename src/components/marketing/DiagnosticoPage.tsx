import { GuidedDiagnostic } from "@/components/hub/GuidedDiagnostic";
import { DiagnosticMascot } from "@/components/home/shared/DiagnosticMascot";
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
import { diagnosticoSchemas } from "@/lib/seo/pages";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import {
  diagnosticoBenefits,
  diagnosticoCta,
  diagnosticoHero,
  diagnosticoNextSteps,
  exampleAnalysis,
  howItWorks,
} from "@/lib/diagnostico/content";
import { Search } from "lucide-react";

export function DiagnosticoPage() {
  return (
    <MarketingLayout schemas={diagnosticoSchemas()}>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Diagnóstico", path: "/diagnostico" },
            ]}
          />
        }
        eyebrow={diagnosticoHero.eyebrow}
        title={diagnosticoHero.title}
        description={diagnosticoHero.description}
        badge="Gratuito"
        primaryCta={{ label: "Começar análise", href: "#diagnostico-form" }}
        secondaryCta={{ label: "Como funciona", href: "#como-funciona" }}
      />

      {/* Como funciona */}
      <SectionShell id="como-funciona" className="border-b border-border/60 py-20 lg:py-28">
        <div className="max-w-2xl">
          <SectionEyebrow>Processo</SectionEyebrow>
          <SectionTitle>Como funciona</SectionTitle>
          <SectionDescription>
            Quatro passos. Menos de um minuto. Análise personalizada para o seu negócio.
          </SectionDescription>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((step) => (
            <article
              key={step.step}
              className="rounded-[1.35rem] border border-border bg-surface/30 p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">
                {step.step}
              </p>
              <h3 className="mt-3 font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </SectionShell>

      {/* Exemplo */}
      <SectionShell className="border-b border-border/60 py-20 lg:py-28">
        <div className="max-w-2xl">
          <SectionEyebrow>Exemplo</SectionEyebrow>
          <SectionTitle>Veja o que você recebe</SectionTitle>
          <SectionDescription>
            Análise real para {exampleAnalysis.business} em {exampleAnalysis.city}.
          </SectionDescription>
        </div>

        <div className="mt-10 max-w-2xl rounded-[1.5rem] border border-border bg-surface/30 p-6 sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-lg border border-brand/30 bg-brand-soft px-3 py-2 text-sm font-medium text-brand">
            {exampleAnalysis.business} · {exampleAnalysis.city}
          </div>

          <p className="mt-5 text-sm font-medium text-foreground">
            Termos que pessoas na região costumam pesquisar:
          </p>

          <ul className="mt-3 space-y-2">
            {exampleAnalysis.terms.map((term) => (
              <li
                key={term}
                className="flex items-center gap-3 rounded-lg border border-border bg-background/60 px-4 py-3 text-sm"
              >
                <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="font-mono text-foreground">{term}</span>
              </li>
            ))}
          </ul>

          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            {exampleAnalysis.insight}
          </p>
        </div>
      </SectionShell>

      {/* Benefícios */}
      <SectionShell className="border-b border-border/60 py-16 lg:py-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {diagnosticoBenefits.map((benefit) => (
            <article
              key={benefit.title}
              className="rounded-[1.35rem] border border-border bg-surface/30 p-5"
            >
              <h3 className="font-semibold tracking-tight">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {benefit.description}
              </p>
            </article>
          ))}
        </div>
      </SectionShell>

      {/* Formulário */}
      <div id="diagnostico-form" className="relative border-b border-border/60">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent" />

        <div className="mx-auto max-w-5xl px-5 pb-6 pt-16 sm:px-8 sm:pt-20">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center sm:gap-6 lg:max-w-[44rem] lg:flex-row lg:items-center lg:gap-8 lg:text-left">
            <DiagnosticMascot className="shrink-0" />
            <div className="min-w-0">
              <SectionEyebrow>Comece agora</SectionEyebrow>
              <SectionTitle className="mt-3 text-3xl sm:text-4xl">
                Analise seu mercado gratuitamente
              </SectionTitle>
              <SectionDescription className="mt-3">
                Informe seu negócio e cidade. Resultado em segundos.
              </SectionDescription>
            </div>
          </div>
        </div>

        <GuidedDiagnostic variant="home" />
      </div>

      <NextSteps steps={diagnosticoNextSteps} title="Depois do diagnóstico" />

      <PageCTA
        title={diagnosticoCta.title}
        description={diagnosticoCta.description}
        ctaLabel="Agendar conversa estratégica"
        whatsappMessage={diagnosticoCta.whatsappMessage}
      />
    </MarketingLayout>
  );
}
