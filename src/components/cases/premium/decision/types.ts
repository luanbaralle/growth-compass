import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/** Visual treatment for {@link CaseDecisionBlock} */
export type CaseDecisionBlockVariant = "default" | "inset" | "embedded";

/** Background treatment for {@link CaseConstraintMoment} */
export type CaseConstraintMomentVariant = "elevated" | "default";

/** One side of a {@link CaseStrategyCompare} split */
export interface CaseStrategyCompareSide {
  /** Short label — e.g. "5 grupos" */
  label: string;
  /** Consequence fragment — e.g. "Fragmentado · Dados insuficientes" */
  state: string;
  /**
   * Number of abstract blocks in the visual metaphor.
   * Defaults: rejected = 5, chosen = 3
   */
  blockCount?: number;
  /** Optional custom visual — replaces abstract block grid */
  visual?: ReactNode;
}

/** Footer merged into {@link CaseStrategyCompare} */
export type CaseStrategyCompareFooter =
  | {
      type: "decision";
      headline: string;
      body: string;
      caption?: string;
      label?: string;
    }
  | {
      type: "caption";
      caption: string;
    }
  | {
      type: "custom";
      content: ReactNode;
    };

export interface CaseDecisionBlockProps {
  /** Strategic choice headline — editorial max ~15 words */
  headline: string;
  /** Rationale — editorial max ~40 words */
  body: string;
  /** Optional structure caption — e.g. "EAD · Cursos · Pós-graduação" */
  caption?: string;
  /** Editorial label — defaults to "Decisão" */
  label?: string;
  /** Visual variant — see design language spec */
  variant?: CaseDecisionBlockVariant;
  /** Optional monochrome line icon */
  icon?: LucideIcon;
  className?: string;
  /** Wrap in premium section with vertical rhythm */
  asSection?: boolean;
  sectionId?: string;
}

export interface CaseConstraintMomentProps {
  /** Hero number or amount — e.g. "R$50", "14 dias" */
  value: string;
  /** Unit suffix — e.g. "/dia" */
  suffix?: string;
  /** 2–4 factual context fragments */
  contextLines?: string[];
  variant?: CaseConstraintMomentVariant;
  /** Subtle grain texture overlay */
  showGrain?: boolean;
  className?: string;
  asSection?: boolean;
  sectionId?: string;
}

export interface CaseStrategyCompareProps {
  eyebrow?: string;
  title: string;
  intro?: string;
  /** Rejected alternative — left column, visually subordinated */
  rejected: CaseStrategyCompareSide;
  /** Chosen path — right column, brand highlight */
  chosen: CaseStrategyCompareSide;
  /** Stack chosen side first on mobile */
  chosenFirstOnMobile?: boolean;
  /** Merged decision block or caption below the split */
  footer?: CaseStrategyCompareFooter;
  className?: string;
  asSection?: boolean;
  sectionId?: string;
}
