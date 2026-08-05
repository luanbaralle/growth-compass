import type { Case } from "@/types/case";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeUp, viewportOnce } from "./shared/motion";

interface CaseCTAProps {
  caseData: Case;
}

export function CaseCTA({ caseData }: CaseCTAProps) {
  const headline =
    caseData.marketing?.positioning ?? `Quer resultados como ${caseData.title}?`;
  const subheadline =
    caseData.marketing?.conversionStrategy ??
    `Cada projeto começa com um diagnóstico gratuito.`;
  const primaryLabel = caseData.marketing?.ctaPrimary ?? "Fazer diagnóstico gratuito";

  return (
    <section className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
      {/* Full-width premium background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/60 to-background" />
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, oklch(0.72 0.19 48 / 0.12), transparent 55%)",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/20 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-surface/40 px-8 py-20 text-center backdrop-blur-xl sm:px-16 sm:py-28 lg:px-24"
        >
          {/* Inner glow */}
          <div
            className="pointer-events-none absolute -left-1/4 top-0 h-full w-1/2 bg-brand/5 blur-[100px]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-1/4 bottom-0 h-full w-1/2 bg-indigo-500/5 blur-[100px]"
            aria-hidden
          />

          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand/70">
            Próximo passo
          </p>

          <h2 className="relative mt-6 font-display text-3xl font-bold tracking-[-0.03em] text-balance sm:text-4xl lg:text-5xl lg:leading-[1.08]">
            {headline}
          </h2>

          <p className="relative mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {subheadline}
          </p>

          <div className="relative mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/diagnostico"
              className="group inline-flex items-center gap-2.5 rounded-full bg-brand px-8 py-4 text-sm font-semibold text-primary-foreground shadow-[0_0_50px_-10px_oklch(0.72_0.19_48/0.5)] transition-all hover:shadow-[0_0_60px_-8px_oklch(0.72_0.19_48/0.6)] hover:brightness-110"
            >
              {primaryLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/programa-de-crescimento"
              className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-8 py-4 text-sm font-semibold backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/[0.08]"
            >
              Programa de Crescimento
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
