import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  Search,
  Eye,
  MessageSquare,
  TrendingUp,
  Check,
  Target,
  Users,
  Globe,
  Sparkles,
  Instagram,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import logoAsset from "@/assets/raise-one-logo.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "Raise One — Sua clínica de estética merece ser encontrada no Google",
      },
      {
        name: "description",
        content:
          "Diagnóstico gratuito para clínicas de estética. Descubra quantos pacientes em potencial estão indo para a concorrência todos os dias na sua região.",
      },
      { property: "og:title", content: "Raise One — Especialistas em crescimento para negócios locais" },
      {
        property: "og:description",
        content:
          "Todos os dias mulheres pesquisam por procedimentos estéticos no Google. Sua clínica está aparecendo? Solicite seu diagnóstico gratuito.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Nav />
      <Hero />
      <SectionVisibility />
      <SectionInvisibleClient />
      <SectionJourney />
      <SectionDemand />
      <SectionAnalysis />
      <SectionMission />
      <SectionSolutions />
      <CTAForm />
      <Footer />
    </div>
  );
}

function Logo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <img
      src={logoAsset.url}
      alt="Raise One"
      className={`${className} rounded-md object-contain`}
    />
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <Logo />
          <span className="text-[15px] font-semibold tracking-tight">
            Raise One
          </span>
        </a>
        <a
          href="#diagnostico"
          className="group hidden items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand/50 hover:text-brand sm:inline-flex"
        >
          Diagnóstico gratuito
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute inset-0 radial-glow" />
      <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-16 sm:px-8 sm:pt-24 lg:pb-32 lg:pt-28">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse-dot" />
              Especialistas em crescimento para negócios locais
            </div>
            <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-[64px]">
              Sua clínica de estética em Santos deveria estar{" "}
              <span className="text-brand">recebendo mais contatos.</span>
            </h1>
            <p className="mt-6 max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
              Todos os dias, mulheres da sua região pesquisam no Google por
              procedimentos estéticos que você já oferece. Se sua clínica não
              aparece nos primeiros resultados, esses contatos estão indo para
              outra clínica.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#diagnostico"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_0_0_1px_oklch(0.72_0.19_48),0_10px_40px_-10px_oklch(0.72_0.19_48/0.6)] transition-all hover:scale-[1.02] hover:shadow-[0_0_0_1px_oklch(0.72_0.19_48),0_15px_50px_-10px_oklch(0.72_0.19_48/0.8)]"
              >
                Quero meu diagnóstico gratuito
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>

            <ul className="mt-8 grid grid-cols-1 gap-2.5 text-sm text-muted-foreground sm:grid-cols-2">
              {[
                "Sem compromisso",
                "Sem contrato",
                "Análise personalizada da sua região",
                "Retorno em até 24 horas",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-soft">
                    <Check className="h-2.5 w-2.5 text-brand" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  const steps = [
    { icon: Users, label: "Demanda", sub: "pessoas com intenção" },
    { icon: Search, label: "Busca", sub: "no Google" },
    { icon: Eye, label: "Visibilidade", sub: "primeiros resultados" },
    { icon: MessageSquare, label: "Contato", sub: "novo paciente" },
  ];
  return (
    <div className="relative animate-fade-up [animation-delay:120ms]">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-surface to-background p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-brand animate-pulse-dot" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Fluxo de demanda local
            </span>
          </div>
          <span className="text-xs font-mono text-muted-foreground">LIVE</span>
        </div>

        <div className="space-y-3">
          {steps.map((s, i) => (
            <div key={s.label} className="group relative">
              <div className="flex items-center gap-4 rounded-xl border border-border bg-surface-elevated/60 px-4 py-3.5 transition-all hover:border-brand/40">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                  <s.icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {s.label}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      0{i + 1}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{s.sub}</span>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="ml-9 h-3 w-px bg-gradient-to-b from-brand/60 to-transparent" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-lg border border-brand/20 bg-brand-soft/40 px-4 py-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Pesquisas mensais estimadas</span>
            <span className="font-mono font-semibold text-brand">+2.400</span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-background">
            <div className="h-full w-3/4 rounded-full bg-brand" />
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-brand/10 blur-3xl" />
    </div>
  );
}

function SectionWrap({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`relative border-t border-border/60 ${className}`}>
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        {children}
      </div>
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-brand">
      <span className="h-px w-6 bg-brand" />
      {children}
    </div>
  );
}

function SectionVisibility() {
  const queries = [
    "Botox",
    "Harmonização Facial",
    "Limpeza de Pele",
    "Preenchimento Labial",
    "Depilação a Laser",
  ];
  return (
    <SectionWrap>
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <Eyebrow>01 — O Problema</Eyebrow>
          <h2 className="text-balance text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-5xl">
            A maioria das clínicas não tem problema de qualidade.
            <br />
            <span className="text-muted-foreground">
              Tem problema de visibilidade.
            </span>
          </h2>
          <div className="mt-8 space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>Você pode ter:</p>
            <ul className="space-y-2.5">
              {[
                "excelente atendimento",
                "profissionais qualificados",
                "boa estrutura",
                "pacientes satisfeitos",
              ].map((i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="h-1 w-1 rounded-full bg-brand" />
                  {i}
                </li>
              ))}
            </ul>
            <p>Mas nada disso importa para quem nunca encontrou sua clínica.</p>
          </div>
        </div>

        <div className="lg:pl-10">
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <Search className="h-3.5 w-3.5" />
              Todos os dias pessoas pesquisam
            </div>
            <div className="space-y-2">
              {queries.map((q) => (
                <div
                  key={q}
                  className="group flex items-center justify-between rounded-lg border border-border bg-background/40 px-4 py-3 transition-colors hover:border-brand/40"
                >
                  <span className="flex items-center gap-3 text-sm font-medium">
                    <Search className="h-3.5 w-3.5 text-muted-foreground" />
                    {q}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-brand" />
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-brand/30 bg-brand-soft p-5">
              <p className="text-balance text-lg font-semibold text-foreground sm:text-xl">
                Quando elas pesquisam,{" "}
                <span className="text-brand">sua clínica aparece?</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionWrap>
  );
}

function SectionInvisibleClient() {
  return (
    <SectionWrap className="bg-surface/30">
      <div className="mx-auto max-w-4xl text-center">
        <Eyebrow>02 — A Realidade</Eyebrow>
        <h2 className="text-balance text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-5xl">
          O cliente que você não vê{" "}
          <span className="text-brand">também tem valor.</span>
        </h2>
      </div>

      <div className="mx-auto mt-14 max-w-3xl">
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-10">
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-mono text-foreground">
              botox santos
            </span>
            <span className="ml-auto text-xs text-muted-foreground">
              Google
            </span>
          </div>

          <div className="space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              Ela <span className="text-foreground">não está navegando</span> por
              curiosidade.
            </p>
            <p>
              Ela já decidiu que{" "}
              <span className="text-foreground">quer resolver um problema.</span>
            </p>
            <p>
              Ela está{" "}
              <span className="text-foreground">escolhendo quem vai atender.</span>
            </p>
          </div>

          <div className="my-8 h-px bg-border" />

          <p className="text-balance text-lg leading-relaxed text-foreground sm:text-xl">
            Se sua concorrente aparece antes de você, existe uma grande chance
            de que esse contato{" "}
            <span className="text-brand">nunca chegue até sua clínica.</span>
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <div className="rounded-lg border border-border bg-background py-3">
              Sem aviso
            </div>
            <div className="rounded-lg border border-border bg-background py-3">
              Sem notificação
            </div>
            <div className="rounded-lg border border-border bg-background py-3">
              Sem perceber
            </div>
          </div>
        </div>
      </div>
    </SectionWrap>
  );
}

function SectionJourney() {
  const steps = [
    "Pessoa procura procedimento",
    "Google mostra resultados",
    "Paciente acessa uma clínica",
    "Analisa rapidamente",
    "Entra em contato",
    "Agenda avaliação",
    "Torna-se paciente",
  ];
  return (
    <SectionWrap>
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow>03 — A Jornada</Eyebrow>
        <h2 className="text-balance text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-5xl">
          Como novos pacientes{" "}
          <span className="text-brand">encontram clínicas no Google</span>
        </h2>
      </div>

      <div className="mx-auto mt-14 max-w-2xl">
        <div className="relative space-y-2">
          {steps.map((step, i) => (
            <div key={step}>
              <div className="flex items-center gap-4 rounded-xl border border-border bg-surface px-5 py-4 transition-all hover:border-brand/40 hover:bg-surface-elevated">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-soft font-mono text-xs font-semibold text-brand">
                  0{i + 1}
                </span>
                <span className="text-sm font-medium text-foreground sm:text-base">
                  {step}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="ml-9 h-3 w-px bg-gradient-to-b from-brand/50 to-transparent" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-4 rounded-2xl border border-border bg-surface/50 p-6 sm:grid-cols-2 sm:p-8">
          <div className="flex items-start gap-3">
            <Instagram className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              A maioria das clínicas tenta competir{" "}
              <span className="text-foreground">apenas no Instagram.</span>
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Search className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
            <p className="text-sm leading-relaxed text-foreground">
              Mas a maioria dos clientes inicia sua jornada de compra{" "}
              <span className="text-brand">no Google.</span>
            </p>
          </div>
        </div>
      </div>
    </SectionWrap>
  );
}

function SectionDemand() {
  return (
    <SectionWrap className="bg-surface/30">
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20">
        <div>
          <Eyebrow>04 — A Oportunidade</Eyebrow>
          <h2 className="text-balance text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-5xl">
            Existe demanda na sua região.
            <br />
            <span className="text-muted-foreground">
              A questão é quem está capturando essa demanda.
            </span>
          </h2>
          <div className="mt-8 space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              Imagine que existam centenas ou milhares de pesquisas mensais
              relacionadas aos procedimentos que sua clínica oferece.
            </p>
            <p>
              Agora imagine que boa parte dessas pessoas{" "}
              <span className="text-foreground">nunca encontra sua empresa.</span>
            </p>
            <p className="text-foreground">
              Não porque você é pior.{" "}
              <span className="text-brand">Mas porque você não apareceu.</span>
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-2xl border border-border bg-background p-6 sm:p-8">
            <div className="mb-6 flex items-baseline justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Demanda regional — últimos 30 dias
              </span>
              <span className="font-mono text-xs text-brand">+2.847</span>
            </div>
            <div className="space-y-4">
              {[
                { label: "Botox", value: 92 },
                { label: "Harmonização", value: 78 },
                { label: "Limpeza de Pele", value: 64 },
                { label: "Preenchimento", value: 51 },
                { label: "Depilação a Laser", value: 43 },
              ].map((row) => (
                <div key={row.label}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">
                      {row.label}
                    </span>
                    <span className="font-mono text-muted-foreground">
                      {row.value}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-elevated">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand to-brand/60"
                      style={{ width: `${row.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border bg-surface px-4 py-3">
                <div className="text-xs text-muted-foreground">
                  Capturado por você
                </div>
                <div className="mt-1 text-lg font-semibold text-muted-foreground">
                  ?
                </div>
              </div>
              <div className="rounded-lg border border-brand/30 bg-brand-soft px-4 py-3">
                <div className="text-xs text-brand">Disponível</div>
                <div className="mt-1 text-lg font-semibold text-brand">100%</div>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-brand/5 blur-3xl" />
        </div>
      </div>
    </SectionWrap>
  );
}

function SectionAnalysis() {
  const cards = [
    {
      icon: Target,
      title: "Mercado Local",
      desc: "Quem procura pelos seus serviços na sua região.",
    },
    {
      icon: Users,
      title: "Concorrência",
      desc: "Quem está aparecendo hoje.",
    },
    {
      icon: Globe,
      title: "Presença Digital",
      desc: "Como sua clínica está posicionada atualmente.",
    },
    {
      icon: Sparkles,
      title: "Oportunidades",
      desc: "Onde existem chances reais de captar novos pacientes.",
    },
  ];
  return (
    <SectionWrap>
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow>05 — Diagnóstico</Eyebrow>
        <h2 className="text-balance text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-5xl">
          O que analisamos <span className="text-brand">gratuitamente</span>
        </h2>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <div
            key={c.title}
            className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-all hover:border-brand/40 hover:bg-surface-elevated"
          >
            <div className="mb-12 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background text-brand transition-colors group-hover:border-brand/40">
              <c.icon className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="absolute right-5 top-5 font-mono text-xs text-muted-foreground">
              0{i + 1}
            </div>
            <h3 className="text-lg font-semibold text-foreground">{c.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {c.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-border bg-surface/50 p-6 text-center sm:p-8">
        <p className="text-base text-foreground sm:text-lg">
          Você recebe um parecer{" "}
          <span className="text-brand">simples e objetivo.</span>
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm text-muted-foreground">
          <span>Sem linguagem técnica</span>
          <span>•</span>
          <span>Sem compromisso</span>
        </div>
      </div>
    </SectionWrap>
  );
}

function SectionMission() {
  return (
    <SectionWrap className="bg-surface/30">
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20">
        <div>
          <Eyebrow>06 — Nossa Missão</Eyebrow>
          <h2 className="text-balance text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-5xl">
            Nosso trabalho não é vender anúncios.
            <br />
            <span className="text-brand">
              É ajudar negócios locais a serem encontrados.
            </span>
          </h2>
          <div className="mt-8 space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              Muitas empresas excelentes deixam de crescer porque dependem
              exclusivamente de:
            </p>
            <div className="flex flex-wrap gap-2">
              {["indicação", "Instagram", "boca a boca"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-background px-3.5 py-1.5 text-sm text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
            <p>
              Enquanto isso, pessoas interessadas continuam pesquisando seus
              serviços{" "}
              <span className="text-foreground">todos os dias no Google.</span>
            </p>
            <p className="text-foreground">
              Nosso papel é mostrar onde estão essas oportunidades e como
              capturá-las.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface to-background p-8 sm:p-10">
            <div className="flex items-center gap-3">
              <Logo className="h-10 w-10" />
              <div>
                <div className="text-lg font-semibold">Raise One</div>
                <div className="text-xs text-muted-foreground">
                  Crescimento para negócios locais
                </div>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 border-y border-border py-6">
              <Stat label="Foco" value="Local" />
              <Stat label="Mercado" value="B2B" />
              <Stat label="Método" value="Dados" />
            </div>

            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Trabalhamos com clínicas que querem entender, antes de qualquer
              investimento, o tamanho real da oportunidade na sua região.
            </p>
          </div>
        </div>
      </div>
    </SectionWrap>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold text-foreground">{value}</div>
    </div>
  );
}

function SectionSolutions() {
  const cards = [
    {
      tag: "01",
      title: "Landing Page de Conversão",
      desc: "Uma página focada em transformar visitantes em contatos.",
    },
    {
      tag: "02",
      title: "Posicionamento no Google",
      desc: "Para aparecer quando alguém procura pelo serviço oferecido.",
    },
    {
      tag: "03",
      title: "Gestão e Otimização",
      desc: "Para melhorar continuamente os resultados.",
    },
  ];
  return (
    <SectionWrap>
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow>07 — Como Resolvemos</Eyebrow>
        <h2 className="text-balance text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-5xl">
          Como normalmente{" "}
          <span className="text-brand">resolvemos esse problema</span>
        </h2>
      </div>

      <div className="mt-14 grid gap-4 lg:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.tag}
            className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-8 transition-all hover:border-brand/40"
          >
            <div className="font-mono text-xs text-brand">{c.tag}</div>
            <h3 className="mt-6 text-xl font-semibold text-foreground">
              {c.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {c.desc}
            </p>
            <div className="mt-8 h-px w-full bg-gradient-to-r from-brand/40 via-border to-transparent" />
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-2xl text-center">
        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
          Mas isso só faz sentido depois que entendemos a{" "}
          <span className="text-foreground">realidade do seu mercado.</span>
          <br />
          Por isso o{" "}
          <span className="text-brand">diagnóstico vem primeiro.</span>
        </p>
      </div>
    </SectionWrap>
  );
}

function CTAForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="diagnostico"
      className="relative overflow-hidden border-t border-border/60 bg-surface/30"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
      <div className="absolute inset-0 radial-glow opacity-60" />
      <div className="relative mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Diagnóstico Gratuito</Eyebrow>
          <h2 className="text-balance text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-5xl">
            Quantas oportunidades sua clínica está{" "}
            <span className="text-brand">deixando passar hoje?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
            Solicite gratuitamente uma análise da sua região e descubra como
            potenciais pacientes estão encontrando seus concorrentes.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-xl">
          {submitted ? (
            <div className="rounded-2xl border border-brand/40 bg-brand-soft p-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand text-primary-foreground">
                <Check className="h-6 w-6" strokeWidth={3} />
              </div>
              <h3 className="text-xl font-semibold">Recebido.</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Retornamos em até 24 horas com seu diagnóstico personalizado.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border bg-background/80 p-6 backdrop-blur-xl sm:p-8"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nome" name="name" required />
                <Field label="WhatsApp" name="phone" type="tel" required />
                <Field label="Cidade" name="city" required />
                <Field
                  label="Clínica ou Segmento"
                  name="business"
                  required
                />
                <div className="sm:col-span-2">
                  <Field
                    label="Site ou Instagram"
                    name="link"
                    optional
                  />
                </div>
              </div>
              <button
                type="submit"
                className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-4 text-sm font-semibold text-primary-foreground shadow-[0_10px_40px_-10px_oklch(0.72_0.19_48/0.7)] transition-all hover:scale-[1.01]"
              >
                Quero meu diagnóstico gratuito
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Sem compromisso · Retorno em até 24 horas
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  optional,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        {label}
        {optional && (
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
            opcional
          </span>
        )}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        maxLength={120}
        className="w-full rounded-lg border border-border bg-surface px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/20"
      />
    </label>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo />
              <span className="text-base font-semibold tracking-tight">
                Raise One
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Especialistas em crescimento para negócios locais.
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-brand"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-brand"
            >
              <Instagram className="h-4 w-4" />
              Instagram
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Política de Privacidade
            </a>
          </nav>
        </div>
        <div className="mt-10 flex items-center justify-between border-t border-border/60 pt-6 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Raise One</span>
          <span className="flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-brand" />
            Crescimento local
          </span>
        </div>
      </div>
    </footer>
  );
}
