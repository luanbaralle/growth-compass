import { HeroManifestoMarquee } from "@/components/home/shared/HeroManifestoMarquee";
import { HeroTypewriter } from "@/components/home/shared/HeroTypewriter";
import heroVisual from "@/assets/hero-visual.png";
import { heroChecklist } from "@/lib/home/content";
import { ArrowRight, Check } from "lucide-react";

export function HomeHeroSection() {
  return (
    <section
      id="top"
      className="relative flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden border-b border-border/60"
    >
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className="absolute inset-0">
          <img
            src={heroVisual}
            alt=""
            width={1672}
            height={941}
            decoding="async"
            fetchPriority="high"
            draggable={false}
            className="h-full w-full object-cover object-[50%_72%] sm:object-[50%_44%]"
          />
          <div className="absolute inset-0 bg-background/55 sm:bg-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_28%,oklch(0.145_0_0_/_0.92),oklch(0.145_0_0_/_0.72)_48%,transparent_100%)] sm:bg-[radial-gradient(ellipse_90%_70%_at_50%_42%,oklch(0.145_0_0_/_0.78),oklch(0.145_0_0_/_0.42)_55%,transparent_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,oklch(0.145_0_0_/_0.72),transparent_55%)] sm:bg-[linear-gradient(to_top,oklch(0.145_0_0_/_0.55),transparent_42%)]" />
        </div>

        <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 py-8 text-center sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="mx-auto w-full max-w-3xl lg:max-w-4xl">
            <div className="animate-fade-up inline-flex max-w-full items-center gap-2 rounded-full border border-brand/20 bg-brand-soft/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand backdrop-blur-sm sm:px-3.5 sm:py-1.5 sm:text-[11px] sm:tracking-[0.2em]">
              <span className="sm:hidden">Raise One • Growth + Tech</span>
              <span className="hidden sm:inline">Raise One • Marketing + Tecnologia + IA</span>
            </div>

            <h1 className="animate-fade-up mt-4 text-[1.75rem] font-bold leading-[1.16] tracking-tight text-pretty sm:mt-6 sm:text-4xl sm:leading-[1.04] sm:text-balance md:text-5xl lg:text-[3.35rem] [animation-delay:80ms]">
              Construímos o próximo{" "}
              <br className="sm:hidden" />
              passo do <span className="text-brand">crescimento</span>{" "}
              <br className="sm:hidden" />
              da sua empresa.
            </h1>

            <p className="animate-fade-up mx-auto mt-4 max-w-md text-[0.9375rem] leading-[1.65] text-muted-foreground sm:mt-6 sm:max-w-xl sm:text-base sm:leading-relaxed md:text-lg [animation-delay:140ms]">
              <span className="sm:hidden">
                Estratégia, tecnologia e execução para conquistar clientes, lançar
                empreendimentos e escalar operações.
              </span>
              <span className="hidden sm:inline">
                Não importa se o desafio é conquistar clientes, lançar um empreendimento,
                automatizar processos ou desenvolver uma plataforma.
              </span>
            </p>

            <div className="animate-fade-up mt-5 [animation-delay:180ms]">
              <HeroTypewriter />
            </div>

            <ul className="animate-fade-up mt-5 flex flex-wrap justify-center gap-2 sm:mt-7 sm:gap-x-5 sm:gap-y-2 [animation-delay:220ms]">
              {heroChecklist.map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-surface/50 px-3 py-1.5 text-xs text-foreground backdrop-blur-sm sm:border-transparent sm:bg-transparent sm:px-0 sm:py-0 sm:text-sm"
                >
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand/15 text-brand sm:h-5 sm:w-5">
                    <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="animate-fade-up mx-auto mt-6 flex w-full max-w-sm flex-col gap-2.5 sm:mt-8 sm:max-w-none sm:flex-row sm:justify-center sm:gap-3 [animation-delay:260ms]">
              <a
                href="#solucoes"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-brand transition-transform hover:scale-[1.01] sm:w-auto"
              >
                Conhecer a Raise One
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#diagnostico"
                className="inline-flex w-full items-center justify-center rounded-full border border-border bg-surface/70 px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:border-brand/40 hover:text-brand sm:w-auto"
              >
                Analisar meu mercado
              </a>
            </div>
          </div>
        </div>
      </div>

      <HeroManifestoMarquee />
    </section>
  );
}
