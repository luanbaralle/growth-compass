import {
  CaseConstraintMoment,
  CaseDecisionBlock,
  CaseStrategyCompare,
} from "@/components/cases/premium/decision";
import { Target } from "lucide-react";
import type { ReactNode } from "react";

function ShowcaseBlock({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-surface/10 p-6 sm:p-8">
      <h3 className="font-display text-lg font-semibold tracking-tight">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
      <div className="mt-6">{children}</div>
    </div>
  );
}

function ShowcaseSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight">{title}</h2>
        <p className="mt-2 max-w-3xl text-muted-foreground">{description}</p>
      </div>
      <div className="grid gap-6">{children}</div>
    </section>
  );
}

/**
 * Internal playground for Decision Language components (PR-001).
 * Not linked from production navigation.
 */
export function DecisionLanguageShowcase() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-white/[0.06] bg-surface/20 px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand/70">
            Playground · Dev only
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Decision Language
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            PR-001 — CaseDecisionBlock, CaseConstraintMoment, CaseStrategyCompare.
            Referência:{" "}
            <code className="text-sm text-foreground/80">docs/design/case-design-language.md</code>
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-20 px-5 py-16 sm:px-8 sm:py-24">
        <ShowcaseSection
          title="CaseDecisionBlock"
          description="Blocos editoriais de decisão estratégica. Variantes: default, inset (via asSection), embedded, com caption e ícone."
        >
          <ShowcaseBlock title="Variante default" description="Card centralizado max-w-2xl">
            <CaseDecisionBlock
              headline="Tratar o projeto como funil integrado — não como peças isoladas."
              body="Landing page, mídia, mensuração e acompanhamento precisavam funcionar juntos. Otimizar uma peça sem as outras seria ilusão de progresso."
            />
          </ShowcaseBlock>

          <ShowcaseBlock title="Com caption" description="Estrutura final após simplificação">
            <CaseDecisionBlock
              headline="Reduzir de cinco para três grupos de anúncios."
              body="Com orçamento limitado, fragmentar demais significa dados insuficientes, aprendizado lento e decisões baseadas em ruído."
              caption="EAD · Cursos · Pós-graduação"
            />
          </ShowcaseBlock>

          <ShowcaseBlock title="Com ícone opcional" description="Monocromático, line style">
            <CaseDecisionBlock
              icon={Target}
              headline="Priorizar a correção da mensuração antes de qualquer otimização de campanha."
              body="Otimizar com dados falsos amplifica erro. Primeiro garantir que o painel reflete a realidade; depois escalar."
            />
          </ShowcaseBlock>

          <ShowcaseBlock title="Variante embedded" description="Footer de CaseStrategyCompare">
            <CaseDecisionBlock
              variant="embedded"
              headline="Manter a estratégia de lance mesmo diante de um dia ruim."
              body="Já havia evidência suficiente de que a campanha performava. Reagir a um outlier com mudança estrutural seria trocar diagnóstico por pânico."
            />
          </ShowcaseBlock>

          <ShowcaseBlock title="Variante inset + asSection" description="Seção com fundo surface/10">
            <CaseDecisionBlock
              asSection
              sectionId="showcase-decision-inset"
              variant="inset"
              headline="Abrir a configuração de palavras-chave quando a cautela inicial não produzia volume."
              body="Contas novas precisam de dados para aprender. Sem entrega, não há otimização — só espera."
            />
          </ShowcaseBlock>

          <ShowcaseBlock title="Estado vazio" description="Props obrigatórias ausentes">
            <CaseDecisionBlock headline="" body="" />
          </ShowcaseBlock>
        </ShowcaseSection>

        <ShowcaseSection
          title="CaseConstraintMoment"
          description="Momento tipográfico de constraint econômico. Tipografia como único asset."
        >
          <ShowcaseBlock title="Variante elevated (padrão)" description="R$50/dia + fragmentos">
            <CaseConstraintMoment
              value="R$50"
              suffix="/dia"
              contextLines={["Conta nova.", "Zero histórico.", "Algoritmo conservador."]}
            />
          </ShowcaseBlock>

          <ShowcaseBlock title="Com grain sutil" description="Textura opcional @ ~4% opacity">
            <CaseConstraintMoment
              value="R$50"
              suffix="/dia"
              contextLines={["Conta nova.", "Zero histórico."]}
              showGrain
            />
          </ShowcaseBlock>

          <ShowcaseBlock title="Sem sufixo" description="Constraint de prazo ou equipe">
            <CaseConstraintMoment
              value="14 dias"
              contextLines={["Do zero ao funil validado."]}
              variant="default"
            />
          </ShowcaseBlock>

          <ShowcaseBlock title="asSection elevated" description="Wrapper com py-24 sm:py-32">
            <CaseConstraintMoment
              asSection
              sectionId="showcase-constraint-section"
              value="1 dev"
              contextLines={["LP, ads, mensuração, acompanhamento."]}
            />
          </ShowcaseBlock>

          <ShowcaseBlock title="Estado vazio" description="value ausente">
            <CaseConstraintMoment value="" />
          </ShowcaseBlock>
        </ShowcaseSection>

        <ShowcaseSection
          title="CaseStrategyCompare"
          description="Comparativo conceitual rejected vs chosen. Footer fundido com decisão ou caption."
        >
          <ShowcaseBlock title="Comparativo básico" description="Split 50/50 sem footer">
            <CaseStrategyCompare
              eyebrow="Estrutura"
              title="Cinco ou três?"
              intro="Com R$50 por dia, cada decisão de estrutura importa. Cobrir terreno e aprender rápido são coisas diferentes."
              rejected={{
                label: "5 grupos",
                state: "Fragmentado · Dados insuficientes",
              }}
              chosen={{
                label: "3 grupos",
                state: "Concentrado · Validação possível",
              }}
            />
          </ShowcaseBlock>

          <ShowcaseBlock
            title="Com footer decision (fundido)"
            description="CaseDecisionBlock embedded — padrão storyboard UNIP"
          >
            <CaseStrategyCompare
              eyebrow="Estrutura"
              title="Cinco ou três?"
              intro="Com R$50 por dia, cada decisão de estrutura importa."
              rejected={{
                label: "5 grupos",
                state: "Fragmentado · Dados insuficientes",
                blockCount: 5,
              }}
              chosen={{
                label: "3 grupos",
                state: "Concentrado · Validação possível",
                blockCount: 3,
              }}
              footer={{
                type: "decision",
                headline: "Reduzir de cinco para três grupos de anúncios.",
                body: "Com orçamento limitado, fragmentar demais significa dados insuficientes e aprendizado lento.",
                caption: "EAD · Cursos · Pós-graduação",
              }}
            />
          </ShowcaseBlock>

          <ShowcaseBlock title="Com footer caption" description="Caption única sem decision card">
            <CaseStrategyCompare
              title="MVP ou site completo?"
              intro="Prazo e budget tornavam escopo total inviável na primeira fase."
              rejected={{ label: "12 páginas", state: "Escopo diluído · Entrega lenta" }}
              chosen={{ label: "2 páginas", state: "Foco · Validação rápida" }}
              footer={{ type: "caption", caption: "Home · Página de conversão" }}
            />
          </ShowcaseBlock>

          <ShowcaseBlock
            title="chosenFirstOnMobile"
            description="Escolha aparece primeiro no stack mobile"
          >
            <CaseStrategyCompare
              title="Fragmentado vs concentrado"
              rejected={{ label: "Amplo", state: "Volume insuficiente por grupo" }}
              chosen={{ label: "Focado", state: "Aprendizado acelerado" }}
              chosenFirstOnMobile
            />
          </ShowcaseBlock>

          <ShowcaseBlock title="asSection" description="Wrapper de seção completo">
            <CaseStrategyCompare
              asSection
              sectionId="showcase-strategy-section"
              eyebrow="Estrutura"
              title="Cinco ou três?"
              rejected={{ label: "5 grupos", state: "Fragmentado" }}
              chosen={{ label: "3 grupos", state: "Concentrado" }}
            />
          </ShowcaseBlock>

          <ShowcaseBlock title="Estado vazio" description="title ou sides ausentes">
            <CaseStrategyCompare
              title=""
              rejected={{ label: "", state: "" }}
              chosen={{ label: "3 grupos", state: "Concentrado" }}
            />
          </ShowcaseBlock>
        </ShowcaseSection>
      </main>
    </div>
  );
}
