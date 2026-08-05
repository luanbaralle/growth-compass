import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  description: string;
  primaryCta?: { label: string; href: string; external?: boolean };
  secondaryCta?: { label: string; href: string };
  badge?: string;
  breadcrumbs?: ReactNode;
  className?: string;
}

export function PageHero({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  badge,
  breadcrumbs,
  className,
}: PageHeroProps) {
  return (
    <section className={cn("relative overflow-hidden border-b border-border/60", className)}>
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.72_0.19_48_/_0.12),transparent_50%)]" />

      <div
        className={cn(
          "relative mx-auto max-w-7xl px-5 sm:px-8",
          breadcrumbs ? "pb-20 pt-6 sm:pt-8 lg:pb-28" : "py-20 lg:py-28",
        )}
      >
        {breadcrumbs}
        <div className="max-w-3xl">
          {badge && (
            <span className="mb-4 inline-flex items-center rounded-full border border-brand/30 bg-brand-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              {badge}
            </span>
          )}
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand/80">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-[3.25rem] lg:leading-[1.06]">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>

          {(primaryCta || secondaryCta) && (
            <div className="mt-9 flex flex-wrap items-center gap-3">
              {primaryCta && (
                <a
                  href={primaryCta.href}
                  target={primaryCta.external ? "_blank" : undefined}
                  rel={primaryCta.external ? "noopener noreferrer" : undefined}
                  className="group inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-brand transition-transform hover:scale-[1.01]"
                >
                  {primaryCta.label}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              )}
              {secondaryCta && (
                <a
                  href={secondaryCta.href}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand/30 hover:bg-surface"
                >
                  {secondaryCta.label}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
