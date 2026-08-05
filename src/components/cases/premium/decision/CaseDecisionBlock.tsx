import { CasePremiumEmptyState } from "@/components/cases/premium/shared/CasePremiumEmptyState";
import {
  CASE_SECTION_Y,
  CasePremiumSection,
} from "@/components/cases/premium/shared/CasePremiumSection";
import { cn } from "@/lib/utils";
import type { CaseDecisionBlockProps } from "./types";

const variantStyles = {
  default: "mx-auto max-w-2xl",
  inset: "mx-auto max-w-2xl",
  embedded: "w-full max-w-none",
} as const;

/**
 * Registers an explicit strategic choice in a case narrative.
 *
 * @see docs/design/case-design-language.md — CaseDecisionBlock
 *
 * @example
 * ```tsx
 * <CaseDecisionBlock
 *   headline="Tratar o projeto como funil integrado — não como peças isoladas."
 *   body="Landing page, mídia, mensuração e acompanhamento precisavam funcionar juntos."
 * />
 * ```
 */
export function CaseDecisionBlock({
  headline,
  body,
  caption,
  label = "Decisão",
  variant = "default",
  icon: Icon,
  className,
  asSection = false,
  sectionId,
}: CaseDecisionBlockProps) {
  const isEmpty = !headline?.trim() && !body?.trim();

  const card = isEmpty ? (
    <CasePremiumEmptyState
      componentName="CaseDecisionBlock"
      message="Informe headline e body para renderizar o bloco de decisão."
    />
  ) : (
    <article
      className={cn(
        "rounded-2xl border border-brand/20 bg-surface/30 p-8 transition-colors sm:p-10",
        "hover:border-brand/40",
        variantStyles[variant],
        className,
      )}
    >
      <div className="flex items-start gap-3">
        {Icon && (
          <Icon
            className="mt-0.5 h-5 w-5 shrink-0 text-brand/80"
            strokeWidth={1.5}
            aria-hidden
          />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand">
            {label}
          </p>
          {headline?.trim() && (
            <h3 className="mt-4 text-lg font-semibold leading-snug tracking-tight sm:text-xl">
              {headline}
            </h3>
          )}
          {body?.trim() && (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {body}
            </p>
          )}
          {caption?.trim() && (
            <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground/70">
              {caption}
            </p>
          )}
        </div>
      </div>
    </article>
  );

  if (!asSection) {
    return card;
  }

  return (
    <CasePremiumSection
      id={sectionId}
      variant={variant === "inset" ? "inset" : "default"}
      className={CASE_SECTION_Y}
    >
      {card}
    </CasePremiumSection>
  );
}
