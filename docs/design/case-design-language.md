# Raise One — Linguagem Visual dos Cases

> **Status:** Especificação oficial · v1.0  
> **Escopo:** Todos os Cases premium da Raise One  
> **Relacionamento:** Este documento define *como* implementar. O storyboard de cada case define *o quê* e *em que ordem*.  
> **Regra de precedência:** Storyboard do case > texto editorial > este documento (para conteúdo). Este documento prevalece sobre improvisação visual.

---

## Princípio fundador

Um Case da Raise One não é uma landing page, não é um artigo de blog e não é um deck de apresentação convertido em scroll.

É uma **experiência narrativa premium** — o visitante percorre uma história com ritmo, tensão, clareza e honestidade. Cada componente premium existe para cumprir uma função dramática específica. Nenhum componente existe para decorar.

**Regra de ouro:** nunca duas seções do mesmo tipo de layout em sequência.

---

## Fundamentos compartilhados

Antes dos componentes, estes tokens e regras aplicam-se a **todos** os Cases.

### Tokens visuais (sistema)

| Token | Valor / referência | Uso em Cases |
|---|---|---|
| `--background` | `oklch(0.145 0 0)` | Fundo base da experiência |
| `--foreground` | `oklch(0.98 0 0)` | Texto principal |
| `--surface` | `oklch(0.18 0.005 60)` | Cards, blocos inset |
| `--surface-elevated` | `oklch(0.215 0.006 60)` | Seções elevated, quotes |
| `--brand` | `oklch(0.72 0.19 48)` | Destaque, bordas ativas, acentos |
| `--brand-soft` | brand @ 12% opacity | Fundos de highlight |
| `--muted-foreground` | `oklch(0.65 0.01 60)` | Corpo, captions, meta |
| `--border` | white @ 8% | Divisores, bordas de card |
| `--radius-lg` | `0.75rem` | Cards padrão |
| `--radius-xl` | `1rem+` | Cards premium, CTA |
| `--font-sans` | Inter | Corpo, meta, labels |
| `--font-display` | Inter Tight | Títulos, números hero, statements |

### Tokens tipográficos (Cases)

| Nível | Escala desktop | Tracking | Peso |
|---|---|---|---|
| Display XL | 72–96px | −0.04em | Bold |
| Display L | 44–56px | −0.03em | Bold |
| Heading | 36–44px | −0.03em | Bold |
| Body L | 18–20px | normal | Regular |
| Body | 16–18px | normal | Regular |
| Eyebrow | 11px | +0.32em | Semibold, uppercase |
| Caption | 12–13px | +0.1–0.2em | Medium |

**Line-height:** corpo 1.75–1.8 · display 1.02–1.08 · quotes 1.2–1.35.

### Tokens de espaçamento (Cases)

| Token | Valor | Uso |
|---|---|---|
| `section-y` | `py-24 sm:py-32` | Padding vertical padrão de seção |
| `section-y-hero` | `min-h-screen` | Hero, momentos fullscreen |
| `section-y-breath` | `min-h-[50vh]` | Transições de ato, respiro |
| `container-max` | `max-w-7xl` | Largura máxima de conteúdo |
| `prose-narrow` | `max-w-2xl` | Decision blocks, editorial estreito |
| `prose-editorial` | `max-w-3xl` | Quotes, honestidade |
| `gap-section` | `gap-12 lg:gap-16` | Entre colunas em splits |
| `card-padding` | `p-6 sm:p-8 lg:p-10` | Cards premium |

### Tokens editoriais (Cases)

| Token | Regra |
|---|---|
| **Headline de decisão** | 1 frase · máx. 15 palavras |
| **Corpo de decisão** | 2 frases · máx. 40 palavras |
| **Caption de decisão** | 1 linha · opcional · uppercase ou estrutura final |
| **Statement tipográfico** | máx. 8 palavras na tela principal |
| **Contexto tipográfico** | 1 parágrafo · máx. 25 palavras · abaixo do fold visual |
| **Eyebrow** | 1–3 palavras · função de orientação, não título |
| **Número hero** | 1 métrica dominante por momento |
| **Lista de contexto** | 2–4 itens curtos · fragmentos, não parágrafos |
| **Lacunas editoriais** | Preservar `[A CONFIRMAR]` · nunca inventar dado |

### Variantes de seção

| Variante | Fundo | Quando |
|---|---|---|
| `default` | background | Seções narrativas padrão |
| `elevated` | surface/20 | Constraint, CPC, parceria |
| `dark` | surface/40 | Split dramático, funil, aprendizados |
| `inset` | surface/10 | Decision blocks isolados |
| `fullscreen` | edge-to-edge | Hero, mockup, tipografia |
| `breath` | mínimo | Transições de ato |

---

# Componentes Premium

---

## CaseDecisionBlock

### Propósito

Registrar uma **escolha estratégica explícita** — o momento em que a Raise One explica *como pensa*, não apenas *o que fez*. Estabelece o padrão visual de blocos "Decisão" editoriais em toda a biblioteca de Cases.

Responde à pergunta do visitante: *"Qual foi a call — e por quê?"*

### Emoção transmitida

Confiança · Clareza · Respeito pelo método · Convicção calma

Nunca entusiasmo performático. A decisão é apresentada como consequência lógica, não como vitória.

### Quando utilizar

- Após um conflito ou tensão narrativa (conta travada, painel vs. realidade, oscilação)
- Quando o case editorial contém bloco explícito "Decisão"
- Para cristalizar uma escolha entre alternativas (funil integrado, medir antes de otimizar, manter curso)
- Como footer de seções fundidas (ex.: decisão de simplificar após comparativo estratégico)
- Máximo **3 blocos standalone** por case (demais decisões devem ser fundidas a seções adjacentes)

### Quando não utilizar

- Para listar deliverables ou escopo técnico
- Como substituto de parágrafo narrativo comum
- Em sequência de dois Decision Blocks sem seção de layout diferente entre eles
- Para "decisões" triviais ou óbvias (ex.: "decidimos usar Google Ads")
- Quando não há conflito ou stakes precedentes — a decisão perde peso dramático
- Como card de feature ou bullet point estilizado

### Hierarquia visual

1. **Label** — `"Decisão"` · eyebrow com peso visual · brand/70
2. **Headline** — 1 frase · semibold–bold · foreground
3. **Body** — 2 frases max · muted-foreground
4. **Caption** — opcional · estrutura final, nomenclatura ou consequência · uppercase discreto
5. **Container** — card elevated · borda brand/20 · fundo surface/30

### Composição

- Card centralizado · `max-w-2xl` · nunca full-width
- Variante `inset`: seção com fundo surface/10 e padding generoso ao redor
- Sem ícones obrigatórios · opcional: ícone line monocromático (funil, régua, alvo)
- Sem imagens · tipografia e container são o asset
- Pode aparecer como bloco standalone ou como footer de `CaseStrategyCompare` / scroll narrative

### Espaçamento

- Padding interno: `p-8 sm:p-10`
- Label → headline: `mt-4`
- Headline → body: `mt-3`
- Body → caption: `mt-4`
- Seção externa: `py-24 sm:py-32`
- Margem lateral mínima: `px-5 sm:px-8`

### Densidade textual

**Baixa–média.** Total máximo ~60 palavras por bloco. Headline carrega o peso semântico; body apenas contextualiza. Caption é fragmento, não parágrafo.

### Comportamento responsivo

- Mobile: card ocupa ~90% da largura útil · texto left-aligned
- Desktop: card centralizado · hover sutil na borda brand (opacity 0.6 → 1.0)
- Nunca empilhar múltiplos Decision Blocks no mobile sem respiro entre seções pai

### Tokens visuais

- Borda: `border-brand/20`
- Fundo: `bg-surface/30`
- Radius: `rounded-2xl`
- Label: `text-[11px] uppercase tracking-[0.32em] text-brand`
- Headline: `text-lg sm:text-xl font-semibold leading-snug`

### Tokens editoriais

- Label fixo: `"Decisão"` (não traduzir, não variar)
- Headline no tempo presente ou infinitivo pessoal: *"Tratar o projeto como funil integrado"*
- Body explica o *porquê*, nunca repete o headline
- Caption usa estrutura concreta quando aplicável: *"EAD · Cursos · Pós-graduação"*

### Exemplos de uso

- Após flatline de estagnação: *"Tratar o projeto como funil integrado — não como peças isoladas."*
- Após split realidade/painel: *"Priorizar a correção da mensuração antes de qualquer otimização."*
- Após timeline de oscilação: *"Manter a estratégia de lance mesmo diante de um dia ruim."*
- Como footer do comparativo 5 vs 3, fundindo decisão de simplificar

### Exemplos de uso incorreto

- Card com 5 bullet points de entregas (*"LP, Ads, GTM, CRM, relatórios"*)
- Headline genérica: *"Focamos em resultados"*
- Dois Decision Blocks consecutivos sem split, quote ou tipografia entre eles
- Decision Block como primeira seção do case (antes de estabelecer conflito)
- Borda verde de "sucesso" ou checkmark animado

---

## CaseRealitySplit

### Propósito

Materializar o **conflito entre operação real e dado de painel** — o clímax dramático de casos onde mensuração, percepção ou reporting falham. Cria tensão visual imediata entre duas verdades simultâneas.

Responde: *"E quando os números mentem?"*

### Emoção transmitida

Surpresa · Tensão · Admiração pelo diagnóstico · Desconfiança saudável em dashboards

### Quando utilizar

- Quando existe divergência documentada entre realidade operacional e métricas reportadas
- Como clímax do Ato 2 (conflito) antes de resolução
- Quando WhatsApp, CRM ou campo humano contradiz plataforma de ads/analytics
- Uma vez por case · impacto dilui se repetido

### Quando não utilizar

- Como before/after de design (usar showcase, não split)
- Para comparar duas estratégias (usar `CaseStrategyCompare`)
- Quando ambos os lados são abstratos sem ancoragem humana
- Para exibir screenshots literais de Google Ads, Tag Assistant ou GTM
- Como seção de resultados (usar bento ou metric sequence)
- Quando não há conflito real documentado — inventar divergência destrói credibilidade

### Hierarquia visual

1. **Painel esquerdo — Realidade** · label · status · descrição curta · tom quente/vivo
2. **Divisor central** · `"≠"` · badge circular · desktop only
3. **Painel direito — Painel** · label · status numérico · tom frio/desaturado
4. **Parágrafo de síntese** · abaixo do split · max-w-2xl · centrado

Ordem de leitura: Realidade → Painel → Síntese.

### Composição

- Split 50/50 · fullscreen width · `min-h-[80vh]`
- Variante `dark` · fundo surface/40
- Esquerda: emerald/verde sutil no label · ícone ou indicador de canal humano (WhatsApp estilizado)
- Direita: muted · número `"0"` tipográfico como punch visual
- Parágrafo de fechamento separado do split, com respiro (`mt-12`)

### Espaçamento

- Painéis internos: `p-8 sm:p-12`
- Split ocupa largura total da viewport (fullBleed)
- Síntese: `max-w-2xl mx-auto mt-12 px-5`
- Entre label e status: `mt-4` · status → descrição: `mt-3`

### Densidade textual

**Baixa.** Máximo 2 frases por painel + 1 parágrafo de síntese (~40 palavras total no split). Status é fragmento, não sentença.

### Comportamento responsivo

- Mobile: stack vertical · Realidade acima · Painel abaixo · divisor `"≠"` horizontal ou omitido
- Desktop: split horizontal · divisor central flutuante
- Status numérico do painel mantém escala display mesmo em mobile

### Tokens visuais

- Realidade label: `text-emerald-400/80`
- Painel label: `text-muted-foreground/70`
- Divisor: `border-white/10 bg-background rounded-full`
- Status display: `text-3xl sm:text-4xl font-display font-bold`
- Variante seção: `dark`

### Tokens editoriais

- Labels fixos recomendados: `"Realidade"` / `"Painel"` (ou equivalentes aprovados no storyboard)
- Status da realidade: verbo presente · *"Mensagens chegando"*
- Status do painel: dado literal · *"0 conversões"*
- Síntese generaliza o conflito sem culpar ferramenta específica
- Proibido: nomes de tags, IDs, plataformas de auditoria

### Exemplos de uso

- Realidade: mensagens WhatsApp confirmadas pela cliente · Painel: zero conversões
- Realidade: leads no CRM · Painel: custo por lead inflado por duplicata
- Síntese: *"Quem confia apenas no painel toma decisões erradas."*

### Exemplos de uso incorreto

- Split "Antes / Depois" de redesign
- Lado esquerdo com screenshot de Google Ads
- Glitch effect, alarme vermelho piscando, sirene visual
- Três colunas (Realidade / Painel / Solução) — solução vai em Decision Block
- Split genérico "Problema / Soluído" sem dados concretos

---

## CaseConstraintMoment

### Propósito

Criar **tensão econômica** — internalizar que o resultado foi alcançado com recursos mínimos. Ancora stakes antes do conflito técnico.

Responde: *"Isso foi feito com quanto?"*

### Emoção transmitida

Surpresa · Respeito · Curiosidade amplificada · Admiração pela eficiência

### Quando utilizar

- Quando budget, prazo ou recurso humano é constraint central do case
- Após mockup/entrega concreta · antes do primeiro obstáculo
- Quando o número amplifica o impacto dos resultados posteriores
- Uma vez por case como momento dedicado

### Quando não utilizar

- No hero (reservar para seção dedicada — evita spoiler visual)
- Para listar tabela de investimento mensal
- Quando budget não é diferencial narrativo
- Com animação de moedas, cofres ou gráficos financeiros
- Repetido em múltiplas seções (mencionar inline depois, não repetir momento)
- Como badge flutuante sobre imagem

### Hierarquia visual

1. **Número hero** — monumental · display 8xl+ · ex.: `R$50`
2. **Sufixo** — subscripto pequeno · ex.: `/dia`
3. **Linhas de contexto** — 2–3 fragmentos · abaixo do número
4. **Fundo** — elevated · espaço negativo dominante

### Composição

- Center stage · tipografia como único asset
- Variante `elevated` · `min-h-[60vh] max-h-[80vh]`
- Sem imagens · opcional: grain texture sutil @ 3–5% opacity
- Sem parágrafos · apenas fragmentos em lista vertical

### Espaçamento

- Seção: `py-24 sm:py-32` · conteúdo verticalmente centrado
- Número → sufixo: inline · sufixo em escala ~30% do número
- Número → contexto: `mt-10`
- Entre linhas de contexto: `space-y-2`

### Densidade textual

**Mínima.** Máximo 15 palavras além do número hero. Cada linha de contexto: 2–4 palavras.

### Comportamento responsivo

- Número escala: `text-7xl sm:text-8xl lg:text-9xl`
- Contexto permanece centrado em todas as breakpoints
- Nunca truncar número por overflow — ajustar escala, não ellipsis

### Tokens visuais

- Número: `font-display font-bold tracking-[-0.04em]`
- Sufixo: `text-muted-foreground text-2xl sm:text-3xl`
- Contexto: `text-base sm:text-lg text-muted-foreground`
- Fundo: `elevated` · `bg-surface/20`

### Tokens editoriais

- Número sempre com unidade explícita: `R$50/dia`, `3 semanas`, `1 pessoa`
- Fragmentos de contexto em tom factual: *"Conta nova." · "Zero histórico." · "Algoritmo conservador."*
- Sem comparativo com outros clientes
- Sem justificativa de preço da Raise One

### Exemplos de uso

- `R$50` + `/dia` + três fragmentos de contexto operacional
- `14 dias` + *"Do zero ao funil validado."*
- `1 dev` + *"LP, ads, mensuração, acompanhamento."*

### Exemplos de uso incorreto

- Budget badge gigante no hero
- Planilha de investimento mensal
- Gráfico de pizza de budget allocation
- Count-up animado agressivo que distrai da leitura
- Constraint seguido imediatamente de outro constraint

---

## CaseTypographicMoment

### Propósito

Criar um **momento tipográfico memorável** — quando um insight mínimo tem impacto desproporcional. A tipografia *é* o visual.

Responde: *"Como um detalhe mínimo muda tudo?"*

### Emoção transmitida

Surpresa · Respeito · Incredulidade controlada · Silêncio intelectual

### Quando utilizar

- Para o insight mais forte e compacto do case
- Quando revelar o detalhe técnico literal seria anti-climático ou quebraria privacidade
- Após sequência de alta tensão (split, conflito) · antes de resolução
- Uma vez por case · raridade aumenta impacto

### Quando não utilizar

- Para títulos de seção comuns (usar Heading)
- Para exibir código, strings, IDs ou caracteres literais do bug
- Com efeito hacker, matrix rain ou terminal aesthetic
- Quando o insight precisa de parágrafo longo para fazer sentido
- Como hero do case
- Repetido em variações (*"1 pixel"*, *"1 linha"*, *"1 tag"*) — dilui

### Hierarquia visual

1. **Linha primária** — monumental · ex.: *"1 caractere."*
2. **Linha secundária** — display menor · muted · ex.: *"Toda a mensuração. Invalidada."*
3. **Contexto** — opcional · 1 parágrafo · abaixo · max-w-xl · só se storyboard exigir
4. **Fundo** — escuro · silêncio total · sem imagem

### Composição

- Fullscreen ou `min-h-[80vh]` · texto centrado
- Máximo **8 palavras** na composição principal (linhas 1 + 2)
- Variante `default` ou fundo próximo ao background puro
- Sem eyebrow · sem meta · sem botões
- Aspas decorativas **proibidas** aqui (reservadas para Quote)

### Espaçamento

- Padding vertical generoso: `py-24 sm:py-32`
- Linha 1 → linha 2: `mt-4`
- Linha 2 → contexto: `mt-10`
- Conteúdo: `max-w-4xl mx-auto text-center`

### Densidade textual

**Mínima na composição principal.** Zero parágrafos acima do fold. Contexto opcional: máx. 25 palavras, tom explicativo neutro.

### Comportamento responsivo

- Linha primária: `text-4xl sm:text-5xl lg:text-6xl`
- Linha secundária: ~80% da primária · `text-muted-foreground`
- Quebra de linha controlada · evitar viúva isolada no mobile
- Nunca reduzir abaixo de `text-3xl` na linha primária

### Tokens visuais

- Font: `font-display font-bold tracking-tight`
- Cor primária: `foreground`
- Cor secundária: `muted-foreground`
- Fundo: background puro ou surface/40 mínimo
- Sem brand color na statement — neutralidade aumenta gravidade

### Tokens editoriais

- Formato recomendado: `[Quantidade mínima] + [ substantivo ]` · *"1 caractere."*
- Segunda linha: consequência absoluta · tempo passado ou presente
- **Nunca** exibir o caractere, string, arquivo ou ferramenta literal
- Tom: factual, não dramático demais · sem pontos de exclamação

### Exemplos de uso

- *"1 caractere."* / *"Toda a mensuração. Invalidada."*
- *"3 segundos."* / *"O funil inteiro. Sem rastreio."*
- *"1 evento."* / *"Duplicado. CPA pela metade."*

### Exemplos de uso incorreto

- Exibir `L` vs `1` literalmente
- Terminal com código JavaScript caindo
- Statement de 20 palavras em fonte pequena
- Usar para CTA (*"Pronto para crescer?"*)
- Tipografia colorida em gradiente brand

---

## CaseMetricFlatline

### Propósito

Visualizar **estagnação abstrata** — o momento em que nada se move apesar de investimento ou esforço. Contraste narrativo com momentos de momentum (curva ascendente).

Responde: *"O que deu errado primeiro?"*

### Emoção transmitida

Tensão · Frustração reconhecível · Antecipação · Empatia com o bloqueio

### Quando utilizar

- Primeiro obstáculo do case · antes de qualquer decisão estratégica
- Quando campanha, produto ou operação está "travada" sem dados de pico
- Como par visual de `CaseMomentumVisual` (flatline → curva)
- Quando números reais ainda não devem aparecer

### Quando não utilizar

- Com screenshot de plataforma de ads ou analytics
- Com spinner, loading ou skeleton como metáfora
- Para mostrar queda (queda tem curva — usar outro componente)
- Quando já há resultados positivos na mesma seção
- Com métricas literais zeradas de dashboard
- Como gráfico de performance real

### Hierarquia visual

1. **Visual abstrato** — linha horizontal quase reta · domina 50% da seção
2. **Eyebrow** — orientação · ex.: *"O primeiro obstáculo"*
3. **Título** — 3–6 palavras
4. **Corpo** — 2 frases max
5. **Fechamento** — 1 frase com tom de método · opcional

### Composição

- Split: visual + texto
- Mobile: visual acima · texto abaixo
- Desktop: 50/50 horizontal · visual pode ser esquerda ou direita
- Linha SVG monocromática · stroke 1.5–2px · sem eixos, labels ou grid
- Fundo do visual: surface/30 · sem dados numéricos no gráfico

### Espaçamento

- Seção: `py-24 sm:py-32`
- Grid split: `gap-12 lg:gap-16`
- Visual: `aspect-[16/9]` ou `aspect-[4/3]`
- Eyebrow → título: `mt-5` (padrão Case)

### Densidade textual

**Baixa.** Máx. 50 palavras no bloco textual. Sem números reais. Sem terminologia de mídia paga.

### Comportamento responsivo

- Visual mantém proporção · nunca cropa linha
- Texto full-width abaixo do visual no mobile
- Linha desenhada left-to-right em viewport (motion Fase 3)

### Tokens visuais

- Linha: `stroke-white/40` ou `stroke-muted-foreground/50`
- Fundo visual: `bg-surface/30 border border-dashed border-white/10`
- Sem vermelho · sem verde · monocromático
- Stroke cap: round · sem animação de pulse na linha

### Tokens editoriais

- Título no passado ou presente descritivo: *"A conta travada"*
- Corpo descreve sintoma, não causa técnica
- Fechamento aponta postura: *"Nós escolhemos entender primeiro."*
- Proibido: nomes de campanhas, ad groups, keywords

### Exemplos de uso

- Linha flat + *"Havia investimento — mas o sistema parecia parado."*
- Linha flat antes de destravamento de keywords
- Linha flat em case de produto: *"Tráfego entrava. Ninguém convertia."*

### Exemplos de uso incorreto

- Screenshot Google Ads com "Impressões: 12"
- Gráfico com eixo Y e tooltip
- Spinner de loading como metáfora de espera
- Linha com picos (não é flatline)
- Seção com 3 parágrafos explicando algoritmo do Google

---

## CaseQuotePremium

### Propósito

Entregar **prova social qualitativa** com peso editorial — humanizar resultados através da voz do cliente. O quote é evidência emocional, não decoração.

Responde: *"O que a cliente diz?"*

### Emoção transmitida

Confiança · Autenticidade · Empatia · Calor humano

### Quando utilizar

- Quando existe citação real aprovada para uso público
- Após números ou antes de funil — posição definida no storyboard
- Para validar impacto qualitativo que métricas não capturam
- Uma citação principal por case · raras exceções com 2 quotes distantes

### Quando não utilizar

- Citação não aprovada pela cliente (usar nota + placeholder interno)
- Carrossel de múltiplos depoimentos
- Avatar stock ou foto genérica
- Screenshot de WhatsApp como suporte da citação
- Quote genérica da Raise One sobre si mesma
- Quando a citação repete verbatim o bento de resultados

### Hierarquia visual

1. **Aspas decorativas** — display · opacity 0.15 · brand ou foreground
2. **Citação** — font display · 2xl–4xl · leading tight
3. **Autor** — nome · semibold
4. **Cargo / contexto** — muted · 1 linha
5. **Nota legal** — opcional · xs · aprovação pendente
6. **Foto** — opcional · circular · pequena · abaixo do nome

### Composição

- Fullscreen editorial · `min-h-[70vh]`
- Variante `elevated` · fundo surface/20 ou gradient brand sutil
- Max-width: `max-w-3xl` · centrado
- Padding generoso · sem imagem de fundo competindo com texto
- Blockquote semântico · cite para autor

### Espaçamento

- Seção: `py-24 sm:py-32`
- Aspas → citação: `mt-4`
- Citação → autor: `mt-10`
- Autor → nota: `mt-4`
- Foto: `mt-6` · 48–64px diameter

### Densidade textual

**Média na citação · mínima no entorno.** Citação: 1–3 frases naturais. Autor + cargo: 2 linhas. Nota: 1 linha.

### Comportamento responsivo

- Citação escala: `text-2xl sm:text-3xl lg:text-4xl`
- Aspas decorativas reduzem em mobile · não quebram layout
- Foto opcional oculta em mobile se competir com espaço (decisão do storyboard)

### Tokens visuais

- Aspas: `text-8xl text-brand/15 font-display leading-none`
- Citação: `font-display font-medium leading-snug tracking-tight`
- Autor: `font-semibold text-foreground`
- Cargo: `text-sm text-muted-foreground`
- Nota: `text-xs text-muted-foreground/60`
- Fundo: elevated · gradient radial brand @ 5–8%

### Tokens editoriais

- Citação verbatim do case editorial · sem edits de marketing
- Autor: nome real · cargo contextual (*"Polo UNIP Caraguatatuba"*)
- Nota obrigatória se aprovação pendente: *"Citação sujeita a aprovação da cliente"*
- Tom da citação preservado — incluindo hesitações honestas (*"Ainda não tivemos matrículas"*)
- Proibido: rewrite para soar mais vendável

### Exemplos de uso

- Quote após transição de ato · antes do bento final
- Citação que menciona procura sem inventar matrículas
- Quote única fullscreen com Viviane / decisor

### Exemplos de uso incorreto

- *"A Raise One transformou nosso negócio!"* — genérica, sem especificidade
- Carrossel com 4 depoimentos
- Foto stock de executiva sorrindo
- Quote dentro de card pequeno no meio de parágrafo
- Vídeo autoplay de depoimento como substituto

---

## CaseFunnelLayers

### Propósito

Explicar **visualmente onde o funil funciona e onde o gargalo migrou** — honestidade estrutural sobre etapas completas vs. pendentes.

Responde: *"O que funcionou — e o que falta?"*

### Emoção transmitida

Clareza · Honestidade · Respeito pela complexidade · Maturidade analítica

### Quando utilizar

- Cases de aquisição, funil, growth — quando há etapas sequenciais identificáveis
- Após resultados quantitativos · para contextualizar limites
- Como referência visual para `CaseHonestGap` (callback de etapa pendente)
- Quando matrícula/conversão final ainda não aconteceu

### Quando não utilizar

- Para listar goals genéricos (usar GoalsSection)
- Funil 3D rotativo ou infográfico de marketing stock
- Quando taxas de conversão por etapa não existem e seriam inventadas
- Com etapa final em vermelho alarmista
- Para substituir ProcessTimeline de metodologia
- Quando o case não tem funil (ex.: rebranding puro)

### Hierarquia visual

1. **Diagrama vertical** — 3–5 etapas · label cada
2. **Estados visuais** — complete · pending · gap
3. **Eyebrow + título + corpo** — bloco explicativo
4. **Etapa pendente** — outline dashed · *"Próximo capítulo"* · pulse sutil

Ordem das etapas: topo → base (Anúncio → LP → WhatsApp → Matrícula).

### Composição

- Diagrama + texto em split
- Desktop: diagrama left · texto sticky right (`lg:sticky lg:top-24`)
- Mobile: diagrama → texto
- Etapas completas: `border-brand/30 bg-brand/5`
- Etapa pendente: `border-dashed border-white/20 opacity-70`
- Índice numérico por etapa: `01`, `02`…
- SVG ou cards — minimal · monocromático + brand accent

### Espaçamento

- Entre etapas: `space-y-4`
- Card de etapa: `px-5 py-4`
- Split: `gap-12 lg:gap-16`
- Seção: `py-24 sm:py-32`

### Densidade textual

**Média no bloco explicativo · mínima no diagrama.** Labels de etapa: 1–3 palavras. Corpo: 2–3 frases.

### Comportamento responsivo

- Diagrama full-width no mobile
- Sticky desativado abaixo de `lg`
- Etapas não horizontalizam no mobile — permanecem verticais
- Pulse da etapa pendente respeita `prefers-reduced-motion`

### Tokens visuais

- Complete: `border-brand/30 bg-brand/5`
- Pending: `border-dashed border-white/20`
- Índice: `text-xs font-semibold rounded-full border border-white/10`
- Label pending: `text-[10px] uppercase tracking-wider text-muted-foreground`
- Variante seção: `dark`

### Tokens editoriais

- Labels de etapa: linguagem do decisor · *"Anúncio"*, *"Landing Page"*, *"WhatsApp"*, *"Matrícula"*
- Estado pendente: *"Próximo capítulo"* — nunca *"Falhou"* ou *"Problema"*
- Corpo explica migração do gargalo, não culpa etapa
- Proibido: taxas inventadas · *"40% de conversão na LP"*

### Exemplos de uso

- Três etapas completas + Matrícula pendente em case de captação
- Callback visual em CaseHonestGap reutilizando etapa Matrícula
- Funil pós-quote · antes de oscilação

### Exemplos de uso incorreto

- Funil 3D com setas animadas
- Etapa "Matrícula" em vermelho com X
- CRM screenshot como etapa
- 8 etapas micro (ex.: impressão → clique → scroll → ...)
- Funil sem etapa pendente quando case documenta lacuna

---

## CaseHonestGap

### Propósito

Construir **credibilidade por transparência** — declarar explicitamente o que ainda não aconteceu. Diferencial raro em cases de agência.

Responde: *"Eles escondem algo?"*

### Emoção transmitida

Respeito · Confiança amplificada · Maturidade · Integridade

### Quando utilizar

- Quando resultado parcial é documentado (leads sem matrícula, MVP sem escala)
- Após bento de resultados · antes de aprendizados
- Quando `[A CONFIRMAR]` existe no editorial — preservar honestidade
- Uma vez por case · posição de fechamento do arco quantitativo

### Quando não utilizar

- Como desculpa longa ou justificativa defensiva
- Para culpar comercial do cliente
- Com projeções futuras inventadas (*"50 matrículas em 90 dias"*)
- Quando não há lacuna real — forçar honestidade vazia parece performática
- Repetir verbatim o funil inteiro (usar callback visual mínimo)
- Tom alarmista ou vermelho

### Hierarquia visual

1. **Eyebrow** — *"Transparência"*
2. **Título** — frase direta · sem eufemismos
3. **Corpo** — 2 frases · factual
4. **Subline** — princípio generalizado · funil em camadas
5. **Callback visual** — mini etapa "Matrícula" outline · reuso de CaseFunnelLayers

### Composição

- Editorial narrow · `max-w-3xl`
- Layout: texto + callback visual lateral
- Mobile: texto → callback abaixo
- Tom neutro · sem bento · sem números
- Callback: quadrado outline 96px · label *"Matrícula"*

### Espaçamento

- Seção: `py-24 sm:py-32`
- Grid texto + callback: `gap-12`
- Padding generoso · mais whitespace que seção padrão
- Variante: `default` — contraste com bento anterior

### Densidade textual

**Média.** Título: 6–10 palavras. Corpo: 2 frases. Subline: 1–2 frases. Total ~60–80 palavras.

### Comportamento responsivo

- Callback visual centralizado no mobile
- Texto nunca excede `max-w-3xl`
- Pulse do callback sincronizado com etapa pendente do funil (mesmo token)

### Tokens visuais

- Callback: `border-dashed border-white/20 h-24 w-24`
- Label callback: `text-[10px] uppercase tracking-wider text-muted-foreground`
- Sem brand highlight — neutralidade
- Eyebrow padrão Cases

### Tokens editoriais

- Preservar `[A CONFIRMAR]` literalmente quando aplicável
- Frases diretas: *"Matrículas fechadas no período: A CONFIRMAR."*
- Subline generaliza: *"Lead não é matrícula. Procura não é conversão comercial."*
- Proibido: *"Infelizmente o comercial da cliente não acompanhou"*
- Tom: define próximo capítulo, não diminui resultado anterior

### Exemplos de uso

- Após 23 conversões WhatsApp · matrículas não confirmadas
- Callback visual da etapa Matrícula do funil
- Bloco antes de aprendizados cristalizadores

### Exemplos de uso incorreto

- Parágrafo de 200 palavras explicando por que não houve matrícula
- Gráfico projetando conversão futura
- Tom negativo ou culpabilizante
- Honestidade como seção 02 (muito cedo — destrói arco)
- Omitir lacuna documentada no editorial

---

## CaseStrategyCompare

### Propósito

Visualizar **raciocínio de simplificação ou escolha estratégica** sem aula técnica — before/after conceitual, não de imagem.

Responde: *"Por que menos pode ser mais?"* ou *"Por que escolhemos A e não B?"*

### Emoção transmitida

Clareza · Alívio intelectual · *"Faz sentido"* · Convicção analítica

### Quando utilizar

- Decisão binária documentada: 5 vs 3 grupos, broad vs exact, MVP vs full
- Quando constraint (budget, tempo) torna fragmentação inviável
- Antes ou integrado a Decision Block de simplificação
- Quando visual abstrato comunica melhor que texto

### Quando não utilizar

- Before/after de design ou identidade visual
- Comparativo de screenshots literais
- Quando não há alternativa real considerada (decisão fake)
- Com animação de "batalha" entre lados
- Para comparar Raise One vs. concorrentes
- Com nomenclatura técnica de plataforma (ad groups, match types)

### Hierarquia visual

1. **Eyebrow + título + intro** — contexto mínimo
2. **Split 50/50** — lado fraco vs. lado forte
3. **Visual abstrato** por lado — fragmentado vs. consolidado
4. **Label + estado** por lado
5. **Decision footer** — opcional · fundido · caption ou CaseDecisionBlock

Lado esquerdo (alternativa rejeitada): opacity ~0.5–0.6 · sem borda brand.  
Lado direito (escolha): opacity 1 · `border-brand/30`.

### Composição

- Grid 2 colunas · `sm:grid-cols-2`
- Cards com placeholder visual abstrato (blocos, não screenshots)
- Caption única abaixo ou Decision Block fundido
- Intro: max 2 frases · constraint explícito

### Espaçamento

- Intro → split: `mt-12`
- Cards: `p-8` · visual interno `mt-6`
- Split → decision footer: `mt-16`
- Gap entre colunas: `gap-6`

### Densidade textual

**Baixa no split · média no footer.** Labels: 2–4 palavras. Estado: 1 frase fragmentada. Intro: 2 frases max.

### Comportamento responsivo

- Mobile: stack · escolha (lado direito) pode aparecer primeiro se storyboard indicar
- Visual abstrato mantém `aspect-[4/3]` em todas breakpoints
- Lado fraco permanece visualmente subordinado em mobile

### Tokens visuais

- Rejeitado: `opacity-60 border-white/[0.06] bg-surface/20`
- Escolhido: `border-brand/30 bg-surface/30`
- Labels: `font-display text-2xl font-bold`
- Estado: `text-sm text-muted-foreground`

### Tokens editoriais

- Labels curtos: *"5 grupos"* / *"3 grupos"*
- Estado descreve consequência: *"Fragmentado · Dados insuficientes"*
- Caption estrutural: *"EAD · Cursos · Pós-graduação"*
- Intro ancora constraint: *"Com R$50 por dia, cada decisão de estrutura importa."*
- Fundir decisão explícita como footer · evitar seção Decision separada

### Exemplos de uso

- 5 vs 3 ad groups com footer de simplificação
- MVP de 2 páginas vs. site completo de 12
- Campanha fragmentada vs. concentrada

### Exemplos de uso incorreto

- Screenshot antes/depois da LP
- Lado "Raise One" vs. "Agência X"
- Dois lados com mesma opacidade — escolha não fica clara
- Comparativo seguido de outro comparativo
- Nomes técnicos: *"Broad Match"* vs. *"Exact Match"*

---

# Princípios da Narrativa Visual

Estes princípios governam a **sequência**, o **ritmo** e a **experiência** de todos os Cases — independentemente do cliente ou indústria.

---

## Ritmo

O ritmo é a velocidade com que o visitante absorve tensão, informação e alívio.

**Regras:**

- Um Case premium ideal: **2min30 – 3min30** de scroll (Cases complexos: máx. 4min30 com justificativa no storyboard)
- Alternar seções de **peso visual alto** (hero, split, tipografia) com seções de **peso baixo** (decision card, transição de ato)
- Nunca empilhar três clímaxes emocionais consecutivos (ex.: WhatsApp → split → tipografia) — inserir respiro ou reordenar
- Decision Blocks: máx. 3 standalone · demais fundidos
- Bento de resultados: **um** por case na versão MVP

**Mapa de ritmo referência:**

```
Fullscreen → Split → Fullscreen → Tipografia → Visual abstrato → Decision
→ Comparativo → Scroll sticky → Micro mockup → Split dramático → Tipografia
→ Decision → Números → Respiro → Bento → Quote → Diagrama → Timeline
→ Decision → Timeline → Honestidade → Aprendizados → CTA
```

---

## Alternância

A alternância evita fadiga visual e mantém atenção.

**Regras:**

- **Nunca** duas seções do mesmo tipo de layout em sequência
- Alternar densidade: texto ↔ visual ↔ número ↔ silêncio
- Alternar escala: fullscreen ↔ coluna estreita ↔ card centrado
- Alternar tom emocional: tensão ↔ clareza ↔ impacto ↔ honestidade
- Fundir seções adjacentes quando risco de repetição (decisão + comparativo, decisão + scroll narrative)

**Matriz de alternância (simplificada):**

| Se veio… | Próximo ideal… |
|---|---|
| Fullscreen visual | Split ou editorial estreito |
| Decision Block | Comparativo, visual ou split |
| Tipografia monumental | Decision ou números |
| Bento métricas | Quote ou diagrama |
| Quote | Funil ou timeline |
| Timeline | Decision ou honestidade |

---

## Respiração

Respiração é espaço intencional — onde nada compete por atenção.

**Regras:**

- Seções de respiro: `CaseConstraintMoment`, transição de ato, `CaseTypographicMoment`
- Altura mínima de respiro: `50vh` (transição) a `80vh` (tipografia)
- Constraint e tipografia: **quase zero parágrafos**
- Entre atos: eyebrow + 1 linha · sem imagem
- Whitespace é asset — não preencher com decoração

**Quando respirar:**

- Após sequência densa (split + tipografia)
- Antes de entregar números finais
- Entre Ato 2 (conflito) e Ato 3 (evolução)

---

## Impacto

Impacto é o momento em que o visitante para de scrollar e absorve.

**Regras:**

- Máximo **1** momento tipográfico fullscreen por case
- Máximo **1** split dramático (`CaseRealitySplit`) por case
- Números hero: **1 métrica dominante** por seção · secundárias subordinadas
- Quote: peso lento · fade longo · sem competição visual
- Impacto dilui se repetido — preferir fusão a duplicação

**Hierarquia de impacto (decrescente):**

1. CaseTypographicMoment
2. CaseRealitySplit
3. CaseConstraintMoment
4. Bento hero metric
5. CaseQuotePremium
6. CaseDecisionBlock

---

## Progressão emocional

Cada Case segue arco dramático em 4 atos — a progressão emocional deve ser legível no scroll.

| Ato | Função | Emoções | Componentes típicos |
|---|---|---|---|
| **I — Contexto** | Stakes, constraint, obstáculo | Curiosidade → tensão | Hero, Retrato, Mockup, Constraint, Flatline |
| **II — Conflito** | Diagnóstico, divergência, virada | Frustração → surpresa → alívio | Decision, Compare, Momentum, WhatsApp, RealitySplit, Typographic |
| **III — Evolução** | Correção, ritmo, prova | Disciplina → satisfação → confiança | Decision, CPC, Transição, Quote, Bento |
| **IV — Honestidade** | Funil, limites, método | Clareza → respeito → inspiração | Funnel, Volatility, Decision, Partnership, HonestGap, Learnings, CTA |

**Regra:** não entregar resultado completo antes de estabelecer conflito. Não pedir conversão antes de demonstrar método.

---

## Uso de números

Números são evidência — não decoração.

**Regras:**

- **Antes do conflito resolvido:** evitar métricas de performance · flatline sem números
- **Constraint:** 1 número hero · contexto fragmentado
- **Sequência CPC:** horizontal · 3–5 valores · sem gráfico de eixos
- **Bento final:** 1 métrica hero (2×2) · demais subordinadas · nota de período se `[A CONFIRMAR]`
- **Formato:** moeda brasileira · `R$50` · `~R$28` · til para aproximação
- **Proibido:** números inventados · arredondamentos agressivos · percentuais sem base

**Progressão numérica recomendada:**

```
Teaser discreto (hero) → silêncio → constraint → silêncio → sequência CPC → bento consolidado
```

---

## Uso de imagens

Imagens provam, ambientam ou emocionam — nunca preenchem espaço vazio.

**Regras:**

- Hero: 1 imagem dominante · 70% viewport · parallax leve (Fase 3)
- Retrato: 0–1 foto · opcional · polo/equipe real · sem stock
- Abstratos (`CaseMetricFlatline`, momentum): SVG generativo · nunca screenshot de plataforma
- Proporções: hero 16/10–9/16 · mockup 9/16 · split visual 16/9 ou 4/3
- Overlay escuro sobre fotos · texto legível
- `[TODO: asset]` explícito quando imagem não existe — nunca improvisar stock genérico

**Proibido em Cases:**

- Estudante sorrindo stock
- Dashboards Google Ads / Meta Ads
- Gráficos de pizza
- Fotos de aperto de mão
- Mapas Google Maps crus

---

## Uso de mockups

Mockups mostram entrega concreta — transição do abstrato ao tangível.

**Regras:**

- **Seção 03 (Peça Central):** mockup heroico · fullscreen · escala máxima · 1 caption
- **Micro mockups** (WhatsApp, notificação): escala reduzida · split 50/50 · minimal
- Device frame neutro · não iPhone identificável se restrição de marca
- LP mockup: alta resolução · orientado à conversão · sem wireframe
- Máximo 2 momentos de mockup por case (LP hero + micro sinal)

**Hierarquia:**

1. Mockup LP — fullscreen · domina tela
2. Mockup WhatsApp — micro-showcase · quase Apple-like
3. Thumbnail opcional em célula de bento — P2

---

## Uso de quotes

Quotes humanizam — nunca substituem dados.

**Regras:**

- 1 quote principal · fullscreen · `CaseQuotePremium`
- Posição: após evolução documentada · antes ou depois de bento (storyboard decide)
- Citação verbatim · aprovação explícita · nota se pendente
- Quote qualitativa não repete número do bento
- Sem carrossel · sem avatar stock

**Tom:** honesto > vendável · incluir limites se cliente mencionou (*"Ainda não tivemos matrículas"*)

---

## Uso de silêncio visual

Silêncio visual é ausência intencional de estímulo — tipografia e espaço negativo como únicos elementos.

**Regras:**

- `CaseTypographicMoment`: fundo escuro · zero imagens · max 8 palavras
- `CaseConstraintMoment`: número + fragmentos · sem parágrafo
- Transição de ato: eyebrow + 1 linha · sem asset
- Mockup LP: caption única · silêncio ao redor
- Não preencher silêncio com ícones decorativos, patterns ou gradientes animados

**Silêncio ≠ vazio:** o silêncio concentra atenção no elemento restante.

---

## Checklist pré-implementação (por componente)

Antes de implementar qualquer componente premium, validar:

- [ ] Storyboard do case define posição e conteúdo
- [ ] Seção anterior e posterior têm layout diferente (alternância)
- [ ] Densidade textual dentro dos tokens editoriais
- [ ] Assets existem ou `[TODO]` explícito
- [ ] Lacunas `[A CONFIRMAR]` preservadas
- [ ] Motion (quando Fase 3) reforça narrativa — não decora
- [ ] Componente é reutilizável — sem acoplamento a cliente específico na API

---

## Governança documental

| Documento | Função |
|---|---|
| `docs/design/case-design-language.md` | **Este documento** — linguagem visual e componentes |
| `docs/cases/{slug}-storyboard.md` | Direção de arte e ordem por case |
| `docs/cases/{slug}-case.md` | Texto editorial definitivo |
| `docs/cases/{slug}-editorial-outline.md` | Classificação A/B/C do material |

**Fluxo:** outline → case editorial → storyboard → implementação conforme esta especificação.

---

*v1.0 · Raise One Hub · Referência oficial para implementação de Cases premium · Nenhum componente P0 deve ser implementado fora desta especificação.*
