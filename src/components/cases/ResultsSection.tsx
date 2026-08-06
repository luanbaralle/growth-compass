import type { CaseMetric, CaseTestimonial } from "@/types/case";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { CaseEyebrow, CaseHeading, CaseReveal, CaseSection } from "./shared/CaseSection";
import { fadeUp, staggerContainer, viewportOnce } from "./shared/motion";

interface ResultsSectionProps {
  metrics: CaseMetric[];
  testimonial?: CaseTestimonial;
  deliverables?: string[];
  intro?: string;
}

function MetricCard({ metric, index }: { metric: CaseMetric; index: number }) {
  const isFeatured = index === 0;

  return (
    <motion.div
      variants={fadeUp}
      className={
        isFeatured
          ? "relative col-span-2 overflow-hidden rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/10 via-surface/40 to-surface/20 p-8 sm:col-span-2 lg:col-span-2 lg:row-span-2 lg:p-12"
          : "rounded-2xl border border-white/[0.06] bg-surface/30 p-6 backdrop-blur-sm transition-colors hover:border-white/[0.1]"
      }
    >
      {isFeatured && (
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-brand/10 blur-3xl"
          aria-hidden
        />
      )}
      <p
        className={
          isFeatured
            ? "font-display text-5xl font-bold tracking-tighter text-brand sm:text-6xl lg:text-7xl"
            : "text-3xl font-bold tracking-tight text-brand sm:text-4xl"
        }
      >
        {metric.value}
      </p>
      <p
        className={
          isFeatured
            ? "mt-3 text-sm uppercase tracking-[0.2em] text-muted-foreground sm:text-base"
            : "mt-2 text-xs uppercase tracking-wider text-muted-foreground"
        }
      >
        {metric.label}
      </p>
      {metric.context && (
        <p
          className={
            isFeatured
              ? "mt-4 text-sm leading-relaxed text-muted-foreground/80 sm:text-base"
              : "mt-3 text-xs leading-relaxed text-muted-foreground/75"
          }
        >
          {metric.context}
        </p>
      )}
      {isFeatured && (
        <span className="mt-6 inline-flex rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-brand">
          Destaque
        </span>
      )}
    </motion.div>
  );
}

export function ResultsSection({ metrics, testimonial, deliverables = [], intro }: ResultsSectionProps) {
  return (
    <CaseSection className="relative py-24 sm:py-32 lg:py-40">
      {/* Background accent */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent"
        aria-hidden
      />

      <CaseReveal className="mx-auto max-w-2xl text-center">
        <CaseEyebrow>Resultados</CaseEyebrow>
        <CaseHeading>Impacto mensurável</CaseHeading>
        {intro && (
          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">{intro}</p>
        )}
      </CaseReveal>

      {/* Metrics grid — bento layout */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
        className="mt-16 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5"
      >
        {metrics.map((metric, index) => (
          <MetricCard key={metric.label} metric={metric} index={index} />
        ))}
      </motion.div>

      {/* Deliverables checklist as impact badges */}
      {deliverables.length > 0 && (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="mt-16 flex flex-wrap justify-center gap-3"
        >
          {deliverables.map((item) => (
            <motion.span
              key={item}
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-surface/40 px-4 py-2 text-sm text-muted-foreground backdrop-blur-sm"
            >
              <Check className="h-3.5 w-3.5 text-brand" />
              {item}
            </motion.span>
          ))}
        </motion.div>
      )}

      {/* Testimonial */}
      {testimonial && (
        <CaseReveal delay={0.2} className="mt-24">
          <blockquote className="relative mx-auto max-w-4xl text-center">
            <div
              className="pointer-events-none absolute -top-8 left-1/2 h-16 w-16 -translate-x-1/2 rounded-full bg-brand/5 blur-2xl"
              aria-hidden
            />
            <p className="font-display text-2xl font-medium leading-snug tracking-tight sm:text-3xl lg:text-4xl lg:leading-[1.2]">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
            <footer className="mt-8 flex flex-col items-center gap-1">
              <cite className="not-italic font-semibold text-foreground">{testimonial.author}</cite>
              {testimonial.role && (
                <span className="text-sm text-muted-foreground">{testimonial.role}</span>
              )}
            </footer>
          </blockquote>
        </CaseReveal>
      )}
    </CaseSection>
  );
}
