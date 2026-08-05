import {
  StorySection,
  type StorySectionVariant,
} from "@/components/cases/premium/primitives/StorySection";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface CasePremiumSectionProps {
  /** Anchor id for in-page navigation */
  id?: string;
  /** Storyboard reference for QA */
  storyboardId?: string;
  variant?: StorySectionVariant;
  className?: string;
  containerClassName?: string;
  fullBleed?: boolean;
  children: ReactNode;
}

/**
 * Section wrapper for premium case components.
 * Applies vertical rhythm and container constraints from the design language.
 */
export function CasePremiumSection({
  id,
  storyboardId,
  variant = "default",
  className,
  containerClassName,
  fullBleed = false,
  children,
}: CasePremiumSectionProps) {
  if (!id) {
    return (
      <div className={cn("relative", className)}>
        <div
          className={cn(
            fullBleed ? "w-full" : "mx-auto max-w-7xl px-5 sm:px-8",
            containerClassName,
          )}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <StorySection
      id={id}
      storyboardId={storyboardId}
      variant={variant}
      className={className}
      containerClassName={containerClassName}
      fullBleed={fullBleed}
    >
      {children}
    </StorySection>
  );
}

/** Standard vertical padding for premium case sections */
export const CASE_SECTION_Y = "py-24 sm:py-32";
