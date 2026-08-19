# Proposal Template Specification — R1 Growth V1 (Golden Template)

> **Objetivo:** Definir o formato fixo de proposta comercial da Raise One, inspirado na proposta UNIP (referência manual), para que o sistema **preencha** — não invente — a apresentação a partir do Commercial Blueprint aprovado.

> **Princípio:** Blueprint decide · Template apresenta · IA redige (dentro do contrato)

---

## 1. Separação de camadas

| Camada | Público | Função |
|--------|---------|--------|
| **Copilot** | Interno | Transcrição, evidências, intelligence |
| **Commercial Blueprint** | Interno (Luan/Vini) | Decisões comerciais, escopo, investimento, premissas, aprovação |
| **Proposal Engine** | Sistema | Blueprint aprovado → `ProposalContent` tipado |
| **R1 Proposal Template** | Cliente | Render HTML/visual fixo a partir de `ProposalContent` |

**Regra de ouro:** Nada de cobertura %, lacunas críticas, premissas internas ou status de aprovação aparece na proposta pública.

---

## 2. Template ID

```ts
id: "r1-growth-v1"
```

**Importante:** A UNIP é referência de **estrutura narrativa** (seções, ordem, blocos). A **identidade visual** permanece 100% Raise One (`R1PublicProposalPage`, tokens em `r1-tokens.ts` — fundo `#090909`, acento emerald).

Aplica a: `acceleration`, `acquisition`, `positioning` (arquétipos de crescimento comercial).

Arquétipos `custom_solution` e `structure` terão templates irmãos no futuro (`r1-custom-v1`, `r1-structure-v1`).

---

## 3. Seções fixas (ordem imutável)

| # | Key | Título UNIP (referência) | Título R1 genérico |
|---|-----|--------------------------|---------------------|
| — | `hero` | Projeto de Aceleração de Matrículas | Projeto de [Resultado] |
| 01 | `diagnosis` | Onde Estamos Hoje | Diagnóstico |
| 02 | `opportunity` | Pelo Que Somos Buscados | Oportunidade |
| 03 | `behavior` | Como o Cliente Decide | Comportamento |
| 04 | `mechanism` | Sistema de Aquisição | O Mecanismo |
| 05 | `strategy` | Estratégia | Como Vamos Atrair |
| 06 | `deliverables` | O Que Será Entregue | Entregáveis |
| 07 | `validation` | Do Investimento ao Resultado | Validação |
| 08 | `investment` | Investimento no Projeto | Investimento |
| 09 | `implementation` | Plano de Execução | Implementação |
| 10 | `next_steps` | Próximos Passos | Próximos Passos |

A ordem e existência das seções são **Fixed**. O conteúdo dentro de cada uma é **Dynamic** ou **AI-assisted**.

---

## 4. Contrato por seção

### 4.1 Hero — `Fixed structure, Dynamic content, AI-assisted thesis`

**Referência UNIP:**
- Título grande amarelo
- Subtítulo institucional
- Local/contexto
- 2–3 métricas de impacto (não métricas de diagnóstico interno)

**Contrato:**

```ts
interface ProposalHeroBlock {
  title: string;           // "Projeto de Aceleração Comercial"
  subtitle: string;        // "Plano Estratégico de Crescimento para Saúde & Cia"
  location?: string;       // "Caraguatatuba · SP" (opcional)
  thesis: string;          // "Transformando indicação em aquisição previsível."
  metrics: ProposalMetric[]; // max 3 — SEMPRE métricas de negócio, nunca cobertura %
}
```

**Fontes (Blueprint → Hero):**

| Campo | Origem |
|-------|--------|
| `title` | Arquétipo + playbook |
| `subtitle` | `company_name` + template copy |
| `thesis` | IA a partir de `diagnosis.problem` + `strategy.priority1` (aprovados) |
| `metrics` | Evidências do Copilot (anos mercado, volume contatos, frentes) — **manual override no Blueprint futuro** |

**Proibido na proposta:**
- `overallCoverage`, `knowledgeDepth`, `unknownsCount`
- "Proposta condicional" no eyebrow
- "X pontos a validar" como métrica de hero

---

### 4.2 Diagnóstico — `Fixed structure (cards), Dynamic content`

**Referência UNIP:** 5 cards + conclusão narrativa + barra visual opcional.

**Contrato:**

```ts
interface ProposalDiagnosisBlock {
  headline: string;                    // "Onde estamos hoje"
  conclusion: string;                // Frase-síntese comercial (1 parágrafo)
  cards: ProposalDiagnosisCard[];      // 3–5 cards
  // cards: { label, value, description? }
}
```

**Fontes:**
- `cards` ← `buildDiagnosisCards()` filtrado: só fatos aprovados no Blueprint
- `conclusion` ← IA ou template: problem + constraint → frase de desafio

**Saúde & Cia (exemplo de cards):**
1. Experiência local — 13,5 anos
2. Aquisição atual — dependência de indicação
3. Demanda — produtos pesquisáveis
4. Estrutura — capacidade limitada
5. Histórico digital — tentativas anteriores sem resultado

**Proibido:** bullets com "Principal problema:", "Restrição:" (formato interno).

---

### 4.3 Oportunidade — `Fixed structure, Dynamic blocks`

**Referência UNIP:** Keyword Planner screenshot + número hero (23.160 buscas).

**Contrato:**

```ts
interface ProposalOpportunityBlock {
  headline: string;
  narrative: string;
  blocks: ProposalBlock[];  // composição dinâmica — ver §6
}
```

**Blocos possíveis (0–N por proposta):**

| Block ID | Quando aparece | Dados |
|----------|----------------|-------|
| `SearchVolumeBlock` | Evidência de volume de busca | `demandKeywords[]` |
| `MarketDemandBlock` | Oportunidade textual sem dados | narrative |
| `AuthorityBlock` | Autoridade local forte | evidência Copilot |
| `ProductDemandBlock` | Múltiplos produtos/serviços | blueprint modules |
| `CompetitiveLandscapeBlock` | Concorrência mapeada | evidência (futuro) |

**Regra:** Se não há dados de Keyword Planner, **não inventar números**. Usar `MarketDemandBlock` narrativo.

---

### 4.4 Comportamento — `Fixed structure (journey), Dynamic steps`

**Referência UNIP:** 6 etapas horizontais (Necessidade → Matrícula).

**Contrato:**

```ts
interface ProposalBehaviorBlock {
  headline: string;
  steps: ProposalFunnelStep[];  // 5–7 etapas nomeadas para o segmento
}
```

**Saúde & Cia:**
Necessidade → Pesquisa Google → Encontra empresa → LP → WhatsApp → Atendimento → Proposta → Venda

**Fonte:** playbook params + `commercialPipeline` (sem métricas internas no description).

---

### 4.5 Mecanismo — `Fixed structure, semi-Fixed content`

**Referência UNIP:** Google → LP → WhatsApp → CRM/Venda + mockup mobile.

**Contrato:**

```ts
interface ProposalMechanismBlock {
  headline: string;
  narrative: string;
  flow: string[];                    // 4–5 componentes
  landingMockup?: ProposalLandingMockup;
  showMockup: boolean;               // false se LP existente sem redesign
}
```

**Fonte:** `data.modules` + `data.assets.existingLp`

---

### 4.6 Estratégia — `Fixed structure (numbered pillars), Dynamic content`

**Referência UNIP:** 3 frentes numeradas com bullets.

**Contrato:**

```ts
interface ProposalStrategyBlock {
  headline: string;
  pillars: { number: string; title: string; body: string }[];
}
```

**Fonte:**
- Fase 1 modules aprovados → pillars 01–03
- `strategy.future` / exclusions → pillar "Expansão" (condicional, sem jargão interno)

---

### 4.7 Entregáveis — `Fixed structure (3 blocos), Dynamic items`

**Referência UNIP:** 12 entregáveis em 3 categorias.

**Contrato:**

```ts
interface ProposalDeliverablesBlock {
  headline: string;
  groups: {
    number: string;
    title: string;       // "Estrutura de Captação" | "Sistema de Aquisição" | "Primeiro Ciclo"
    items: string[];
  }[];
}
```

**Fonte:** `data.deliverables` (pillars aprovados) + modules Fase 1.

**Mapeamento fixo de categorias (acceleration):**

| Grupo | Conteúdo típico |
|-------|-----------------|
| 01 · Estrutura | LP, WhatsApp, forms, tracking |
| 02 · Aquisição | Google Ads, campanhas, conversões |
| 03 · Primeiro ciclo | Setup, ativação, otimização, validação |

---

### 4.8 Validação — `Fixed structure, Fixed narrative frame, Dynamic metrics`

**Referência UNIP:** "Do investimento ao resultado" + tabela de KPIs.

**Contrato:**

```ts
interface ProposalValidationBlock {
  headline: string;
  frameNarrative: string;   // Fixed copy: "O primeiro ciclo será utilizado para medir..."
  kpis: string[];           // CPL, qualidade, conversão, etc.
  showSimulator: boolean;   // true só se Blueprint aprovado + premissas críticas OK
}
```

**Proibido:** cobertura %, lista de lacunas, premissas críticas.

**Condicional comercial** traduzida para cliente:
> "Antes de escalar, vamos validar a resposta real do mercado com volume controlado."

---

### 4.9 Investimento — `Fixed structure (UNIP layout), Fixed tiers from OS config`

**Referência UNIP:** Setup + mídia + gestão + tabela de escalonamento.

**Contrato:** já existe em `ProposalInvestmentLayout` + `ProposalPricingTier[]`.

**Fonte:** `data.investment` (Blueprint) + `OSCommercialDefaults`.

**Regra:** Investimento sempre de config OS, nunca LLM.

---

### 4.10 Implementação — `Fixed structure (3 movimentos), Dynamic content`

**Referência UNIP:** Estrutura → Aquisição → Escala.

**Contrato:**

```ts
interface ProposalImplementationBlock {
  movements: ProposalMovement[];  // exatamente 3 para acceleration
}
```

**Fonte:** `buildMovements()` a partir do Blueprint aprovado.

**Saúde & Cia:**
1. Estruturar — tracking, LP, funil
2. Validar — Google Search, primeiros leads
3. Escalar — LPs, remarketing, Meta (condicional)

---

### 4.11 Próximos Passos — `Fixed structure, Fixed copy with dynamic client name`

**Referência UNIP:** checklist 5 itens + CTA.

**Contrato:**

```ts
interface ProposalNextStepsBlock {
  steps: string[];  // copy padrão R1
  cta: ProposalCta;
}
```

---

## 5. Níveis de controle (por campo)

| Nível | Significado | Exemplos |
|-------|-------------|----------|
| **Fixed** | Texto/estrutura R1, não muda por cliente | Disclaimer mídia, frame de validação, ordem seções, layout investimento |
| **Dynamic** | Estrutura fixa, conteúdo do Blueprint | Cards diagnóstico, entregáveis, movimentos, pricing |
| **AI-assisted** | IA redige dentro do slot | `thesis`, `conclusion`, narrativas de transição |
| **Blocked** | Nunca na proposta pública | coverage %, blockers, assumptions, editorNotes |

---

## 6. Proposal Blocks (composição dinâmica dentro de seção fixa)

```ts
type ProposalBlock =
  | { type: "MetricCards"; metrics: ProposalMetric[] }
  | { type: "DiagnosisCards"; cards: ProposalDiagnosisCard[] }
  | { type: "SearchVolumeChart"; keywords: ProposalDemandKeyword[] }
  | { type: "CustomerJourney"; steps: ProposalFunnelStep[] }
  | { type: "MechanismFlow"; steps: string[] }
  | { type: "LandingMockup"; mockup: ProposalLandingMockup }
  | { type: "StrategyPillars"; pillars: ... }
  | { type: "DeliverableGrid"; groups: ... }
  | { type: "ValidationKpis"; kpis: string[] }
  | { type: "InvestmentLayout"; tiers: ProposalPricingTier[] }
  | { type: "MovementsTimeline"; movements: ProposalMovement[] }
  | { type: "NextStepsChecklist"; steps: string[] };
```

O **renderizador** itera seções fixas; cada seção declara quais block types aceita.

---

## 7. Pipeline de dados

```
Blueprint aprovado
       │
       ▼
mapBlueprintToProposalContent()   ← novo mapper explícito
       │
       ├── Fixed slots (copy R1)
       ├── Dynamic slots (blueprint fields aprovados)
       └── AI slots (opcional: narrativa)
       │
       ▼
ProposalContent v3 (tipado por bloco, não CreativeBriefSection genérico)
       │
       ▼
R1GrowthTemplatePage (render fixo)
       │
       ▼
HTML / Apresentação
```

---

## 8. O que remover da proposta atual (Saúde & Cia)

| Elemento atual | Ação |
|----------------|------|
| Hero metrics: Cobertura 44%, Profundidade 83% | **Remover** — substituir por métricas de negócio |
| `gapsForMeeting2` section "Validar na Reunião 2" | **Remover da pública** — manter só no Blueprint Studio |
| `ProposalCommercialPipeline` com "Profundidade X%" | **Sanitizar** descriptions |
| Eyebrow "Proposta condicional" | **Remover** — condicional vira copy de validação |
| `strategicGuidance` com jargão interno | **Remover** |
| Exclusões como lista técnica no meio | **Mover** para bloco estratégia "Expansão futura" |
| Simulador quando condicional | **Correto** — esconder até aprovação interna |

---

## 9. Estado atual do código (baseline)

**Já existe (reutilizar):**
- `SECTION_TEMPLATES` em `render-proposal-from-blueprint.ts` (10 seções)
- Componentes visuais: `R1ProposalHero`, `ProposalDiagnosisCards`, `ProposalDemandChart`, `ProposalFunnelJourney`, `ProposalMechanismFlow`, `ProposalInvestmentLayout`, `ProposalMovementsTimeline`
- `ProposalContent` com campos para a maioria dos blocos

**Problema atual:**
- `applyAccelerationEnhancements()` injeta cobertura/profundidade no hero
- `render-proposal-from-blueprint.ts` passa `gapsForMeeting2` para a proposta
- Narrativa vem do playbook genérico, não de slots tipados
- Render usa `CreativeBriefSection[]` (formato LLM) em vez de contrato de template

---

## 10. Sprint proposto — Proposal Engine V2

### Fase A — Spec + sanitização (1–2 dias)
1. ✅ Este documento
2. Remover vazamento interno da proposta pública (quick win)
3. Criar `ProposalContentV3` ou estender `ProposalContent` com blocos tipados

### Fase B — Golden Template manual (2–3 dias)
1. Implementar `R1GrowthTemplatePage` espelhando layout UNIP
2. Hardcode Saúde & Cia como fixture de referência
3. Validar visualmente lado a lado com print UNIP

### Fase C — Mapper Blueprint → Content (2–3 dias)
1. `mapBlueprintToProposalContent(blueprint, artifact, commercial)`
2. Substituir `buildSectionsFromBlueprint` + playbook improvisado
3. IA só nos slots `AI-assisted` (thesis, conclusion)

### Fase D — Proposal Blocks dinâmicos (contínuo)
1. Seletor de blocks por evidências disponíveis
2. Override manual no Proposal Studio (futuro)

---

## 11. Critério de aceite (Saúde & Cia)

Abrir proposta pública e em 60 segundos o cliente entende:

1. **O que é** — Projeto de Aceleração Comercial
2. **Onde estão** — 3–5 fatos claros, não relatório de IA
3. **Por que agir** — oportunidade (com ou sem dados de busca)
4. **Como funciona** — jornada + mecanismo visual
5. **O que recebem** — 3 blocos de entregáveis
6. **Como validamos** — primeiro ciclo, KPIs (sem % cobertura)
7. **Quanto custa** — investimento UNIP-style
8. **Como começamos** — 3 movimentos + próximos passos

**Teste interno:** Luan abre Blueprint → aprova → proposta parece "feita para Angélica", não "gerada por sistema".

---

## 12. Referências

- Proposta UNIP (manual) — golden visual
- `docs/cases/unip-dossier.md` — contexto do case
- `src/domains/proposals/blueprint/` — Commercial Blueprint
- `src/domains/proposals/components/R1PublicProposalPage.tsx` — render atual (base)

---

*Versão 1.0 · Raise One OS · Proposal Engine V2*
