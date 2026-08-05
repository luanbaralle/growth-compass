# UNIP Caraguatatuba — Storyboard Visual

> **Função:** roteiro de direção de arte e UX para implementação futura  
> **Base narrativa:** `docs/cases/unip-caraguatatuba-case.md`  
> **Princípio:** o visitante percorre uma história — não lê um artigo

---

## Mapa de ritmo (visão geral)

```
HERO fullscreen
  ↓
INTRO split
  ↓
MOCKUP mobile fullscreen
  ↓
TEXTO editorial estreito
  ↓
VISUAL abstrato (linha flat)
  ↓
DECISÃO card
  ↓
COMPARATIVO split (5 vs 3)
  ↓
SCROLL NARRATIVO split
  ↓
DECISÃO card
  ↓
MICRO mockup WhatsApp
  ↓
SPLIT dramático (realidade vs painel)
  ↓
TIPOGRAFIA fullscreen
  ↓
DECISÃO card
  ↓
NÚMEROS sequência horizontal
  ↓
RESPIRO (transição de ato)
  ↓
BENTO métricas
  ↓
QUOTE fullscreen
  ↓
DIAGRAMA funil
  ↓
TIMELINE 2 dias
  ↓
DECISÃO card
  ↓
TIMELINE parceria
  ↓
BENTO resultado final
  ↓
CARDS aprendizado
  ↓
NOTA honesta
  ↓
PRÓXIMOS projetos
  ↓
CTA premium
```

**Regra de ouro:** nunca duas seções do mesmo tipo de layout em sequência.

---

# 01 — Hero Cinematográfico

---

## Objetivo

Estabelecer escala, stakes e promessa narrativa em cinco segundos. Responde: *"Por que devo continuar scrollando?"*

## Emoção

Curiosidade · Confiança calma · Respeito pela complexidade

## Mensagem principal

Com R$50 por dia e zero histórico, construímos um funil que gera procura real — e corrigimos o que o painel não mostrava.

## Conteúdo

- Referência: parágrafo de abertura do Hero editorial (linhas 11–15)
- Metadados: Educação · Caraguatatuba · Captação de alunos
- Teaser numérico: 3–7 conversões/dia (sem entregar o resultado ainda)

## Hierarquia visual

1. Imagem de fundo (mockup mobile ou polo) — domina 70% da viewport
2. Título em tipografia display — grande, tracking tight
3. Subtítulo em uma linha
4. Meta tags discretas (cliente, cidade, categoria)
5. Indicador de scroll — último elemento

## Layout

**Fullscreen · scroll narrative · sticky text**

Texto fixo ou semi-fixo na metade inferior enquanto a imagem de fundo move em parallax leve.

## Componentes

| Status | Componente |
|---|---|
| Existente | `CaseHero` — adaptar conteúdo UNIP |
| Existente | `CaseImage` / `CaseParallaxImage` |
| Novo | `CaseHeroMetricsTeaser` — faixa discreta com "3–7 conversões/dia" sem spoil completo |

## Motion

- Fade-in escalonado: meta → título → subtítulo (stagger 120ms)
- Parallax leve na imagem de fundo (8–12% deslocamento no scroll)
- Scroll indicator: pulse vertical suave, loop 2.2s
- **Proibido:** partículas, gradientes animados, texto typewriter

## Assets

- Mockup mobile da landing page UNIP (prioritário)
- Alternativa: foto do polo / fachada / ambiente local com overlay escuro
- Logo UNIP (uso institucional aprovado)
- Textura sutil costeira/abstrata — opcional, sem cliché de praia

## O que NÃO mostrar

- Dashboards de anúncios
- Gráficos de performance
- Capturas de painel Google
- Budget badge gigante no hero (reservar para seção 04)
- Resultados completos (spoiler)

---

# 02 — Retrato do Cliente

---

## Objetivo

Humanizar e contextualizar antes de entrar no problema técnico. Responde: *"Quem é essa cliente e o que ela precisava?"*

## Emoção

Empatia · Identificação · Segurança

## Mensagem principal

Viviane precisava de previsibilidade — não relatórios vazios.

## Conteúdo

- Referência: Hero editorial, parágrafo Viviane (linha 11)
- Referência: Ato 1, consciência do desafio vs. sistema (linhas 21–23)
- Meta: cliente, polo, segmento, ano

## Hierarquia visual

1. Nome do cliente / polo — destaque tipográfico
2. Bloco de meta em cards verticais (Cliente · Indústria · Categoria · Ano)
3. Parágrafo de contexto — coluna principal
4. Eyebrow "Visão geral" — discreto, topo

## Layout

**Split assimétrico** — 60% texto / 40% meta cards empilhados

Desktop: texto à esquerda, meta à direita.  
Mobile: meta compacta horizontal scroll ou grid 2×2 acima do texto.

## Componentes

| Status | Componente |
|---|---|
| Existente | `CaseIntro` |
| Existente | `CaseSection`, `CaseReveal`, `CaseEyebrow`, `CaseHeading`, `CaseBody` |

## Motion

- Meta cards: fade-up com stagger ao entrar no viewport
- Texto: fade-up único, sem slide agressivo

## Assets

- Foto do polo UNIP Caraguatatuba (se disponível e aprovada)
- Sem foto: tipografia + cor institucional UNIP como identidade visual

## O que NÃO mostrar

- Fotos genéricas de stock "estudante sorrindo"
- Org chart ou lista de stakeholders
- Escopo técnico detalhado

---

# 03 — A Peça Central (Landing Page)

---

## Objetivo

Mostrar entrega concreta. Transição do abstrato para o tangível. Responde: *"O que foi construído?"*

## Emoção

Curiosidade · Respeito · Desejo de ver detalhes

## Mensagem principal

Uma landing page orientada a uma única pergunta: a pessoa entrou em contato?

## Conteúdo

- Referência: Ato 1, parágrafo LP + WhatsApp (linha 25)
- Foco visual na LP — texto mínimo (1 frase overlay)

## Hierarquia visual

1. Mockup mobile em escala heroica — domina a tela
2. Uma linha de caption abaixo ou sobreposta
3. Nada mais — silêncio visual intencional

## Layout

**Fullscreen · showcase editorial**

Imagem edge-to-edge com margem mínima. Caption centrada abaixo.

## Componentes

| Status | Componente |
|---|---|
| Existente | `MockupMobile` (showcase) |
| Existente | `ShowcaseFullscreen` |
| Existente | `DesignShowcase` — usar apenas bloco mockup, não seção completa |

## Motion

- Scale-in suave do mockup (0.96 → 1.0, 850ms)
- Glow brand sutil sob o device frame
- **Proibido:** rotação 3D exagerada, hover parallax no mockup

## Assets

- Mockup mobile LP UNIP — alta resolução
- Frame de device neutro (não iPhone identificável demais se restrição de marca)

## O que NÃO mostrar

- Wireframes
- Versões anteriores da LP
- Anotações de UX
- Seções internas da LP ampliadas neste momento (reservar para galeria futura se necessário)

---

# 04 — O Constraint (R$50/dia)

---

## Objetivo

Criar tensão econômica. O visitante internaliza que tudo foi feito com recursos mínimos. Responde: *"Isso foi feito com quanto?"*

## Emoção

Surpresa · Respeito · Curiosidade amplificada

## Mensagem principal

R$50 por dia. Conta nova. Zero histórico.

## Conteúdo

- Referência: Hero linha 13, Ato 1 linhas 27–28
- Três dados: R$50/dia · conta sem histórico · algoritmo conservador

## Hierarquia visual

1. Número "R$50" — tipografia monumental (display, 8xl+)
2. "/dia" — subscripto pequeno
3. Duas linhas de contexto flanqueando ou abaixo
4. Fundo neutro ou elevated — respiro visual

## Layout

**Respiro · tipografia dominante · center stage**

Seção curta (60–80vh max). Quase nenhum parágrafo.

## Componentes

| Status | Componente |
|---|---|
| Novo | `CaseConstraintMoment` — número hero + contexto mínimo |
| Existente | `CaseSection` variant elevated |

## Motion

- Número conta de 0 a 50 (opcional, 1.2s) — apenas se não parecer gimmick
- Fade-in do "/dia" após o número
- **Proibido:** animação de moedas, cofres, gráficos de dinheiro

## Assets

- Nenhuma imagem — tipografia e espaço negativo são o asset
- Opcional: textura grain sutil no fundo

## O que NÃO mostrar

- Planilhas de budget
- Tabelas de investimento
- Comparativos com outros clientes

---

# 05 — O Mercado Local

---

## Objetivo

Situar geograficamente e emocionalmente. Responde: *"Por que isso era difícil naquele contexto?"*

## Emoção

Compreensão · Realismo · Identificação (decisor com mercado regional)

## Mensagem principal

Caraguatatuba é mercado local, concorrência real — faltava um sistema de ponta a ponta.

## Conteúdo

- Referência: Ato 1 linhas 21–23
- Sem repetir intro da Viviane

## Hierarquia visual

1. Eyebrow "O contexto"
2. Título curto — max 6 palavras
3. Corpo — max 3 linhas, coluna estreita (max-w-prose)
4. Mapa ou foto local — elemento secundário, lateral

## Layout

**Editorial estreito · texto centrado**

Coluna única, 640px max. Muito whitespace acima e abaixo.

## Componentes

| Status | Componente |
|---|---|
| Existente | `CaseTextBlock` (sections/shared) |
| Existente | `StorytellingOpeningSections` — bloco contexto |

## Motion

- Fade-up simples no scroll
- Mapa/foto local: parallax leve lateral (opcional)

## Assets

- Mapa estilizado Litoral Norte / Caraguatatuba (minimal, não Google Maps cru)
- Ou: foto aérea costeira desaturada

## O que NÃO mostrar

- Análise de concorrentes em tabela
- Dados IBGE
- Personas documentadas

---

# 06 — A Conta Travada

---

## Objetivo

Introduzir conflito visual — o momento em que nada se move. Responde: *"O que deu errado primeiro?"*

## Emoção

Tensão · Frustração reconhecível · Antecipação

## Mensagem principal

Havia investimento — mas o sistema parecia parado.

## Conteúdo

- Referência: Ato 1 linhas 29–31
- Referência: fechamento Ato 1 linha 41 ("entender primeiro")

## Hierarquia visual

1. Visual abstrato de linha flat / gráfico morto — domina 50%
2. Título: "O primeiro obstáculo"
3. Duas frases de corpo — máximo
4. Sem números reais ainda

## Layout

**Split vertical** — visual acima, texto abaixo (mobile) · split horizontal desktop

Visual: linha horizontal quase reta em fundo escuro — **não** screenshot de plataforma de ads.

## Componentes

| Status | Componente |
|---|---|
| Novo | `CaseMetricFlatline` — visualização abstracta de estagnação |
| Existente | `ChallengeSection` — adaptar apenas bloco de tensão, não seção inteira |

## Motion

- Linha desenha da esquerda para direita — flat, sem picos (1.5s, ease-out)
- Texto fade-in após linha completar
- **Proibido:** animação de "loading" ou spinner — clichê

## Assets

- Visual generativo abstrato (linha SVG animada)
- **Não usar:** capturas de Google Ads, gráficos reais de impressões

## O que NÃO mostrar

- Nomes de campanhas
- Métricas zeradas literais de plataforma
- Terminologia de mídia paga

---

# 07 — Decisão: Funil Integrado

---

## Objetivo

Primeiro bloco "Decisão" — estabelecer padrão visual de escolhas estratégicas. Responde: *"Como vocês pensam?"*

## Emoção

Confiança · Clareza · Respeito pelo método

## Mensagem principal

Tratar o projeto como funil integrado — não peças isoladas.

## Conteúdo

- Referência: bloco Decisão Ato 1 (linhas 33–37)

## Hierarquia visual

1. Label "Decisão" — pill ou eyebrow com peso visual
2. Headline da decisão — 1 frase
3. Corpo explicativo — 2 frases max
4. Borda ou fundo diferenciado — card elevated com borda brand sutil

## Layout

**Decision card · inset com margem generosa**

Card centralizado, max-w-2xl. Não full-width.

## Componentes

| Status | Componente |
|---|---|
| Novo | `CaseDecisionBlock` — componente dedicado para blocos "Decisão" editoriais |
| Existente | `CaseReveal`, `CaseSection` |

## Motion

- Slide-up + fade (24px, 750ms)
- Borda brand: opacity 0 → 1 no hover (desktop only)
- **Proibido:** flip cards, confetti, checkmarks animados

## Assets

- Nenhum — tipografia e container são suficientes
- Opcional: ícone minimal de funil (linha única, monocromático)

## O que NÃO mostrar

- Diagramas complexos de arquitetura
- Lista de deliverables
- Stack tecnológico

---

# 08 — Cinco ou Três? (Comparativo)

---

## Objetivo

Visualizar raciocínio de simplificação sem aula de mídia. Responde: *"Por que menos pode ser mais?"*

## Emoção

Clareza · Alívio intelectual · "Faz sentido"

## Mensagem principal

Cobrir terreno ≠ aprender rápido. Com R$50/dia, fragmentar é ruído.

## Conteúdo

- Referência: Ato 2 linhas 47–57 (inclui Decisão 5→3, mas visual separado da seção 07)

## Hierarquia visual

1. Split 50/50: "5 grupos" vs "3 grupos"
2. Lado esquerdo: visualmente mais fraco, fragmentado, opaco
3. Lado direito: consolidado, claro, destacado com borda brand
4. Caption única abaixo — EAD · Cursos · Pós

## Layout

**Split comparativo · before/after conceitual**

Não é Before/After de imagem — é Before/After de estratégia.

## Componentes

| Status | Componente |
|---|---|
| Existente | `BeforeAfterSection` — **não usar literalmente**; inspirar estrutura
| Novo | `CaseStrategyCompare` — split 5 vs 3 com estados visuais distintos |

## Motion

- Lado "3 grupos" ilumina após 400ms delay quando entra viewport
- Lado "5 grupos" permanece em opacity 0.5
- **Proibido:** animação de "batalha" entre lados

## Assets

- Ícones abstratos de agrupamento (3 blocos vs 5 blocos fragmentados)
- Sem logos de plataformas

## O que NÃO mostrar

- Nomes técnicos de ad groups
- Screenshots de estrutura de campanha
- Budget breakdown

---

# 09 — Decisão: Simplificar para Aprender

---

## Objetivo

Consolidar a escolha do comparativo anterior. Responde: *"Qual foi a call?"*

## Emoção

Segurança · Convicção

## Mensagem principal

Reduzir de cinco para três grupos — concentrar volume onde a validação é possível.

## Conteúdo

- Referência: bloco Decisão Ato 2 (linhas 51–55)

## Hierarquia visual

1. Label "Decisão"
2. Headline
3. Corpo — 2 frases

## Layout

**Decision card** — idêntico ao padrão seção 07, variante de conteúdo

Alternância garantida: 08 era split comparativo → 09 é card (layouts diferentes ✓)

## Componentes

| Status | Componente |
|---|---|
| Novo | `CaseDecisionBlock` |

## Motion

- Mesmo sistema da seção 07
- **Variação:** entrada pela esquerda em vez de baixo — micro-diferenciação entre decision blocks

## Assets

- Nenhum

## O que NÃO mostrar

- Repetição do comparativo 5 vs 3
- Métricas de performance pós-decisão (ainda cedo na narrativa)

---

# 10 — Destravando a Entrega

---

## Objetivo

Mostrar virada narrativa — da estagnação ao movimento. Responde: *"O que mudou?"*

## Emoção

Alívio · Momentum · Surpresa positiva

## Mensagem principal

Abrir a configuração de palavras-chave destravou a operação.

## Conteúdo

- Referência: Ato 2 linhas 61–71 (texto conservador → reavaliação → destravamento)
- Decisão linhas 67–71 será seção 11 separada

## Hierarquia visual

1. Visual abstrato: linha que "acorda" — curva ascendente (contraste com seção 06)
2. Três palavras-chave de impacto flutuando: Impressões · Cliques · Distribuição
3. Texto curto à esquerda (scroll narrative sticky)

## Layout

**Scroll narrative · split sticky**

Desktop: texto sticky left 40%, visual evolutivo right 60%.  
Mobile: visual → texto → visual (sequência vertical).

## Componentes

| Status | Componente |
|---|---|
| Novo | `CaseMomentumVisual` — par linha flat / linha ascendente |
| Existente | `ProcessTimeline` — **não usar aqui** (timeline é reservada para seção 20)

## Motion

- Linha flat morphs para curva ascendente (scroll-triggered, scrub 0→1)
- Palavras fade-in sequencialmente conforme curva sobe
- **Crítico:** motion deve ser scroll-linked, não autoplay

## Assets

- Visual SVG abstrato — sem dados reais
- **Não usar:** gráficos de impressões/cliques literais

## O que NÃO mostrar

- Termos "correspondência ampla", "exata", "frase"
- Recomendações do Google como screenshot
- Decisão card aqui (vai na 11)

---

# 11 — Decisão: Abrir Quando Não Há Volume

---

## Objetivo

Registrar segunda grande escolha estratégica. Responde: *"Por que mudaram de abordagem?"*

## Emoção

Prudência · Confiança no processo

## Mensagem principal

Contas novas precisam de dados. Sem entrega, não há otimização — só espera.

## Conteúdo

- Referência: bloco Decisão (linhas 67–71)

## Hierarquia visual

Padrão Decision card — seção 07.

## Layout

**Decision card**

## Componentes

| Status | Componente |
|---|---|
| Novo | `CaseDecisionBlock` |

## Motion

Entrada padrão fade-up.

## Assets

Nenhum.

## O que NÃO mostrar

- Gráfico de destravamento repetido da seção 10
- Jargão de keywords

---

# 12 — Primeiro Sinal (WhatsApp)

---

## Objetivo

Momento humano — prova de que o funil funciona na vida real. Responde: *"Funcionou na prática?"*

## Emoção

Validação · Calor humano · Esperança

## Mensagem principal

As primeiras mensagens começaram a chegar. A procura existia.

## Conteúdo

- Referência: Ato 2 linhas 75–76

## Hierarquia visual

1. Mockup ou composição de notificação WhatsApp — estilizada, não screenshot real
2. Uma frase grande ao lado
3. Minimal — quase um anúncio de produto Apple

## Layout

**Micro-showcase · split 50/50**

Device frame pequeno (não heroico como seção 03) + texto.

## Componentes

| Status | Componente |
|---|---|
| Existente | `MockupMobile` — escala reduzida |
| Novo | `CaseWhatsAppMoment` — composição notificação estilizada (privacidade: sem mensagens reais)

## Motion

- Notificação slide-in from top (300ms, once)
- **Proibido:** som, vibração visual exagerada

## Assets

- Composição WhatsApp genérica (bubble + horário fictício)
- **Não usar:** screenshots reais de conversas da Viviane

## O que NÃO mostrar

- Conteúdo real de mensagens
- Número de telefone
- Quantidade "4 mensagens curiosas" (detalhe secundário, pode cansar)

---

# 13 — Realidade vs. Painel

---

## Objetivo

Clímax do Ato 2 — conflito central da história. Responde: *"E quando os números mentem?"*

## Emoção

Surpresa · Tensão · Admiração pelo diagnóstico

## Mensagem principal

Mensagens chegavam. O painel mostrava zero.

## Conteúdo

- Referência: Ato 2 linhas 77–81
- Referência: parágrafo conflito operação vs dashboard (linhas 81–82)

## Hierarquia visual

1. Split dramático 50/50 com divisor vertical
2. Esquerda: "Realidade" — ícone WhatsApp, status verde, "Mensagens chegando"
3. Direita: "Painel" — "0 conversões", visual opaco/desaturado
4. Contraste de cor: esquerda quente, direita fria

## Layout

**Split dramático · fullscreen width**

Altura mínima 80vh. Divisor com label central "≠"

## Componentes

| Status | Componente |
|---|---|
| Novo | `CaseRealitySplit` — componente dedicado split Realidade/Painel |
| Existente | `BeforeAfterSection` — **não usar** (semântica diferente)

## Motion

- Split reveal: painéis deslizam de fora para centro (600ms)
- Número "0" no painel: fade-in delay 800ms — punch visual
- **Proibido:** glitch effects, alarmes, vermelho piscando

## Assets

- Visual abstrato painel (retângulo com "0" tipográfico)
- Ícone WhatsApp estilizado (não logo oficial se restrição)

## O que NÃO mostrar

- Screenshots de Google Ads
- Tag Assistant
- GTM
- Código ou IDs de conversão
- Nome de ferramentas de auditoria

---

# 14 — Um Caractere

---

## Objetivo

Momento tipográfico memorável — o insight mais forte do case. Responde: *"Como um detalhe mínimo quebra tudo?"*

## Emoção

Surpresa · Respeito · "Não acredito que era isso"

## Mensagem principal

Um único caractere incorreto invalidou toda a mensuração.

## Conteúdo

- Referência: Ato 2 linhas 85–86
- **Não** exibir o caractere, string ou código

## Hierarquia visual

1. Tipografia monumental: "1 caractere."
2. Subline: "Toda a mensuração. Invalidada."
3. Fundo escuro, quase preto — silêncio total
4. Nenhum parágrafo adicional

## Layout

**Fullscreen tipográfico · center stage**

100vh. Texto centrado. Máximo 8 palavras na tela.

## Componentes

| Status | Componente |
|---|---|
| Novo | `CaseTypographicMoment` — fullscreen statement blocks |
| Existente | `CaseSection` variant dark |

## Motion

- "1" scale-in (0.8 → 1.0, 600ms, ease-out)
- Restante do texto fade-in sequencial (stagger 200ms)
- **Proibido:** matrix rain, código caindo, efeito hacker

## Assets

- Nenhum — tipografia é o asset
- Fonte display da marca Raise One

## O que NÃO mostrar

- String de conversão
- Letra L vs número 1 literal
- Nomes de arquivos
- Fluxos técnicos
- Tag Assistant

---

# 15 — Decisão: Medir Antes de Otimizar

---

## Objetivo

Resolver o conflito da seção 13–14 com uma escolha clara. Responde: *"O que fizeram?"*

## Emoção

Confiança · Disciplina · Alívio

## Mensagem principal

Corrigir mensuração antes de qualquer otimização de campanha.

## Conteúdo

- Referência: bloco Decisão (linhas 87–91)
- Referência: validação + CPC caindo (linhas 93–95) — **CPC vai para seção 16**

## Hierarquia visual

Decision card padrão.

## Layout

**Decision card**

## Componentes

| Status | Componente |
|---|---|
| Novo | `CaseDecisionBlock` |

## Motion

Fade-up padrão.

## Assets

Nenhum.

## O que NÃO mostrar

- Detalhes da correção técnica
- Antes/depois de Tag Assistant
- Sequência CPC (próxima seção)

---

# 16 — CPC Descendo

---

## Objetivo

Prova quantitativa de que o algoritmo aprendeu — pós-correção. Responde: *"Melhorou de verdade?"*

## Emoção

Satisfação · Momentum · Credibilidade numérica

## Mensagem principal

De R$7 para R$3,80 — o sistema aprendeu.

## Conteúdo

- Referência: Ato 2 linha 95

## Hierarquia visual

1. Sequência horizontal de 4 números: R$7 → R$6 → R$4 → R$3,80
2. Setas ou linha conectora sutil entre eles
3. Label "Custo por clique" — eyebrow
4. Sem gráfico de barras tradicional

## Layout

**Number sequence · horizontal scroll (mobile) · inline (desktop)**

Mobile: scroll horizontal snap. Desktop: 4 colunas iguais.

## Componentes

| Status | Componente |
|---|---|
| Novo | `CaseMetricSequence` — sequência horizontal de métricas |
| Existente | `ResultsSection` / `AnimatedStat` — inspirar, não reutilizar grid bento |

## Motion

- Números aparecem da esquerda para direita (stagger 150ms)
- Último número (R$3,80) recebe highlight brand sutil
- **Proibido:** contador slot-machine

## Assets

- Nenhum — números tipográficos

## O que NÃO mostrar

- Gráfico de linha tradicional de analytics
- Período exato dos CPCs (lacuna editorial)
- Comparativo com benchmark de mercado

---

# 17 — Transição de Ato (Respiro)

---

## Objetivo

Separar Ato 2 de Ato 3 cinematicamente. Reset emocional. Responde: nenhuma pergunta — prepara o palco.

## Emoção

Antecipação · Calma · Respiração

## Mensagem principal

A base estava arrumada. Era hora de ver o ritmo.

## Conteúdo

- Referência: primeira linha Ato 3 (linha 101) — uma frase apenas

## Hierarquia visual

1. Frase única centrada
2. Eyebrow "Ato III — A Evolução" ou divisória visual
3. 70% viewport vazio

## Layout

**Respiro · fullscreen minimal**

## Componentes

| Status | Componente |
|---|---|
| Novo | `CaseActTransition` — divisor de atos cinematográfico |
| Existente | `CaseSection` — variant default, padding extremo |

## Motion

- Fade-in lento da frase (1.2s)
- Opcional: linha horizontal expande from center (width 0 → 120px)

## Assets

- Nenhum

## O que NÃO mostrar

- Qualquer métrica
- Qualquer imagem
- Texto longo

---

# 18 — Resultados em Ritmo (Bento)

---

## Objetivo

Entregar números consolidados com impacto visual. Responde: *"Quais foram os resultados?"*

## Emoção

Impacto · Confiança · Admiração

## Mensagem principal

23 conversões. ~R$28 por conversão. R$655 investidos.

## Conteúdo

- Referência: Ato 3 tabela (linhas 105–110)
- Referência: 3–7 conversões/dia (linha 101)

## Hierarquia visual

1. Métrica hero: **23 conversões** — card 2×2 no bento grid
2. CPA ~R$28 — segundo destaque
3. Investimento R$655 e 101 cliques — cards menores
4. Faixa "3–7 / dia" — badge ou card horizontal

## Layout

**Bento grid · asymmetric**

Grid 4 colunas desktop. Card principal ocupa 2×2. Mobile: stack com hero metric first.

## Componentes

| Status | Componente |
|---|---|
| Existente | `ResultsSection` — MetricCard bento layout |
| Existente | `CaseCardsBlock` |

## Motion

- Cards stagger fade-up (100ms interval)
- Número hero: scale-in subtle
- **Proibido:** confetti, fire emojis, verde "profit"

## Assets

- Nenhum — números tipográficos em cards
- Opcional: grain texture sutil nos cards

## O que NÃO mostrar

- Dashboard screenshots
- Planilhas
- Gráfico de pizza
- Período exato se ainda [A CONFIRMAR] — usar "~2 semanas" como nota de rodapé discreta

---

# 19 — Voz da Cliente (Quote)

---

## Objetivo

Prova social qualitativa — humanizar resultados. Responde: *"O que a cliente diz?"*

## Emoção

Confiança · Autenticidade · Empatia

## Mensagem principal

"A procura aumentou consideravelmente."

## Conteúdo

- Referência: citação Viviane (linhas 120–122)
- Atribuição: Viviane, Polo UNIP Caraguatatuba
- Nota rodapé: citação sujeita a aprovação

## Hierarquia visual

1. Aspas tipográficas grandes (decorativas, opacity 0.15)
2. Citação — font display, 2xl–4xl, leading tight
3. Nome e cargo — abaixo, peso regular
4. Fundo elevated ou gradient sutil brand

## Layout

**Quote fullscreen · editorial**

Padding generoso. Max-w-3xl centered. Altura mínima 70vh.

## Componentes

| Status | Componente |
|---|---|
| Existente | `CaseQuotesBlock` (ContentSections)
| Existente | `ResultsSection` blockquote variant

## Motion

- Fade-in lento (900ms) — quote merece peso
- Aspas decorativas: opacity 0 → 0.15 (delay 400ms)
- **Proibido:** carrossel de depoimentos, avatar stock

## Assets

- Foto Viviane (se aprovada) — opcional, pequena, circular, abaixo do nome
- Sem foto: apenas tipografia

## O que NÃO mostrar

- Screenshots de WhatsApp com citação
- Vídeo depoimento (fase 2, se existir)
- Múltiplas citações

---

# 20 — Funil em Camadas

---

## Objetivo

Explicar visualmente onde o gargalo está agora. Responde: *"O que funcionou e o que falta?"*

## Emoção

Clareza · Honestidade · Respeito pela complexidade

## Mensagem principal

O topo do funil funciona. O gargalo migrou para a conversão comercial.

## Conteúdo

- Referência: Ato 3 linhas 126–128
- Referência: Ato 4 linhas 179–181

## Hierarquia visual

1. Diagrama vertical de 4 etapas: Anúncio → LP → WhatsApp → Matrícula
2. Três primeiras etapas: check ou highlight brand
3. Matrícula: outline ou estado "próximo capítulo" — não vermelho alarmista
4. Uma frase explicativa abaixo

## Layout

**Diagrama vertical · sticky scroll (opcional)**

Desktop: diagrama left, texto explicativo sticky right.  
Mobile: diagrama → texto.

## Componentes

| Status | Componente |
|---|---|
| Novo | `CaseFunnelLayers` — diagrama de funil com estados por etapa |
| Existente | `GoalsSection` — **não reutilizar** (semântica diferente)

## Motion

- Etapas iluminam sequencialmente top→bottom (stagger 200ms, on scroll)
- Etapa Matrícula: pulse sutil contínuo (opacity 0.6↔1) — "próximo foco"
- **Proibido:** funil 3D rotativo

## Assets

- Diagrama SVG custom — minimal, monocromático + brand accent
- Ícones line para cada etapa

## O que NÃO mostrar

- Taxa de conversão por etapa (não temos dados)
- Matrículas inventadas
- CRM screenshots

---

# 21 — Dois Dias (Oscilação)

---

## Objetivo

Mostrar que resultado não é linear — disciplina nos dias ruins. Responde: *"E quando deu errado?"*

## Emoção

Tensão → Alívio · Respeito pela calma estratégica

## Mensagem principal

Um dia atípico. No dia seguinte, recuperação.

## Conteúdo

- Referência: Ato 3 linhas 132–136
- Decisão linhas 138–142 → seção 22

## Hierarquia visual

1. Timeline horizontal de 2 nodes: Dia A · Dia B
2. Dia A: CPC R$20, 4 cliques, 0 conversões — visual opaco
3. Dia B: CPC R$5,76, 8 cliques, 2 conversões — visual highlighted
4. Conector entre nodes com label "24h depois"

## Layout

**Mini timeline horizontal · 2 nodes**

Compacto — max 60vh. Não competir com ProcessTimeline completo.

## Componentes

| Status | Componente |
|---|---|
| Novo | `CaseVolatilityTimeline` — timeline compacta 2-eventos |
| Existente | `ProcessTimeline` — **não usar** (escala diferente)
| Existente | `CaseTimelineBlock`

## Motion

- Node A fade-in → pause 300ms → connector draws → Node B fade-in
- **Proibido:** animação de "crash" ou queda dramática

## Assets

- Nenhum — cards tipográficos com métricas do dia

## O que NÃO mostrar

- Termo de pesquisa específico concorrido
- CPC R$46/clique (detalhe interno)
- Gráfico intraday

---

# 22 — Decisão: Manter o Curso

---

## Objetivo

Fechar arco de oscilação com escolha estratégica. Responde: *"Por que não entraram em pânico?"*

## Emoção

Confiança · Estabilidade · Admiração

## Mensagem principal

Reagir a um outlier com mudança estrutural seria trocar diagnóstico por pânico.

## Conteúdo

- Referência: bloco Decisão (linhas 138–142)

## Hierarquia visual

Decision card padrão.

## Layout

**Decision card**

Alternância: 21 timeline → 22 card ✓

## Componentes

| Status | Componente |
|---|---|
| Novo | `CaseDecisionBlock` |

## Motion

Fade-up padrão.

## Assets

Nenhum.

## O que NÃO mostrar

- Repetição dos números do dia atípico
- Comparativo com outras estratégias de lance

---

# 23 — Evolução da Parceria

---

## Objetivo

Provar confiança de longo prazo — arco relacional. Responde: *"Como é trabalhar com a Raise One?"*

## Emoção

Calor · Confiança · Desejo de replicar relacionamento

## Mensagem principal

De contratante para parceira.

## Conteúdo

- Referência: Ato 3 linhas 146–152
- Menção pousada Itanhaém — 1 linha discreta, não hero

## Hierarquia visual

1. Timeline horizontal de 4 estágios:
   - Contratação
   - Relatórios
   - Confiança
   - Parceria (upsell)
2. Cada estágio: label + 3 palavras max
3. Último estágio highlighted

## Layout

**Timeline horizontal · 4 milestones**

Desktop: inline. Mobile: vertical timeline compacta.

## Componentes

| Status | Componente |
|---|---|
| Existente | `ProcessTimeline` — adaptar para horizontal/partnership variant |
| Novo | `CasePartnershipTimeline` — 4 estágios relacionais |

## Motion

- Milestones ativam sequencialmente left→right on scroll
- Estágio final: brand glow sutil
- **Proibido:** fotos de aperto de mão stock

## Assets

- Ícones line minimal por estágio
- **Não usar:** logo Pousada Itanhaém em destaque

## O que NÃO mostrar

- Caso Magicpin/FMU em detalhe (1 frase no corpo, sem seção dedicada)
- Conversas reais
- Contratos

---

# 24 — Resultado Final (Bento Hero)

---

## Objetivo

Consolidar Ato 4 — visão panorâmica final. Responde: *"Qual é o resultado final?"*

## Emoção

Impacto · Satisfação · Clareza

## Mensagem principal

De operação sem tração para funil com procura previsível — em menos de um mês.

## Conteúdo

- Referência: Ato 4 linhas 158–167 (números)
- Referência: impacto qualitativo (linhas 169–173)

## Hierarquia visual

1. Headline curta acima do grid
2. Bento grid — variante mais ampla que seção 18 (inclui CPC evolution + conversões/dia)
3. Card qualitativo: "Procura aumentou consideravelmente" — integrado, não repetir quote fullscreen

## Layout

**Bento grid large · editorial header**

Diferente da seção 18: header editorial + grid 6 células vs 4. Paleta ligeiramente mais clara (elevated → default).

## Componentes

| Status | Componente |
|---|---|
| Existente | `ResultsSection` |
| Existente | `ResultsExtendedSections` |

## Motion

Stagger padrão — mais lento que seção 18 (150ms vs 100ms) para marcar finalidade.

## Assets

- Nenhum obrigatório
- Opcional: mockup LP thumbnail pequeno em 1 célula do bento

## O que NÃO mostrar

- Repetição literal da quote seção 19
- Matrículas como conquista (ainda [A CONFIRMAR])

---

# 25 — O Que Ainda Não Aconteceu (Honestidade)

---

## Objetivo

Credibilidade por transparência — raro em cases de agência. Responde: *"Eles escondem algo?"*

## Emoção

Respeito · Confiança amplificada · Maturidade

## Mensagem principal

Matrículas ainda não fechadas no período — e isso define o próximo capítulo.

## Conteúdo

- Referência: Ato 3 linha 128, Ato 4 linhas 175–181

## Hierarquia visual

1. Eyebrow "Transparência"
2. Frase direta — sem eufemismos
3. Visual: etapa "Matrícula" do funil (seção 20) em estado outline — callback visual
4. Tom visual: neutro, não alarmista

## Layout

**Editorial narrow · callback visual**

Coluna estreita + ícone/mini-diagrama. Padding generoso. Tom diferente do bento anterior.

## Componentes

| Status | Componente |
|---|---|
| Novo | `CaseHonestGap` — bloco transparência com callback a FunnelLayers |
| Existente | `CaseTextBlock`

## Motion

- Fade-in simples
- Outline matrícula pulse sutil (mesmo sistema seção 20)

## Assets

- Reuso do SVG funil (estado matrícula)

## O que NÃO mostrar

- Desculpas ou justificativas longas
- Culpar comercial da cliente
- Projeções de matrículas futuras

---

# 26 — Aprendizados

---

## Objetivo

Cristalizar método replicável. Responde: *"O que posso levar para meu negócio?"*

## Emoção

Clareza · Inspiração pragmática · Segurança

## Mensagem principal

Quatro lições — budget, mensuração, oscilação, funil em camadas.

## Conteúdo

- Referência: Ato 4 lista (linhas 185–193)

## Hierarquia visual

1. Eyebrow "Aprendizados"
2. 4 cards numerados (01–04)
3. Cada card: título bold + 1 frase
4. Grid 2×2 desktop, stack mobile

## Layout

**Cards grid · numbered**

## Componentes

| Status | Componente |
|---|---|
| Existente | `GoalsSection` — estrutura similar, adaptar conteúdo |
| Existente | `CaseListBlock` |
| Existente | `StorytellingClosingSections` — lessonsLearned

## Motion

- Cards stagger fade-up
- Números 01–04: opacity 0.2 → 0.35 on hover (desktop)

## Assets

- Nenhum

## O que NÃO mostrar

- Lista completa de aprendizados técnicos do dossiê
- Jargão de mídia

---

# 27 — Próximos Projetos

---

## Objetivo

Navegação lateral — manter visitante no portfólio. Responde: *"O que mais vocês fizeram?"*

## Emoção

Curiosidade · Continuidade

## Mensagem principal

Explore outros projetos Raise One.

## Conteúdo

- Sistema: `nextProjects` do Case object
- Não narrar pousada Itanhaém aqui (já mencionada na seção 23)

## Hierarquia visual

1. Eyebrow "Portfólio"
2. 2–3 cards de cases adjacentes
3. Hover: elevação + arrow

## Layout

**Cards grid · 3 colunas**

## Componentes

| Status | Componente |
|---|---|
| Existente | `NextProjectsSection` |

## Motion

- Hover lift (-4px) + image scale 1.04
- Stagger fade-up on enter

## Assets

- Cover images dos cases relacionados (placeholders até produção)

## O que NÃO mostrar

- UNIP repetido
- Pousada como card se ainda não for case publicado

---

# 28 — CTA Final

---

## Objetivo

Converter confiança em ação. Responde: *"Qual é o próximo passo?"*

## Emoção

Convite · Confiança · Calma (não urgência)

## Mensagem principal

Começar com diagnóstico — entender o gargalo antes de prometer escala.

## Conteúdo

- Referência: CTA editorial (linhas 199–203)

## Hierarquia visual

1. Headline grande — 1 frase
2. Subtexto — 2 frases max
3. Botão primário: Diagnóstico
4. Botão secundário: Programa de Crescimento
5. Fundo diferenciado — gradient brand sutil, fullscreen width

## Layout

**CTA fullscreen · premium card inset**

Card glassmorphism centralizado em seção ampla.

## Componentes

| Status | Componente |
|---|---|
| Existente | `CaseCTA` |

## Motion

- Fade-up do card
- Glow brand pulse muito sutil (opacity 0.05↔0.08, 4s loop)
- Botão primário: brightness on hover
- **Proibido:** countdown, "vagas limitadas", pop-ups

## Assets

- Nenhum — tipografia e fundo são suficientes
- Opcional: glow gradient abstrato

## O que NÃO mostrar

- Formulário inline
- Preços
- Logos de clientes em strip

---

# Tabela de produção

| # | Seção | Tempo leitura | Peso visual | Texto | Imagens | Impacto emocional | Prioridade |
|---|---|---|---|---|---|---|---|
| 01 | Hero Cinematográfico | 8s | ████████░░ | Baixo | 1 hero | Curiosidade | **P0** |
| 02 | Retrato do Cliente | 20s | ████░░░░░░ | Médio | 0–1 | Empatia | **P0** |
| 03 | A Peça Central (LP) | 5s | █████████░ | Mínimo | 1 mockup | Desejo | **P0** |
| 04 | O Constraint | 5s | ███████░░░ | Mínimo | 0 | Surpresa | **P0** |
| 05 | O Mercado Local | 15s | ███░░░░░░░ | Médio | 0–1 | Compreensão | P1 |
| 06 | A Conta Travada | 12s | ██████░░░░ | Baixo | 1 abstract | Tensão | **P0** |
| 07 | Decisão: Funil Integrado | 10s | ████░░░░░░ | Médio | 0 | Confiança | **P0** |
| 08 | Cinco ou Três? | 15s | ██████░░░░ | Baixo | 0 (visual) | Clareza | **P0** |
| 09 | Decisão: Simplificar | 8s | ████░░░░░░ | Médio | 0 | Convicção | P1 |
| 10 | Destravando | 18s | ███████░░░ | Médio | 1 abstract | Alívio | **P0** |
| 11 | Decisão: Abrir Volume | 8s | ████░░░░░░ | Médio | 0 | Prudência | P1 |
| 12 | Primeiro Sinal | 8s | █████░░░░░ | Baixo | 1 comp | Validação | P1 |
| 13 | Realidade vs. Painel | 12s | █████████░ | Baixo | 0 (split) | Tensão | **P0** |
| 14 | Um Caractere | 5s | █████████░ | Mínimo | 0 | Surpresa | **P0** |
| 15 | Decisão: Medir Primeiro | 8s | ████░░░░░░ | Médio | 0 | Disciplina | P1 |
| 16 | CPC Descendo | 8s | ██████░░░░ | Mínimo | 0 | Satisfação | **P0** |
| 17 | Transição de Ato | 4s | ██░░░░░░░░ | Mínimo | 0 | Antecipação | P1 |
| 18 | Resultados Bento | 12s | ████████░░ | Baixo | 0 | Impacto | **P0** |
| 19 | Voz da Cliente | 15s | ███████░░░ | Médio | 0–1 | Confiança | **P0** |
| 20 | Funil em Camadas | 18s | ██████░░░░ | Médio | 1 diagram | Clareza | **P0** |
| 21 | Dois Dias | 12s | █████░░░░░ | Baixo | 0 | Resiliência | P1 |
| 22 | Decisão: Manter Curso | 8s | ████░░░░░░ | Médio | 0 | Estabilidade | P1 |
| 23 | Evolução Parceria | 15s | ██████░░░░ | Baixo | 0 | Calor | P1 |
| 24 | Resultado Final Bento | 15s | ████████░░ | Baixo | 0–1 | Impacto | **P0** |
| 25 | Honestidade | 12s | ███░░░░░░░ | Médio | 0 (callback) | Respeito | **P0** |
| 26 | Aprendizados | 20s | █████░░░░░ | Médio | 0 | Inspiração | P1 |
| 27 | Próximos Projetos | 8s | ████░░░░░░ | Mínimo | 2–3 | Curiosidade | P2 |
| 28 | CTA Final | 10s | ███████░░░ | Médio | 0 | Convite | **P0** |

**Tempo total estimado de scroll:** ~4min 30s  
**Seções P0 (implementar primeiro):** 16 de 28

---

# Componentes novos necessários

| Componente | Seções | Prioridade |
|---|---|---|
| `CaseDecisionBlock` | 07, 09, 11, 15, 22 | P0 |
| `CaseRealitySplit` | 13 | P0 |
| `CaseTypographicMoment` | 14 | P0 |
| `CaseMetricFlatline` | 06 | P0 |
| `CaseMomentumVisual` | 10 | P0 |
| `CaseMetricSequence` | 16 | P0 |
| `CaseFunnelLayers` | 20, 25 | P0 |
| `CaseConstraintMoment` | 04 | P0 |
| `CaseActTransition` | 17 | P1 |
| `CaseVolatilityTimeline` | 21 | P1 |
| `CasePartnershipTimeline` | 23 | P1 |
| `CaseWhatsAppMoment` | 12 | P1 |
| `CaseStrategyCompare` | 08 | P0 |
| `CaseHonestGap` | 25 | P0 |
| `CaseHeroMetricsTeaser` | 01 | P2 |

---

# Revisão de fadiga — cortes, fusões e ajustes

## Pontos de risco identificados

### 1. Excesso de Decision Blocks (5 ocorrências)

**Problema:** seções 07, 09, 11, 15, 22 — risco de padrão repetitivo apesar de layout alternado.

**Sugestão:**
- Manter P0: 07, 15, 22 (funil integrado · medir primeiro · manter curso)
- **Fundir 09 com 08** — comparativo 5 vs 3 já termina com a decisão implícita; card 09 torna-se caption do comparativo, não seção separada
- **Fundir 11 com 10** — decisão de abrir keywords vira footer sticky do scroll narrative

**Resultado:** 3 decision blocks em vez de 5 — mais impacto por bloco.

---

### 2. Dois Bento Grids consecutivos próximos (18 e 24)

**Problema:** seções 18 e 24 usam mesmo layout family com ~30s de distância.

**Sugestão:**
- Seção 18: bento compacto (4 células) — "primeiros resultados"
- Seção 24: **substituir por single hero metric** — apenas "23 conversões" fullscreen tipográfico + 3 stats inline abaixo, sem grid
- Alternativa: eliminar seção 18 e manter apenas 24 com todos os números

**Recomendação:** eliminar 18, mover números para 24 — quote (19) fica mais impactante após números únicos.

---

### 3. Sequência 12 → 13 → 14 — densidade emocional alta

**Problema:** três clímaxes seguidos (WhatsApp · split · tipografia).

**Sugestão:**
- **Mover seção 12 (WhatsApp)** para antes da seção 10 (destravamento) — primeiro sinal humano antes do conflito de mensuração
- Nova ordem: …→ 10 Destravando → **12 WhatsApp** → 13 Split → 14 Tipografia → 15 Decisão

---

### 4. Seções 05 + 06 — texto similar (contexto + obstáculo)

**Problema:** mercado local (05) e conta travada (06) podem sentir redundância.

**Sugestão:**
- **Fundir 05 em 02** — contexto de mercado vira 1 frase no Retrato do Cliente
- Manter 06 como primeiro beat de conflito visual

---

### 5. Seção 26 (Aprendizados) após 25 (Honestidade)

**Problema:** texto em cards após bloco editorial — ritmo similar.

**Sugestão:**
- Transformar aprendizados em **4 micro-fragments** intercalados no scroll da seção 25, ou
- Visualizar como **horizontal scroll** de cards (1 por viewport snap) em vez de grid 2×2

---

### 6. Duração total ~4min30

**Problema:** cases premium ideal ficam entre 2min30–3min30 de scroll.

**Sugestão de corte para MVP:**
- Eliminar: 05 (fundir), 09 (fundir), 11 (fundir), 18 (fundir em 24), 27 (P2 — next projects pode ficar só no layout genérico)
- **MVP: 22 seções** em vez de 28

---

# Ordem final recomendada (pós-revisão)

```
01 Hero
02 Retrato (+ mercado local fundido)
03 Mockup LP
04 Constraint R$50
06 Conta Travada          ← conflito visual
07 Decisão Funil
08 Comparativo 5 vs 3      ← inclui decisão simplificar
10 Destravando             ← inclui decisão abrir keywords
12 WhatsApp                ← movido para cá
13 Realidade vs Painel
14 Um Caractere
15 Decisão Medir
16 CPC Sequence
17 Transição Ato
19 Quote Viviane           ← números movidos para depois
24 Resultado Final         ← bento único consolidado
20 Funil Camadas
21 Oscilação 2 dias
22 Decisão Manter Curso
23 Parceria Timeline
25 Honestidade
26 Aprendizados (horizontal scroll)
27 Next Projects (opcional P2)
28 CTA
```

---

# Checklist pré-implementação

- [ ] Aprovar citação Viviane para uso público
- [ ] Confirmar matrículas [A CONFIRMAR] ou manter bloco honestidade
- [ ] Confirmar período exato das métricas (~2 semanas)
- [ ] Produzir mockup mobile LP UNIP
- [ ] Definir foto polo / Viviane (ou seguir sem foto)
- [ ] Validar uso logo UNIP com brandbook institucional
- [ ] Aprovar ordem MVP (22 seções) vs. completa (28 seções)

---

*Storyboard v1.0 · Base: case editorial UNIP Caraguatatuba · Próximo passo: implementação visual seguindo P0*
