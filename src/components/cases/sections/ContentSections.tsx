import { hasItems } from "@/lib/cases/visibility";
import type { Case } from "@/types/case";
import { CaseCardsBlock, CaseFAQBlock, CaseQuotesBlock } from "./shared/CaseBlockSection";

interface ContentSectionsProps {
  caseData: Case;
}

export function ContentSections({ caseData }: ContentSectionsProps) {
  const c = caseData.content;
  if (!c) return null;

  return (
    <>
      {hasItems(c.quotes) && <CaseQuotesBlock id="citacoes" quotes={c.quotes} />}

      {hasItems(c.curiosities) && (
        <CaseCardsBlock
          id="curiosidades"
          eyebrow="Curiosidades"
          title="Detalhes que contam história"
          cards={c.curiosities!.map((item) => ({
            title: item.title,
            description: item.description,
          }))}
          variant="elevated"
          columns={3}
        />
      )}

      {hasItems(c.faqs) && <CaseFAQBlock id="faqs" faqs={c.faqs} />}
    </>
  );
}
