import { GuidedDiagnostic } from "@/components/hub/GuidedDiagnostic";

export function HomeDiagnosticSection() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent" />
      <div className="mx-auto max-w-4xl px-5 pb-2 pt-16 text-center sm:px-8 sm:pt-20">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand/80">
          Diagnóstico Inteligente
        </p>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          Descubra onde sua empresa está deixando dinheiro na mesa.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Em menos de um minuto analisamos seu mercado e mostramos as principais oportunidades
          para crescer.
        </p>
      </div>
      <GuidedDiagnostic variant="home" />
    </div>
  );
}
