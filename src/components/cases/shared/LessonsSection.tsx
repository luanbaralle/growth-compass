import type { CaseInsightItem } from "@/types/case";
import { CaseBody, CaseEyebrow, CaseHeading, CaseReveal, CaseSection } from "./CaseSection";
import { InsightGrid } from "./InsightGrid";

interface LessonsSectionProps {
  id?: string;
  title?: string;
  intro?: string;
  items: CaseInsightItem[];
}

export function LessonsSection({
  id = "aprendizados",
  title = "O que aprendemos",
  intro,
  items,
}: LessonsSectionProps) {
  if (items.length === 0) return null;

  return (
    <CaseSection id={id} className="py-24 sm:py-32 lg:py-40">
      <CaseReveal className="mx-auto max-w-2xl text-center">
        <CaseEyebrow>Consultoria</CaseEyebrow>
        <CaseHeading>{title}</CaseHeading>
        {intro && <CaseBody className="mx-auto mt-6 max-w-xl">{intro}</CaseBody>}
      </CaseReveal>
      <InsightGrid items={items} />
    </CaseSection>
  );
}
