import { hasText } from "@/lib/cases/visibility";
import type { Case } from "@/types/case";
import { CaseTextBlock } from "./shared/CaseBlockSection";

interface MarketingSectionsProps {
  caseData: Case;
}

export function MarketingSections({ caseData }: MarketingSectionsProps) {
  const m = caseData.marketing;
  if (!m) return null;

  return (
    <>
      {hasText(m.positioning) && (
        <CaseTextBlock
          id="posicionamento"
          eyebrow="Posicionamento"
          title="Como a marca se apresenta"
          body={m.positioning}
          variant="elevated"
        />
      )}

      {hasText(m.copyStrategy) && (
        <CaseTextBlock
          id="copy"
          eyebrow="Copy"
          title="Estratégia de conteúdo"
          body={m.copyStrategy}
        />
      )}

      {hasText(m.conversionStrategy) && (
        <CaseTextBlock
          id="conversao"
          eyebrow="Conversão"
          title="Estratégia de conversão"
          body={m.conversionStrategy}
          variant="dark"
          centered
        />
      )}
    </>
  );
}
