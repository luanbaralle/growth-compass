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
import { solucoesSchemas } from "@/lib/seo/pages";
import { solucoesNextSteps, solutionCategories } from "@/lib/solutions/content";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function SolucoesPage() {
  return (
    <MarketingLayout schemas={solucoesSchemas()}>
      <div className="mx-auto max-w-7xl px-5 pt-6 sm:px-8">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Soluções", path: "/solucoes" },
          ]}
        />
      </div>
      <PageHero
        eyebrow="Ecossistema"
        title="Soluções de crescimento"
        description="Não listamos serviços — construímos soluções completas. Cada frente focada em benefício, integrada ao Programa de Crescimento Raise One."
        primaryCta={{
          label: "Conhecer o Programa",
          href: "/programa-de-crescimento",
        }}
        secondaryCta={{
          label: "Fazer diagnóstico",
          href: "/#diagnostico",
        }}
      />

      {solutionCategories.map((category) => (
        <SectionShell
          key={category.title}
          className="border-b border-border/60 py-16 lg:py-20"
        >
          <div className="max-w-2xl">
            <SectionEyebrow>{category.title}</SectionEyebrow>
            <SectionTitle>{category.title}</SectionTitle>
            <SectionDescription>{category.description}</SectionDescription>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {category.items.map((item) => {
              const Icon = item.icon;

              if (!item.available) {
                return (
                  <article
                    key={item.slug}
                    className="relative flex flex-col rounded-[1.5rem] border border-border/60 bg-surface/20 p-6 opacity-60"
                  >
                    <span className="absolute right-4 top-4 rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Em breve
                    </span>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface text-muted-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {item.benefit}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold tracking-tight">{item.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </article>
                );
              }

              return (
                <Link
                  key={item.slug}
                  to={item.href}
                  className="group flex flex-col rounded-[1.5rem] border border-border bg-surface/40 p-6 transition-all hover:-translate-y-0.5 hover:border-brand/25 hover:bg-surface/70"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand/20 bg-brand-soft text-brand transition-colors group-hover:bg-brand/15">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-brand/80">
                    {item.benefit}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold tracking-tight">{item.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                    Explorar
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </SectionShell>
      ))}

      <NextSteps steps={solucoesNextSteps} />

      <PageCTA
        title="Não sabe por onde começar?"
        description="Faça o diagnóstico gratuito. Analisamos seu mercado e indicamos as soluções ideais."
        ctaLabel="Fazer diagnóstico gratuito"
        whatsappMessage="Olá! Gostaria de fazer o diagnóstico gratuito de mercado da Raise One."
      />
    </MarketingLayout>
  );
}
