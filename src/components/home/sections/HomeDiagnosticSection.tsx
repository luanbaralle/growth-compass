import { GuidedDiagnostic } from "@/components/hub/GuidedDiagnostic";
import { DiagnosticMascot } from "@/components/home/shared/DiagnosticMascot";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function HomeDiagnosticSection() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent" />

      <div className="mx-auto max-w-5xl px-5 pb-10 pt-16 sm:px-8 sm:pb-12 sm:pt-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center sm:gap-6 lg:max-w-[44rem] lg:flex-row lg:items-center lg:gap-8 lg:text-left">
          <DiagnosticMascot className="shrink-0" />

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand/80">
              Diagnóstico Inteligente
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-[1.12] tracking-tight text-balance sm:mt-4 sm:text-4xl">
              Descubra onde sua empresa está deixando dinheiro na mesa.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:mt-4 sm:text-lg">
              Em menos de um minuto analisamos seu mercado e mostramos as principais oportunidades
              para crescer.
            </p>
            <Link
              to="/diagnostico"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand/80"
            >
              Conhecer o Diagnóstico Inteligente
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <GuidedDiagnostic variant="home" />
    </div>
  );
}
