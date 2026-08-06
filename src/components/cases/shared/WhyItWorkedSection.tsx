import type { CaseSystemFlowStep, CaseInsightItem } from "@/types/case";
import { CaseBody, CaseEyebrow, CaseHeading, CaseReveal, CaseSection } from "./CaseSection";
import { InsightGrid } from "./InsightGrid";
import { SystemFlow } from "./SystemFlow";

interface WhyItWorkedSectionProps {
  id?: string;
  title?: string;
  intro?: string;
  items: CaseInsightItem[];
  systemFlow?: CaseSystemFlowStep[];
  systemFlowIntro?: string;
}

export function WhyItWorkedSection({
  id = "como-conseguimos",
  title = "Como conseguimos",
  intro,
  items,
  systemFlow,
  systemFlowIntro,
}: WhyItWorkedSectionProps) {
  if (items.length === 0) return null;

  return (
    <CaseSection id={id} variant="elevated" className="py-24 sm:py-32 lg:py-40">
      <CaseReveal className="mx-auto max-w-2xl text-center">
        <CaseEyebrow>Por que funcionou</CaseEyebrow>
        <CaseHeading>{title}</CaseHeading>
        {intro && <CaseBody className="mx-auto mt-6 max-w-xl">{intro}</CaseBody>}
      </CaseReveal>

      {systemFlow && systemFlow.length > 0 && (
        <CaseReveal delay={0.05} className="mx-auto mt-10 max-w-6xl px-0 sm:mt-12">
          <div className="text-center">
            <CaseEyebrow>O fluxo</CaseEyebrow>
            {systemFlowIntro && (
              <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
                {systemFlowIntro}
              </p>
            )}
          </div>
          <SystemFlow steps={systemFlow} />
        </CaseReveal>
      )}

      <InsightGrid items={items} className="mt-14 lg:mt-16" />
    </CaseSection>
  );
}
