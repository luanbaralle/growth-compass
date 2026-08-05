import { hasItems, hasText } from "@/lib/cases/visibility";
import type { Case } from "@/types/case";
import {
  CaseCardsBlock,
  CaseGalleryBlock,
  CaseListBlock,
  CaseTextBlock,
  CaseTimelineBlock,
} from "./shared/CaseBlockSection";

function hasOpeningStory(s: Case["storytelling"]): boolean {
  if (!s) return false;
  return (
    hasText(s.context) ||
    hasText(s.challenge) ||
    hasText(s.strategy) ||
    hasItems(s.decisions) ||
    hasItems(s.timeline) ||
    hasItems(s.processGallery)
  );
}

function hasClosingStory(s: Case["storytelling"]): boolean {
  if (!s) return false;
  return hasText(s.impact) || hasItems(s.lessonsLearned) || hasItems(s.backstage);
}

/** Contexto, estratégia e processo — início da narrativa */
export function StorytellingOpeningSections({ caseData }: { caseData: Case }) {
  const s = caseData.storytelling;
  if (!hasOpeningStory(s)) return null;

  return (
    <>
      {hasText(s!.context) && (
        <CaseTextBlock
          id="contexto"
          eyebrow="Contexto"
          title="O cenário"
          body={s!.context!}
          variant="elevated"
          centered
        />
      )}

      {hasText(s!.challenge) && (
        <CaseTextBlock
          id="narrativa-desafio"
          eyebrow="Narrativa"
          title="O desafio em profundidade"
          body={s!.challenge!}
        />
      )}

      {hasText(s!.strategy) && (
        <CaseTextBlock
          id="estrategia"
          eyebrow="Estratégia"
          title="Como pensamos a solução"
          body={s!.strategy!}
          variant="dark"
        />
      )}

      {hasItems(s!.decisions) && (
        <CaseCardsBlock
          id="decisoes"
          eyebrow="Decisões"
          title="Escolhas que definiram o projeto"
          cards={s!.decisions!.map((d) => ({
            title: d.title,
            description: d.description,
            meta: d.rationale,
          }))}
          columns={2}
        />
      )}

      {hasItems(s!.timeline) && (
        <CaseTimelineBlock
          id="cronologia"
          eyebrow="Cronologia"
          title="Linha do tempo"
          events={s!.timeline!}
        />
      )}

      {hasItems(s!.processGallery) && (
        <CaseGalleryBlock
          id="processo-galeria"
          eyebrow="Processo"
          title="Por trás das telas"
          items={s!.processGallery!}
          variant="elevated"
        />
      )}
    </>
  );
}

/** Impacto, aprendizados e bastidores — fechamento da narrativa */
export function StorytellingClosingSections({ caseData }: { caseData: Case }) {
  const s = caseData.storytelling;
  if (!hasClosingStory(s)) return null;

  return (
    <>
      {hasText(s!.impact) && (
        <CaseTextBlock
          id="impacto"
          eyebrow="Impacto"
          title="O efeito no negócio"
          body={s!.impact!}
          centered
        />
      )}

      {hasItems(s!.lessonsLearned) && (
        <CaseListBlock
          id="licoes"
          eyebrow="Aprendizados"
          title="Lições do projeto"
          items={s!.lessonsLearned!}
          variant="dark"
        />
      )}

      {hasItems(s!.backstage) && (
        <CaseCardsBlock
          id="backstage"
          eyebrow="Backstage"
          title="Bastidores"
          cards={s!.backstage!.map((b) => ({
            title: b.title,
            description: b.description,
            image: b.image,
          }))}
          columns={3}
        />
      )}
    </>
  );
}

/** @deprecated Use StorytellingOpeningSections + StorytellingClosingSections */
export function StorytellingSections({ caseData }: { caseData: Case }) {
  return (
    <>
      <StorytellingOpeningSections caseData={caseData} />
      <StorytellingClosingSections caseData={caseData} />
    </>
  );
}
