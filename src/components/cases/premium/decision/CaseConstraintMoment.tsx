import { CasePremiumEmptyState } from "@/components/cases/premium/shared/CasePremiumEmptyState";
import {
  CASE_SECTION_Y,
  CasePremiumSection,
} from "@/components/cases/premium/shared/CasePremiumSection";
import { cn } from "@/lib/utils";
import type { CaseConstraintMomentProps } from "./types";

/**
 * Creates economic tension by foregrounding a resource constraint.
 *
 * @see docs/design/case-design-language.md — CaseConstraintMoment
 *
 * @example
 * ```tsx
 * <CaseConstraintMoment
 *   value="R$50"
 *   suffix="/dia"
 *   contextLines={["Conta nova.", "Zero histórico.", "Algoritmo conservador."]}
 *   asSection
 * />
 * ```
 */
export function CaseConstraintMoment({
  value,
  suffix,
  contextLines = [],
  variant = "elevated",
  showGrain = false,
  className,
  asSection = false,
  sectionId,
}: CaseConstraintMomentProps) {
  const isEmpty = !value?.trim();

  const content = isEmpty ? (
    <CasePremiumEmptyState
      componentName="CaseConstraintMoment"
      message="Informe value para renderizar o momento de constraint."
      className="min-h-[40vh]"
    />
  ) : (
    <div
      className={cn(
        "relative mx-auto flex min-h-[60vh] max-h-[80vh] max-w-3xl flex-col items-center justify-center text-center",
        className,
      )}
    >
      {showGrain && (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
          aria-hidden
        />
      )}

      <p className="font-display text-7xl font-bold tracking-[-0.04em] sm:text-8xl lg:text-9xl">
        {value}
        {suffix && (
          <span className="ml-1 text-2xl font-semibold text-muted-foreground sm:text-3xl">
            {suffix}
          </span>
        )}
      </p>

      {contextLines.length > 0 && (
        <ul className="mt-10 space-y-2">
          {contextLines.map((line) => (
            <li key={line} className="text-base text-muted-foreground sm:text-lg">
              {line}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  if (!asSection) {
    return content;
  }

  return (
    <CasePremiumSection
      id={sectionId}
      variant={variant === "elevated" ? "elevated" : "default"}
      className={cn(CASE_SECTION_Y, "flex items-center")}
    >
      {content}
    </CasePremiumSection>
  );
}
