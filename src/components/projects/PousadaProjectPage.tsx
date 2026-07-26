import { Footer } from "@/components/landing/shared/Footer";
import { Nav } from "@/components/landing/shared/Nav";
import { captureUtmFromUrl } from "@/lib/utm";
import {
  adsCampaigns,
  demandKeywords,
  differentials,
  expectedResults,
  heroContent,
  heroStats,
  landingSections,
  methodologySteps,
  phases,
  pousadaProject,
  problemContent,
  productionItems,
  quickLinks,
  roadmap,
  strategyFunnel,
} from "@/lib/projects/pousada-content";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BedDouble,
  Camera,
  ChartColumn,
  Clapperboard,
  Coffee,
  Compass,
  MessageCircleMore,
  MoveRight,
  Palmtree,
  ScanSearch,
  Sparkles,
  Target,
  Waves,
  Workflow,
} from "lucide-react";
import { Fragment, useEffect, type ReactNode } from "react";

const displayFont = {
  fontFamily: '"Cormorant Garamond", "Times New Roman", serif',
} as const;

const sectionShellClass = "mx-auto max-w-7xl px-5 sm:px-8";
const surfaceCardClass =
  "rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-[0_24px_80px_-48px_rgba(0,0,0,0.85)] backdrop-blur-sm";
const insetCardClass = "rounded-[1.4rem] border border-white/10 bg-[#0b0b0c]/90";
const chipClass =
  "rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/74";

const productionIcons: LucideIcon[] = [Compass, Waves, BedDouble, Coffee, Palmtree, Camera];

function SectionShell({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn(sectionShellClass, className)}>
      {children}
    </section>
  );
}

function SurfaceCard({ className, children }: { className?: string; children: ReactNode }) {
  return <article className={cn(surfaceCardClass, className)}>{children}</article>;
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand/80">{eyebrow}</p>
      <h2 className="mt-4 text-4xl leading-none text-white sm:text-5xl" style={displayFont}>
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-white/68 sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.55rem] border border-white/10 bg-white/[0.03] px-5 py-5 backdrop-blur">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/42">{label}</p>
      <p className="mt-3 text-3xl text-white" style={displayFont}>
        {value}
      </p>
    </div>
  );
}

function FlowLine({ steps, variant }: { steps: readonly string[]; variant: "bad" | "good" }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
      {steps.map((step, i) => (
        <Fragment key={step}>
          <span
            className={cn(
              "rounded-full px-4 py-2 text-[11px] font-medium tracking-wide md:px-5 md:text-xs",
              variant === "bad"
                ? "border border-white/10 bg-white/[0.03] text-white/55"
                : "border border-brand/20 bg-brand/10 text-amber-100",
            )}
          >
            {step}
          </span>
          {i < steps.length - 1 ? (
            <MoveRight
              className={cn("h-4 w-4", variant === "bad" ? "text-white/20" : "text-brand/50")}
            />
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}

export function PousadaProjectPage() {
  useEffect(() => {
    captureUtmFromUrl();
  }, []);

  return (
    <div
      className="min-h-screen bg-[#050505] text-white"
      style={{ fontFamily: '"Manrope", Inter, system-ui, sans-serif' }}
    >
      <Nav ctaHref={pousadaProject.cta.href} ctaLabel={pousadaProject.cta.label} homeHref="/" />

      <main id="top" className="overflow-x-hidden">
        <section className="relative isolate overflow-hidden border-b border-white/8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_22%),linear-gradient(180deg,#080808_0%,#050505_48%,#09090b_100%)]" />
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
            }}
          />
          <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-100">
                <span className="h-2 w-2 rounded-full bg-brand shadow-[0_0_16px_color-mix(in_oklch,var(--brand)_70%,transparent)]" />
                {heroContent.eyebrow}
              </div>

              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.36em] text-white/45">
                {pousadaProject.segment} · {pousadaProject.location}
              </p>
              <h1
                className="mt-4 max-w-4xl text-5xl leading-none text-white sm:text-6xl lg:text-7xl"
                style={displayFont}
              >
                {heroContent.headline}
              </h1>
              <p className="mt-6 max-w-2xl text-xl leading-relaxed text-white/78 sm:text-2xl">
                {heroContent.subheadline}
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#problema"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
                >
                  {heroContent.cta}
                </a>
                <a
                  href="#metodologia"
                  className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white/84 transition-colors hover:border-white/25 hover:bg-white/[0.05]"
                >
                  Ver metodologia
                </a>
              </div>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {quickLinks.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/66 transition-colors hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {heroStats.map((item) => (
                  <MetricCard key={item.label} label={item.label} value={item.value} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <SectionShell id="problema" className="py-18 lg:py-24">
          <SectionHeading
            eyebrow="O problema"
            title={problemContent.title}
            description={problemContent.subtitle}
          />

          <div className="mt-10 space-y-8">
            <SurfaceCard className="p-8 md:p-12">
              <FlowLine steps={problemContent.currentFlow} variant="bad" />
            </SurfaceCard>

            <p className="text-center text-3xl italic text-white/30" style={displayFont}>
              {problemContent.pivot}
            </p>

            <SurfaceCard className="border-brand/15 bg-brand/[0.04] p-8 md:p-12">
              <FlowLine steps={problemContent.idealFlow} variant="good" />
            </SurfaceCard>
          </div>
        </SectionShell>

        <SectionShell id="demanda" className="py-8 lg:py-12">
          <SectionHeading
            eyebrow="Existe demanda"
            title="Todos esses clientes ja estao procurando."
            description="O problema nao e demanda. E visibilidade."
          />

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {demandKeywords.map((keyword) => (
              <div
                key={keyword}
                className="group rounded-xl border border-white/10 bg-white/[0.02] px-4 py-5 transition-all duration-500 hover:border-brand/20 hover:bg-brand/[0.04] md:px-5 md:py-6"
              >
                <p className="text-[11px] font-medium leading-snug text-white/60 transition-colors group-hover:text-white/90 md:text-xs">
                  {keyword}
                </p>
              </div>
            ))}
          </div>
        </SectionShell>

        <SectionShell id="estrategia" className="py-18 lg:py-24">
          <SectionHeading
            eyebrow="Nossa estrategia"
            title="Um sistema completo de aquisicao de hospedes."
            description="Da busca no Google ate a reserva confirmada — e o loop de crescimento que vem depois."
          />

          <SurfaceCard className="mt-10 p-7 sm:p-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-stretch xl:justify-between">
              {strategyFunnel.map((step, index) => (
                <Fragment key={step.label}>
                  <div className="min-w-0 flex-1 rounded-[1.7rem] border border-white/10 bg-[#0b0b0c] p-5 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-brand/20 bg-brand/10 text-amber-100">
                      <Workflow className="h-5 w-5" />
                    </div>
                    <div className="mt-4 inline-flex rounded-full border border-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/56">
                      Passo {index + 1}
                    </div>
                    <p className="mt-4 text-2xl text-white" style={displayFont}>
                      {step.label}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-white/62">{step.desc}</p>
                  </div>
                  {index < strategyFunnel.length - 1 ? (
                    <>
                      <div className="flex items-center justify-center xl:hidden">
                        <MoveRight className="h-5 w-5 rotate-90 text-brand/70" />
                      </div>
                      <div className="hidden items-center justify-center xl:flex">
                        <MoveRight className="h-5 w-5 text-brand/70" />
                      </div>
                    </>
                  ) : null}
                </Fragment>
              ))}
            </div>
          </SurfaceCard>
        </SectionShell>

        <SectionShell id="metodologia" className="py-18 lg:py-24">
          <SectionHeading
            eyebrow="A metodologia Raise"
            title={pousadaProject.methodology}
            description="Sete etapas integradas. Do diagnostico a otimizacao continua — um framework replicavel que transforma pesquisas no Google em reservas recorrentes."
          />

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {methodologySteps.map((step) => (
              <SurfaceCard key={step.step} className="group p-7 transition-transform hover:-translate-y-0.5">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-4xl text-white/10" style={displayFont}>
                    {step.step}
                  </span>
                  <h3 className="text-right text-2xl text-white" style={displayFont}>
                    {step.title}
                  </h3>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-white/55">{step.desc}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {step.items.map((item) => (
                    <span key={item} className={chipClass}>
                      {item}
                    </span>
                  ))}
                </div>
              </SurfaceCard>
            ))}
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {phases.map((phase) => (
              <SurfaceCard
                key={phase.phase}
                className="border-brand/15 bg-gradient-to-br from-brand/[0.06] to-transparent p-8"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand/80">
                  {phase.phase}
                </p>
                <h3 className="mt-3 text-3xl text-white" style={displayFont}>
                  {phase.title}
                </h3>
                <ul className="mt-6 space-y-3">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-white/65">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" />
                      {item}
                    </li>
                  ))}
                </ul>
              </SurfaceCard>
            ))}
          </div>
        </SectionShell>

        <SectionShell id="producao" className="py-8 lg:py-12">
          <SectionHeading
            eyebrow="Producao audiovisual"
            title="Hotel vende imagem. Nao vende texto."
            description="Criamos todo material visual necessario caso sua pousada ainda nao possua um acervo capaz de transmitir a experiencia que o hospede ira viver."
          />

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
            {productionItems.map((label, i) => {
              const Icon = productionIcons[i] ?? Camera;
              return (
                <SurfaceCard
                  key={label}
                  className="group relative aspect-[4/5] overflow-hidden p-0 transition-transform hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(251,191,36,0.12),rgba(16,185,129,0.08),#0b0b0c)]" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-brand transition-colors group-hover:border-brand/25 group-hover:bg-brand/10">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/90">
                      {label}
                    </p>
                  </div>
                </SurfaceCard>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap gap-2.5">
            {["Captacao", "Edicao", "Tour virtual", "Reels", "Conteudo lifestyle"].map((tag) => (
              <span key={tag} className={chipClass}>
                {tag}
              </span>
            ))}
          </div>
        </SectionShell>

        <SectionShell id="landing" className="py-18 lg:py-24">
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="A landing page"
                title="Feita para converter. Nao para impressionar."
                description="Cada secao existe para um unico proposito: transformar visitante em hospede."
              />

              <div className="mt-8 space-y-4">
                {landingSections.map((section, i) => (
                  <div
                    key={section.title}
                    className="flex gap-4 border-b border-white/[0.06] pb-4"
                  >
                    <span className="text-lg text-brand/60" style={displayFont}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-white/85">{section.title}</p>
                      <p className="mt-0.5 text-xs text-white/45">{section.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <SurfaceCard className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/42">
                Mockup da experiencia
              </p>
              <div className="mt-6 space-y-4">
                <div className="h-40 rounded-[1.2rem] bg-[linear-gradient(135deg,rgba(251,191,36,0.15),rgba(16,185,129,0.1))]" />
                <div className="space-y-2">
                  <div className="h-2 w-3/4 rounded bg-white/10" />
                  <div className="h-2 w-1/2 rounded bg-white/[0.06]" />
                </div>
                <div className="h-10 rounded-full bg-brand/15" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-20 rounded-xl bg-white/[0.04]" />
                  <div className="h-20 rounded-xl bg-white/[0.04]" />
                </div>
              </div>
            </SurfaceCard>
          </div>
        </SectionShell>

        <SectionShell id="google-ads" className="py-8 lg:py-12">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="Google Ads"
                title="Apareca no momento exato da decisao."
                description="Campanhas segmentadas por intencao de compra. Cada pesquisa e uma oportunidade de reserva."
              />

              <SurfaceCard className="mt-8 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/42">
                  Fluxo de conversao
                </p>
                <div className="mt-5 space-y-3">
                  {[
                    'Pessoa pesquisa "Hotel em Itanhaem"',
                    "Voce aparece no topo",
                    "Clique na landing page",
                    "WhatsApp aberto",
                    "Reserva confirmada",
                  ].map((step, i) => (
                    <div key={step} className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/10 text-[10px] font-bold text-amber-100">
                        {i + 1}
                      </span>
                      <p className="text-sm text-white/65">{step}</p>
                    </div>
                  ))}
                </div>
              </SurfaceCard>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/42">
                Estrutura de campanhas
              </p>
              <div className="mt-5 space-y-3">
                {adsCampaigns.map((campaign, i) => (
                  <SurfaceCard
                    key={campaign}
                    className="flex items-center justify-between px-5 py-4 transition-colors hover:border-brand/15"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold text-white/25">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-sm font-medium text-white/75">{campaign}</p>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-brand/70">
                      Alta intencao
                    </span>
                  </SurfaceCard>
                ))}
              </div>
            </div>
          </div>
        </SectionShell>

        <SectionShell className="py-18 lg:py-24">
          <SectionHeading
            eyebrow="Resultado esperado"
            title="Mais reservas. Mais ocupacao. Mais previsibilidade."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {expectedResults.map((result) => (
              <SurfaceCard key={result.label} className="p-7 text-center">
                <p className="text-xl text-white" style={displayFont}>
                  {result.label}
                </p>
                <p className="mt-3 text-sm text-white/45">{result.value}</p>
              </SurfaceCard>
            ))}
          </div>

          <SurfaceCard className="mt-8 p-8 text-center">
            <p className="text-2xl italic text-white/35" style={displayFont}>
              &ldquo;Na UNIP vendiamos matriculas. Na pousada, vendemos reservas. O sistema e o
              mesmo.&rdquo;
            </p>
          </SurfaceCard>
        </SectionShell>

        <SectionShell id="roadmap" className="py-8 lg:py-12">
          <SectionHeading
            eyebrow="Roadmap"
            title="Do diagnostico ao go-live em 5 semanas."
          />

          <div className="mt-10 space-y-5">
            {roadmap.map((item) => (
              <SurfaceCard key={item.week} className="p-6 md:p-8">
                <div className="flex flex-wrap items-baseline gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand/80">
                    {item.week}
                  </p>
                  <h3 className="text-2xl text-white" style={displayFont}>
                    {item.title}
                  </h3>
                </div>
                <p className="mt-3 text-sm text-white/50">{item.desc}</p>
              </SurfaceCard>
            ))}
          </div>
        </SectionShell>

        <SectionShell className="py-18 lg:py-24">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.32em] text-white/35">
            Diferenciais Raise
          </p>
          <div className="mt-12 space-y-10">
            {differentials.map((item) => (
              <div key={item.title} className="text-center">
                <p className="text-3xl text-white/25" style={displayFont}>
                  {item.title}
                </p>
                <p className="mt-2 text-4xl text-white sm:text-5xl" style={displayFont}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </SectionShell>

        <SectionShell className="py-8 lg:py-12">
          <SurfaceCard className="border-brand/15 bg-[linear-gradient(180deg,rgba(251,191,36,0.08),rgba(255,255,255,0.03))] p-8 text-center sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-brand/20 bg-brand/10 text-amber-100">
              <Target className="h-6 w-6" />
            </div>
            <h2 className="mx-auto mt-8 max-w-3xl text-4xl text-white sm:text-5xl" style={displayFont}>
              Vamos construir o principal canal de aquisicao da sua pousada?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/65">
              Um sistema completo — do posicionamento a otimizacao continua. Pronto para transformar
              pesquisas no Google em reservas recorrentes.
            </p>
            <a
              href={pousadaProject.cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
            >
              {pousadaProject.cta.label}
              <ArrowRight className="h-4 w-4" />
            </a>
          </SurfaceCard>
        </SectionShell>

        <SectionShell className="pb-18 lg:pb-24">
          <div className="grid gap-5 lg:grid-cols-3">
            <SurfaceCard className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-400/12 text-emerald-200">
                  <MessageCircleMore className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/42">Conversao</p>
                  <p className="font-semibold text-white">WhatsApp direto</p>
                </div>
              </div>
            </SurfaceCard>
            <SurfaceCard className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/12 text-amber-100">
                  <ScanSearch className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/42">Aquisicao</p>
                  <p className="font-semibold text-white">Google Ads + SEO</p>
                </div>
              </div>
            </SurfaceCard>
            <SurfaceCard className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/12 text-amber-100">
                  <Clapperboard className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/42">Producao</p>
                  <p className="font-semibold text-white">Foto, video e drone</p>
                </div>
              </div>
            </SurfaceCard>
          </div>

          <SurfaceCard className="mt-5 p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/12 text-amber-100">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/42">
                  Ativo permanente da Raise One
                </p>
                <p className="mt-3 text-base leading-relaxed text-white/68">
                  Esta pagina apresenta a metodologia de aquisicao para hotelaria e pode ser
                  adaptada para outros segmentos — imobiliarias, clinicas, educacao e mais — como em{" "}
                  <code className="rounded bg-black/25 px-1.5 py-0.5 text-sm text-white">
                    /projetos/gabrielfranca
                  </code>
                  .
                </p>
              </div>
            </div>
          </SurfaceCard>
        </SectionShell>
      </main>

      <Footer />
    </div>
  );
}
