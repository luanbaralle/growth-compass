import { AnimatedStat } from "@/components/home/shared/AnimatedStat";
import heroVisual from "@/assets/hero-visual.png";
import { heroChecklist, heroStats } from "@/lib/home/content";
import { ArrowRight, Check } from "lucide-react";

export function HomeHeroSection() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-border/60">
      <div className="relative min-h-[min(920px,92vh)]">
        <div className="absolute inset-0">
          <img
            src={heroVisual}
            alt=""
            width={1672}
            height={941}
            decoding="async"
            fetchPriority="high"
            draggable={false}
            className="h-full w-full object-cover object-[72%_46%] sm:object-[74%_44%] lg:object-[76%_42%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.145_0_0)_0%,oklch(0.145_0_0_/_0.94)_38%,oklch(0.145_0_0_/_0.72)_52%,oklch(0.145_0_0_/_0.28)_68%,transparent_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,oklch(0.145_0_0_/_0.55),transparent_42%)]" />
        </div>

        <div className="relative mx-auto flex min-h-[min(920px,92vh)] max-w-7xl items-center px-5 py-16 sm:px-8 lg:py-20">
          <div className="max-w-2xl">
            <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-soft px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
              Raise One • Marketing + Tecnologia + IA
            </div>

            <h1 className="animate-fade-up mt-6 text-4xl font-bold leading-[1.04] tracking-tight text-balance sm:text-5xl lg:text-[3.35rem] [animation-delay:80ms]">
              Construímos o próximo passo do{" "}
              <span className="text-brand">crescimento</span> da sua empresa.
            </h1>

            <p className="animate-fade-up mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg [animation-delay:140ms]">
              Não importa se o desafio é conquistar clientes, lançar um empreendimento,
              automatizar processos ou desenvolver uma plataforma.
            </p>

            <div className="animate-fade-up mt-5 space-y-1 text-sm font-medium text-foreground sm:text-base [animation-delay:180ms]">
              <p>Criamos a estratégia.</p>
              <p>Desenvolvemos a tecnologia.</p>
              <p>Executamos o crescimento.</p>
            </div>

            <ul className="animate-fade-up mt-7 flex flex-wrap gap-x-5 gap-y-2 [animation-delay:220ms]">
              {heroChecklist.map((item) => (
                <li key={item} className="inline-flex items-center gap-2 text-sm text-foreground">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand/15 text-brand">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="animate-fade-up mt-9 flex flex-col gap-3 sm:flex-row [animation-delay:260ms]">
              <a
                href="#solucoes"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-brand transition-transform hover:scale-[1.01]"
              >
                Conhecer a Raise One
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#diagnostico"
                className="inline-flex items-center justify-center rounded-full border border-border bg-surface/60 px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:border-brand/40 hover:text-brand"
              >
                Analisar meu mercado
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-border/60 bg-background/85 backdrop-blur-sm">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-8 sm:grid-cols-4 sm:px-8 sm:py-10">
          {heroStats.map((stat) => (
            <AnimatedStat key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
