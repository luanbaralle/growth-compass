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
import { metodologiaSchemas } from "@/lib/seo/pages";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import {
  frameworkPhases,
  metodologiaNextSteps,
  metodologiaPrinciples,
} from "@/lib/metodologia/content";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function MetodologiaPage() {
  const [activePhase, setActivePhase] = useState(frameworkPhases[0].id);
  const current = frameworkPhases.find((p) => p.id === activePhase) ?? frameworkPhases[0];
  const Icon = current.icon;

  return (
    <MarketingLayout schemas={metodologiaSchemas()}>
      <div className="mx-auto max-w-7xl px-5 pt-6 sm:px-8">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Metodologia", path: "/metodologia" },
          ]}
        />
      </div>
      <PageHero
        eyebrow="Framework"
        title="Discover → Strategy → Build → Launch → Optimize → Scale"
        description="O framework que guia cada projeto Raise One — do diagnóstico profundo à escala previsível. Seis fases, uma metodologia integrada."
        primaryCta={{ label: "Fazer diagnóstico gratuito", href: "/diagnostico" }}
        secondaryCta={{ label: "Ver Programa de Crescimento", href: "/programa-de-crescimento" }}
      />

      {/* Princípios */}
      <SectionShell className="border-b border-border/60 py-16 lg:py-20">
        <div className="grid gap-4 sm:grid-cols-3">
          {metodologiaPrinciples.map((principle) => {
            const PIcon = principle.icon;
            return (
              <article
                key={principle.title}
                className="rounded-[1.35rem] border border-border bg-surface/30 p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand/20 bg-brand-soft text-brand">
                  <PIcon className="h-4.5 w-4.5" />
                </div>
                <h3 className="mt-4 font-semibold tracking-tight">{principle.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {principle.description}
                </p>
              </article>
            );
          })}
        </div>
      </SectionShell>

      {/* Framework interativo */}
      <SectionShell className="border-b border-border/60 py-20 lg:py-28">
        <div className="max-w-2xl">
          <SectionEyebrow>Framework</SectionEyebrow>
          <SectionTitle>Seis fases. Um sistema.</SectionTitle>
          <SectionDescription>
            Clique em cada fase para explorar atividades e entregas.
          </SectionDescription>
        </div>

        {/* Phase tabs */}
        <div className="mt-10 flex flex-wrap gap-2">
          {frameworkPhases.map((phase) => (
            <button
              key={phase.id}
              type="button"
              onClick={() => setActivePhase(phase.id)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                activePhase === phase.id
                  ? "border-brand bg-brand text-primary-foreground shadow-brand"
                  : "border-border bg-surface/40 text-muted-foreground hover:border-brand/30 hover:text-foreground",
              )}
            >
              {phase.number}. {phase.title}
            </button>
          ))}
        </div>

        {/* Phase detail panel */}
        <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-border">
          <div className={cn("bg-gradient-to-br p-8 sm:p-10 lg:p-12", current.color)}>
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <div className="flex items-center gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand/30 bg-brand/10 text-brand">
                    <Icon className="h-7 w-7" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">
                      Fase {current.number}
                    </p>
                    <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                      {current.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{current.subtitle}</p>
                  </div>
                </div>
                <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {current.description}
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand/80">
                    Atividades
                  </p>
                  <ul className="mt-3 space-y-2">
                    {current.activities.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand/80">
                    Entregas
                  </p>
                  <ul className="mt-3 space-y-2">
                    {current.deliverables.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline visual */}
        <div className="mt-12 hidden lg:block">
          <div className="relative flex items-center justify-between">
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />
            {frameworkPhases.map((phase) => (
              <button
                key={phase.id}
                type="button"
                onClick={() => setActivePhase(phase.id)}
                className="relative flex flex-col items-center gap-2"
              >
                <span
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-bold transition-all",
                    activePhase === phase.id
                      ? "border-brand bg-brand text-primary-foreground shadow-brand"
                      : "border-border bg-background text-muted-foreground hover:border-brand/50",
                  )}
                >
                  {phase.number}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium",
                    activePhase === phase.id ? "text-brand" : "text-muted-foreground",
                  )}
                >
                  {phase.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </SectionShell>

      <NextSteps steps={metodologiaNextSteps} title="Aplique o framework" />

      <PageCTA
        title="Comece pela fase Discover"
        description="Faça o diagnóstico gratuito — o primeiro passo do framework Raise One."
        ctaLabel="Fazer diagnóstico gratuito"
        whatsappMessage="Olá! Conheci a metodologia Raise One e gostaria de fazer o diagnóstico gratuito."
      />
    </MarketingLayout>
  );
}
