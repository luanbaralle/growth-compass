import { AnimatedStat } from "@/components/home/shared/AnimatedStat";
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
import { tecnologiaSchemas } from "@/lib/seo/pages";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import {
  roadmap,
  techProductsDetailed,
  techStatsDetailed,
  tecnologiaDifferentiators,
  tecnologiaNextSteps,
} from "@/lib/tecnologia/content";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

const statusLabels = {
  live: { label: "Ativo", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  beta: { label: "Beta", className: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  roadmap: { label: "Roadmap", className: "bg-muted-foreground/15 text-muted-foreground border-border" },
};

const roadmapStatus = {
  done: { label: "Concluído", className: "text-emerald-400" },
  "in-progress": { label: "Em andamento", className: "text-brand" },
  planned: { label: "Planejado", className: "text-muted-foreground" },
};

export function TecnologiaPage() {
  return (
    <MarketingLayout schemas={tecnologiaSchemas()}>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Tecnologia", path: "/tecnologia" },
            ]}
          />
        }
        eyebrow="Tecnologia"
        title="Tecnologia que acelera crescimento"
        description="Não apenas usamos ferramentas — construímos produtos e sistemas que transformam marketing em máquinas de aquisição e conversão."
        primaryCta={{ label: "Ver case Atlas", href: "/cases/atlas" }}
        secondaryCta={{ label: "Fazer diagnóstico", href: "/diagnostico" }}
      />

      {/* Stats */}
      <SectionShell className="border-b border-border/60 py-12 lg:py-16">
        <div className="rounded-[1.5rem] border border-border bg-surface/20 px-5 py-8 sm:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {techStatsDetailed.map((stat) => (
              <AnimatedStat key={stat.label} {...stat} compact />
            ))}
          </div>
        </div>
      </SectionShell>

      {/* Diferenciais */}
      <SectionShell className="border-b border-border/60 py-16 lg:py-20">
        <div className="grid gap-4 sm:grid-cols-3">
          {tecnologiaDifferentiators.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-[1.35rem] border border-border bg-surface/30 p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand/20 bg-brand-soft text-brand">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <h3 className="mt-4 font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </SectionShell>

      {/* Produtos */}
      <SectionShell className="border-b border-border/60 py-20 lg:py-28">
        <div className="max-w-2xl">
          <SectionEyebrow>Produtos</SectionEyebrow>
          <SectionTitle>O que construímos</SectionTitle>
          <SectionDescription>
            Tecnologia desenvolvida internamente — integrada ao funil de growth dos nossos clientes.
          </SectionDescription>
        </div>

        <div className="mt-12 space-y-6">
          {techProductsDetailed.map((product, index) => {
            const Icon = product.icon;
            const status = statusLabels[product.status];

            return (
              <article
                key={product.title}
                className={cn(
                  "grid gap-8 rounded-[1.75rem] border border-border bg-surface/30 p-6 sm:p-8 lg:grid-cols-2 lg:gap-12",
                  index % 2 === 1 && "lg:[direction:rtl] lg:*:[direction:ltr]",
                )}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand/20 bg-brand-soft text-brand">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                        status.className,
                      )}
                    >
                      {status.label}
                    </span>
                  </div>
                  <h3 className="mt-5 text-2xl font-bold tracking-tight">{product.title}</h3>
                  <p className="mt-1 text-sm text-brand">{product.description}</p>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {product.longDescription}
                  </p>
                  {product.title === "Diagnóstico Inteligente" && (
                    <Link
                      to="/diagnostico"
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand/80"
                    >
                      Experimentar gratuitamente →
                    </Link>
                  )}
                  {product.title === "Atlas" && (
                    <Link
                      to="/cases/atlas"
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand/80"
                    >
                      Ver case Atlas →
                    </Link>
                  )}
                </div>
                <ul className="space-y-2.5">
                  {product.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/50 px-4 py-3 text-sm"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </SectionShell>

      {/* Roadmap */}
      <SectionShell className="border-b border-border/60 py-20 lg:py-28">
        <div className="max-w-2xl">
          <SectionEyebrow>Roadmap</SectionEyebrow>
          <SectionTitle>O que vem por aí</SectionTitle>
          <SectionDescription>
            Tecnologia que evolui com demanda real — não features genéricas.
          </SectionDescription>
        </div>

        <div className="mt-10 space-y-4">
          {roadmap.map((item) => {
            const status = roadmapStatus[item.status];
            return (
              <article
                key={item.title}
                className="grid gap-4 rounded-xl border border-border bg-surface/30 px-5 py-4 sm:grid-cols-[100px_1fr_auto]"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {item.quarter}
                </span>
                <div>
                  <h3 className="font-semibold tracking-tight">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                </div>
                <span className={cn("text-xs font-semibold", status.className)}>
                  {status.label}
                </span>
              </article>
            );
          })}
        </div>
      </SectionShell>

      <NextSteps steps={tecnologiaNextSteps} />

      <PageCTA
        title="Tecnologia + estratégia = crescimento"
        description="Converse conosco sobre como nossa tecnologia pode acelerar seu negócio."
        whatsappMessage="Olá! Conheci a tecnologia Raise One e gostaria de conversar sobre soluções para meu negócio."
      />
    </MarketingLayout>
  );
}
