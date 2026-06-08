import { Footer } from "@/components/landing/shared/Footer";
import { Logo } from "@/components/landing/shared/Logo";
import { Nav } from "@/components/landing/shared/Nav";
import { captureUtmFromUrl } from "@/lib/utm";
import { ChevronDown } from "lucide-react";
import { useEffect } from "react";
import { GuidedDiagnostic } from "./GuidedDiagnostic";

export function HubPage() {
  useEffect(() => {
    captureUtmFromUrl();
  }, []);
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Nav ctaHref="#diagnostico" ctaLabel="Analisar meu mercado" homeHref="/" />

      <section id="top" className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute inset-0 radial-glow" />
        <div className="relative mx-auto max-w-3xl px-5 pb-8 pt-16 text-center sm:px-8 sm:pt-20 lg:pt-24">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <Logo className="h-4 w-4" />
              Raise One — Crescimento para negócios locais
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-[52px]">
              Seu negócio deveria estar{" "}
              <span className="text-brand">recebendo mais clientes.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Todos os dias pessoas pesquisam no Google por produtos e serviços como os seus.
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-base font-bold leading-relaxed text-foreground sm:text-lg">
              Descubra se você está capturando essa demanda ou deixando clientes para seus
              concorrentes.
            </p>

            <a
              href="#diagnostico"
              aria-label="Ir para o diagnóstico gratuito"
              className="mt-10 inline-flex animate-fade-up flex-col items-center text-brand/70 transition-colors hover:text-brand [animation-delay:350ms]"
            >
              <ChevronDown className="h-7 w-7 animate-nudge-down sm:h-8 sm:w-8" strokeWidth={2} />
            </a>
          </div>
        </div>
      </section>

      <GuidedDiagnostic />
      <Footer />
    </div>
  );
}
