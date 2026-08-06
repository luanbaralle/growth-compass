import type { SegmentConfig } from "@/config/segments/types";
import type { BusinessPersonalization } from "@/config/microverticals/types";
import { getSegmentVisual } from "@/config/segments/visuals";
import { ArrowRight, Check, Eye, MessageSquare, Search, Users } from "lucide-react";
import { buildHeroTitle, matchBusiness } from "@/lib/business-match";

interface HeroSectionProps {
  config: SegmentConfig;
  city?: string;
  personalization?: BusinessPersonalization;
}

export function HeroSection({ config, city, personalization }: HeroSectionProps) {
  const { hero } = config;
  const visual = getSegmentVisual(config.slug, config.hubLabel);

  let title = hero.title;
  let titleHighlight = hero.titleHighlight;

  if (personalization && city) {
    const match = matchBusiness(personalization.userTerm);
    title = buildHeroTitle(match, city);
    titleHighlight = personalization.heroHighlight;
  } else if (city) {
    title = `${hero.title.replace(" deveria estar", "")} em ${city} deveria estar`;
  }

  const subtitle = city
    ? hero.subtitle
        .replace("da sua região", `de ${city}`)
        .replace("sua região", city)
        .replace(
          "procedimentos estéticos",
          personalization
            ? `serviços de ${personalization.displayLabel.toLowerCase()}`
            : "procedimentos estéticos",
        )
    : hero.subtitle;

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute inset-0 radial-glow" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
      <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-16 sm:px-8 sm:pt-24 lg:pb-32 lg:pt-28">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="animate-fade-up">
            {personalization && (
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-segment/30 bg-segment-soft px-3 py-1.5 text-xs font-medium text-segment">
                <Check className="h-3 w-3" strokeWidth={3} />
                {personalization.displayLabel}
                {city && ` · ${city}`}
              </div>
            )}
            {!personalization && city && (
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-segment/30 bg-segment-soft px-3 py-1.5 text-xs font-medium text-segment">
                <Check className="h-3 w-3" strokeWidth={3} />
                Análise para {city}
              </div>
            )}
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-brand" />
              {hero.badge}
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-[64px]">
              {title} <span className="text-brand">{titleHighlight}</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground text-balance sm:text-lg">
              {subtitle}
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#diagnostico"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-brand transition-all hover:scale-[1.02] hover:shadow-brand-lg"
              >
                {hero.ctaLabel}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>

            <ul className="mt-8 grid grid-cols-1 gap-2.5 text-sm text-muted-foreground sm:grid-cols-2">
              {hero.trustItems.map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-soft">
                    <Check className="h-2.5 w-2.5 text-brand" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <HeroVisual
            monthlySearches={hero.monthlySearches}
            city={city}
            visual={visual}
            segmentIcon={config.icon}
          />
        </div>
      </div>
    </section>
  );
}

function HeroVisual({
  monthlySearches,
  city,
  visual,
  segmentIcon: SegmentIcon,
}: {
  monthlySearches: string;
  city?: string;
  visual: ReturnType<typeof getSegmentVisual>;
  segmentIcon: SegmentConfig["icon"];
}) {
  const steps = [
    { icon: Users, label: "Demanda", sub: city ? `pessoas em ${city}` : "pessoas com intenção" },
    { icon: Search, label: "Busca", sub: "no Google" },
    { icon: Eye, label: "Visibilidade", sub: "primeiros resultados" },
    { icon: MessageSquare, label: "Contato", sub: "nova oportunidade" },
  ];

  return (
    <div className="relative animate-fade-up [animation-delay:120ms]">
      {/* Segment hero image */}
      <div className="relative mb-4 overflow-hidden rounded-2xl border border-border shadow-2xl">
        <img
          src={visual.heroImage}
          alt={visual.heroImageAlt}
          className="aspect-[16/10] w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-segment/30 bg-segment-soft backdrop-blur-sm">
              <SegmentIcon className="h-4 w-4 text-segment" strokeWidth={2} />
            </div>
            <span className="text-xs font-medium text-foreground/90">{visual.overlayLabel}</span>
          </div>
          <span className="rounded-full border border-brand/30 bg-brand-soft/80 px-2.5 py-1 font-mono text-[10px] font-semibold text-brand backdrop-blur-sm">
            LIVE
          </span>
        </div>
      </div>

      {/* Dashboard panel */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-surface to-background p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse-dot rounded-full bg-brand" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Painel de demanda local
            </span>
          </div>
          <span className="font-mono text-xs text-muted-foreground">ANÁLISE</span>
        </div>

        <div className="space-y-3">
          {steps.map((s, i) => (
            <div key={s.label} className="group relative">
              <div className="flex items-center gap-4 rounded-xl border border-border bg-surface-elevated/60 px-4 py-3.5 transition-all hover:border-brand/40 hover:shadow-[0_0_20px_-6px] hover:shadow-brand/20">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                  <s.icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-semibold text-foreground">{s.label}</span>
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
            <span className="text-muted-foreground">
              Pesquisas mensais{city ? ` — ${city}` : ""}
            </span>
            <span className="font-mono font-semibold text-brand">{monthlySearches}</span>
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
