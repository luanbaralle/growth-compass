import { hasItems, hasText } from "@/lib/cases/visibility";
import type { Case } from "@/types/case";
import {
  CaseCardsBlock,
  CaseChipListBlock,
  CaseTextBlock,
} from "./shared/CaseBlockSection";

interface DevelopmentSectionsProps {
  caseData: Case;
}

export function DevelopmentSections({ caseData }: DevelopmentSectionsProps) {
  const d = caseData.development;
  if (!d) return null;

  return (
    <>
      {hasText(d.architecture) && (
        <CaseTextBlock
          id="arquitetura"
          eyebrow="Arquitetura"
          title="Como o sistema foi construído"
          body={d.architecture}
          variant="dark"
        />
      )}

      {hasItems(d.integrations) && (
        <CaseCardsBlock
          id="integracoes"
          eyebrow="Integrações"
          title="Conexões & APIs"
          cards={d.integrations!.map((i) => ({
            title: i.name,
            description: i.description,
            meta: i.purpose,
          }))}
          columns={2}
        />
      )}

      {hasItems(d.performanceOptimizations) && (
        <CaseChipListBlock
          id="performance"
          eyebrow="Performance"
          title="Otimizações"
          items={d.performanceOptimizations}
          variant="elevated"
        />
      )}

      {hasItems(d.accessibility) && (
        <CaseChipListBlock
          id="acessibilidade"
          eyebrow="Acessibilidade"
          title="Inclusão & WCAG"
          items={d.accessibility}
        />
      )}

      {hasItems(d.seo) && (
        <CaseChipListBlock
          id="seo"
          eyebrow="SEO"
          title="Otimização para busca"
          items={d.seo}
          variant="dark"
        />
      )}
    </>
  );
}
