import { StoryBody, StoryEyebrow, StoryHeading } from "@/components/cases/premium/primitives/StorySection";
import { CasePremiumEmptyState } from "@/components/cases/premium/shared/CasePremiumEmptyState";
import {
  CASE_SECTION_Y,
  CasePremiumSection,
} from "@/components/cases/premium/shared/CasePremiumSection";
import { cn } from "@/lib/utils";
import { CaseDecisionBlock } from "./CaseDecisionBlock";
import { CaseStrategyCompareVisual } from "./CaseStrategyCompareVisual";
import type { CaseStrategyCompareProps, CaseStrategyCompareSide } from "./types";

function CompareSideCard({
  side,
  role,
  className,
}: {
  side: CaseStrategyCompareSide;
  role: "rejected" | "chosen";
  className?: string;
}) {
  const isRejected = role === "rejected";
  const blockCount = side.blockCount ?? (isRejected ? 5 : 3);

  return (
    <div
      className={cn(
        "rounded-2xl border p-8",
        isRejected
          ? "border-white/[0.06] bg-surface/20 opacity-60"
          : "border-brand/30 bg-surface/30 opacity-100",
        className,
      )}
    >
      <p className="font-display text-2xl font-bold">{side.label}</p>
      <p className="mt-3 text-sm text-muted-foreground">{side.state}</p>
      <div className="mt-6">
        {side.visual ?? (
          <CaseStrategyCompareVisual
            blockCount={blockCount}
            fragmented={isRejected}
          />
        )}
      </div>
    </div>
  );
}

function CompareFooter({ footer }: Pick<CaseStrategyCompareProps, "footer">) {
  if (!footer) return null;

  if (footer.type === "decision") {
    return (
      <div className="mt-16">
        <CaseDecisionBlock
          variant="embedded"
          label={footer.label}
          headline={footer.headline}
          body={footer.body}
          caption={footer.caption}
        />
      </div>
    );
  }

  if (footer.type === "caption") {
    return (
      <p className="mt-8 text-center text-xs uppercase tracking-wider text-muted-foreground/70">
        {footer.caption}
      </p>
    );
  }

  return <div className="mt-16">{footer.content}</div>;
}

/**
 * Visualizes strategic simplification as a conceptual before/after split.
 *
 * @see docs/design/case-design-language.md — CaseStrategyCompare
 *
 * @example
 * ```tsx
 * <CaseStrategyCompare
 *   eyebrow="Estrutura"
 *   title="Cinco ou três?"
 *   intro="Com R$50 por dia, cada decisão de estrutura importa."
 *   rejected={{ label: "5 grupos", state: "Fragmentado · Dados insuficientes" }}
 *   chosen={{ label: "3 grupos", state: "Concentrado · Validação possível" }}
 *   footer={{
 *     type: "decision",
 *     headline: "Reduzir de cinco para três grupos de anúncios.",
 *     body: "Com orçamento limitado, fragmentar demais significa dados insuficientes.",
 *     caption: "EAD · Cursos · Pós-graduação",
 *   }}
 * />
 * ```
 */
export function CaseStrategyCompare({
  eyebrow,
  title,
  intro,
  rejected,
  chosen,
  chosenFirstOnMobile = false,
  footer,
  className,
  asSection = false,
  sectionId,
}: CaseStrategyCompareProps) {
  const isEmpty =
    !title?.trim() ||
    !rejected?.label?.trim() ||
    !chosen?.label?.trim();

  const content = isEmpty ? (
    <CasePremiumEmptyState
      componentName="CaseStrategyCompare"
      message="Informe title, rejected e chosen para renderizar o comparativo."
      className="min-h-[320px]"
    />
  ) : (
    <div className={className}>
      {eyebrow && <StoryEyebrow>{eyebrow}</StoryEyebrow>}
      <StoryHeading as="h2">{title}</StoryHeading>
      {intro && <StoryBody className="max-w-2xl">{intro}</StoryBody>}

      <div
        className={cn(
          "mt-12 grid gap-6 sm:grid-cols-2",
          chosenFirstOnMobile && "flex flex-col-reverse sm:grid",
        )}
      >
        <CompareSideCard side={rejected} role="rejected" />
        <CompareSideCard side={chosen} role="chosen" />
      </div>

      <CompareFooter footer={footer} />
    </div>
  );

  if (!asSection) {
    return content;
  }

  return (
    <CasePremiumSection id={sectionId} className={CASE_SECTION_Y}>
      {content}
    </CasePremiumSection>
  );
}
