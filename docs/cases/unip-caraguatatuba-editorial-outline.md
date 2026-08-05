# UNIP Caraguatatuba — Arquitetura Editorial do Case

> **Fonte:** `docs/cases/unip-dossier.md`  
> **Status:** Outline editorial — não é o texto final  
> **Público-alvo:** Empresário, diretor, gestor ou responsável por marketing

---

# Parte 1 — Classificação do material

Legenda:
- **A** — Essencial para o case
- **B** — Interessante mas secundária
- **C** — Apenas documentação interna

---

## Bloco 1 — Contexto e escopo (#1)

| Informação | Classe | Por quê |
|---|---|---|
| Viviane, responsável pelo Polo UNIP Caraguatatuba | **A** | Humaniza o cliente; ancora a história em uma operação real e local |
| Objetivo nunca foi só landing page, mas funil completo de captação | **A** | Diferencia abordagem estratégica de entrega pontual — responde "vocês têm método?" |
| Landing Page + Google Ads como núcleo | **A** | Define escopo do case publicável |
| Meta Ads "posteriormente" | **B** | Indica visão de longo prazo, mas não faz parte do arco principal documentado |
| Acompanhamento contínuo e otimizações | **A** | Mostra relação de evolução, não projeto fechado |

---

## Bloco 2 — Landing Page (#2)

| Informação | Classe | Por quê |
|---|---|---|
| LP própria construída para o polo | **A** | Prova entrega concreta |
| Hero, CTA WhatsApp, cursos, bolsas, FAQ, info do polo | **B** | Contextualiza a solução; detalhe de seções é secundário para decisor |
| SEO e identidade UNIP | **B** | Reforça qualidade, mas não é o núcleo dramático |
| Discussão de unir Hero + segunda seção, melhorar UX | **C** | Iteração interna de design — irrelevante para leitor externo |

---

## Bloco 3 — Estrutura inicial Google Ads (#3–4)

| Informação | Classe | Por quê |
|---|---|---|
| Campanha Search, objetivo Contatos, Maximizar Conversões | **B** | Contexto tático; útil mas não central para decisor |
| Orçamento R$50/dia | **A** | Constraint real — amplifica impressão de eficiência nos resultados |
| RSA com títulos, descrições, sitelinks, snippets | **C** | Detalhe de implementação de mídia |
| Comentário "anúncio ficou bonitão" | **C** | Tom interno; sem valor para case premium |

---

## Bloco 4 — Grupos de anúncios (#5)

| Informação | Classe | Por quê |
|---|---|---|
| Discussão inicial de 5 grupos | **B** | Mostra processo de pensamento |
| **Decisão:** reduzir para 3 grupos por orçamento limitado | **A** | Decisão estratégica sob restrição — prova maturidade |
| Risco de fragmentar dados e atrasar aprendizado | **A** | Demonstra raciocínio analítico |
| Estrutura final: EAD / Cursos / Pós | **B** | Ilustra organização; secundário para narrativa |

---

## Bloco 5 — Palavras-chave (#6, #8, #9)

| Informação | Classe | Por quê |
|---|---|---|
| Início com Exata + Frase, evitando ampla | **B** | Contexto da evolução |
| Resistência inicial à correspondência ampla | **A** | Humaniza o processo — cautela antes de mudança |
| Medo de perder controle e gastar mal | **B** | Pode ser sintetizado em uma frase no Ato 3 |
| Adoção posterior de amplas (sugestões Google) | **A** | Ponto de virada narrativo |
| Campanha "destravou" — mais impressões e cliques | **A** | Evidência de decisão correta |

---

## Bloco 6 — Primeira fase sem entrega (#7)

| Informação | Classe | Por quê |
|---|---|---|
| Campanha quase não entregava; poucas impressões/cliques | **A** | Obstáculo inicial — cria tensão no Ato 1/3 |
| Orçamento não era gasto; conta "travada" | **A** | Imagem mental forte para decisor |
| Hipóteses: aprendizado, Max Conversões, sem histórico | **B** | Mostra análise, mas é detalhe tático |

---

## Bloco 7 — Crise de mensuração (#10–16)

| Informação | Classe | Por quê |
|---|---|---|
| Leads chegavam (Viviane confirmava) mas Google mostrava 0 conversões | **A** | Conflito central — realidade vs. painel |
| Auditoria completa iniciada | **A** | Prova rigor diagnóstico |
| Hipóteses: GTM, Tag, Consent Mode, config Ads | **C** | Lista técnica interna |
| Uso do Tag Assistant | **C** | Ferramenta interna |
| Eventos existiam mas ação Lead WhatsApp inativa | **B** | Pode virar frase: "eventos disparavam, conversão não contava" |
| Bug: caractere `L` vs `1` no identificador de conversão | **B→A*** | *Essencial como **insight** ("um caractere invalidou toda a mensuração"), não como string/ID |
| String completa `e6hXCIWl5cccEMLvzY5E` | **C** | Documentação interna |
| Relatório solicitado ao Cursor | **C** | Meta-processo irrelevante |
| Fluxo WhatsAppButton → trackEvent → gtag → send_to | **C** | Arquitetura de código |
| 11 pontos de clique auditados | **C** | Detalhe de QA interno |
| Arquivo `src/lib/googleAds.ts` | **C** | Referência de código |
| Correção + deploy | **B** | Pode ser uma linha: "corrigido e validado" |
| Tag Assistant passou a mostrar Lead WhatsApp corretamente | **C** | Evidência interna de validação |
| Aprendizado: um caractere quebrou mensuração | **A** | Insight memorável — mostra profundidade sem expor código |

---

## Bloco 8 — Primeiros resultados e feedback (#17–20)

| Informação | Classe | Por quê |
|---|---|---|
| CPC caiu de ~R$7 para R$3,80 ao longo dos dias | **A** | Prova de otimização algorítmica |
| Primeiras mensagens nos primeiros dias | **A** | Validação real do funil |
| Pedido para contabilizar quantidade, qualidade, matrícula | **B** | Mostra método de acompanhamento |
| 4 mensagens, pouco interessados/curiosos | **B** | Honestidade inicial; contexto antes do crescimento |
| Procura aumentou mesmo com leads fracos | **A** | Antecipa resultado qualitativo |
| Viviane menciona projeto Pousada Itanhaém | **A** | Prova social de confiança e upsell |
| "Principal investimento continuará sendo UNIP" | **B** | Reforça priorização; secundário |

---

## Bloco 9 — Performance consolidada (#21–25)

| Informação | Classe | Por quê |
|---|---|---|
| 3–7 conversões/dia após ajustes | **A** | Resultado operacional forte |
| ~2 semanas: R$655 investidos, 101 cliques, 23 conversões, CPA ~R$28 | **A** | Números-chave do case |
| Desempenho considerado muito bom para leads | **A** | Contexto de expectativa |
| Dúvida: quantas matrículas? Cenários 0–3 | **B** | Framework interno de avaliação |
| Feedback: mensagens chegando, mais interessados, sem matrículas ainda | **A** | Honestidade — credibilidade |
| **"A procura aumentou consideravelmente"** | **A** | Citação-âncora qualitativa |
| Interpretação: topo do funil funciona; gargalo é matrícula | **A** | Demonstra pensamento de funil completo |

---

## Bloco 10 — Oscilações e disciplina (#26–29)

| Informação | Classe | Por quê |
|---|---|---|
| Dias muito diferentes; CPC oscilando R$4→R$9→R$20→R$5 | **A** | Mostra complexidade real de campanhas |
| Dias sem entrega ou orçamento parado | **B** | Contexto de volatilidade |
| Hipóteses: leilão, concorrência, aprendizado | **B** | Análise; pode ser sintetizada |
| Dia atípico: 4 cliques, CPC R$20, termo "humanitas medicina bolsa" R$46/clique | **B** | Ilustra investigação; termo específico é **C** |
| Recuperação no dia seguinte: CPC R$5,76, 2 conversões, CPA R$23 | **A** | Prova resiliência — não panicou |
| Decisão: não mudar estratégia de lance (Max Conversões) | **A** | Disciplina estratégica baseada em evidência |

---

## Bloco 11 — Relacionamento (#30–32)

| Informação | Classe | Por quê |
|---|---|---|
| Alinhamento constante de expectativas (algoritmo, tempo, otimizações) | **A** | Mostra gestão de relacionamento |
| Sem prometer resultados imediatos | **A** | Credibilidade |
| Evolução: contratação → relatórios → confiança → upsell → consultoria (spam) | **A** | Arco de parceria — diferencial Raise One |
| Caso Magicpin/FMU — orientação de não responder, verificar perfil | **B** | Mostra advisory beyond scope; tangencial |

---

## Bloco 12 — Aprendizados e estado final (#33–35, timeline)

| Informação | Classe | Por quê |
|---|---|---|
| Lista completa de aprendizados técnicos (#33) | **B** | Matriz-fonte; no case entram 3–4 selecionados |
| Lista completa de aprendizados comerciais (#34) | **A** | Fonte para Ato 4 e CTA |
| Estado final: LP concluída, campanha ativa, conversões corrigidas | **B** | Síntese operacional |
| Cliente satisfeita, procura aumentou, sem matrículas ainda, interesse pousada | **A** | Fechamento honesto |
| Linha do tempo resumida (18 passos) | **B** | Referência estrutural — virar visual no case |

---

# Parte 2 — Outline Editorial

---

# Hero

## Qual é a principal mensagem?

**Com R$50 por dia e zero histórico, construímos um funil de captação que passou a gerar procura real para o Polo UNIP Caraguatatuba — e corrigimos o que o painel não mostrava.**

Submensagem implícita: a Raise One não executa campanhas — diagnostica, decide, corrige e acompanha.

## Qual imagem deveria aparecer?

- **Primária:** mockup da landing page no mobile, com contexto costeiro sutil (Caraguatatuba / Litoral Norte) — educação + localidade, não genérico.
- **Alternativa:** foto institucional do polo ou ambiente universitário, tratada com overlay escuro premium.
- **Evitar:** dashboards, Tag Assistant, código, capturas de Google Ads.

## Qual emoção queremos causar?

- **Confiança calma** — "essas pessoas sabem o que estão fazendo mesmo quando os números mentem."
- **Respeito pela complexidade** — não foi sorte; houve obstáculos reais.
- **Curiosidade** — "como resolveram isso com orçamento tão enxuto?"

---

# Ato 1 — O Desafio

## Quais fatos entram?

- Viviane, responsável pelo Polo UNIP Caraguatatuba.
- Objetivo: funil completo de captação (landing + mídia + mensuração + evolução) — não peça isolada.
- Mercado local de educação superior; captação competitiva.
- Orçamento enxuto: R$50/dia — constraint que define todas as decisões posteriores.
- LP construída como peça central de conversão (WhatsApp como ação principal).
- Campanha Search lançada com Maximizar Conversões — e **não entregava**: impressões baixíssimas, orçamento parado, conta "travada".
- Primeira tensão: investimento existe, mas o sistema não responde.

## Qual a mensagem principal?

**O problema não era falta de vontade — era ausência de um funil confiável em condições reais de operação: budget pequeno, conta nova, algoritmo conservador.**

O leitor deve pensar: *"Esse é exatamente o tipo de situação que vivemos."*

## O que fica de fora?

- Detalhes de seções da LP (FAQ, bolsas, etc.).
- Estrutura técnica dos anúncios (RSA, sitelinks, snippets).
- Nomes de ferramentas (GTM, Tag Assistant).
- Discussões internas de UX (unir Hero + seção 2).
- Meta Ads futuro.

---

# Ato 2 — A Estratégia

## Quais fatos entram?

- Decisão de **3 grupos** (EAD, Cursos, Pós) em vez de 5 — proteger aprendizado estatístico com budget limitado.
- Resistência inicial à correspondência ampla → adoção posterior → campanha "destrava".
- Leads começam a chegar via WhatsApp — Viviane confirma.
- Conflito crítico: **mensagens reais vs. zero conversões no painel**.
- Auditoria profunda revela: mensuração quebrada por erro mínimo (1 caractere no identificador de conversão) — sem expor código.
- Correção validada; algoritmo passa a "enxergar" o funil corretamente.
- CPC começa a cair progressivamente (R$7 → R$3,80) — sinal de otimização.

## Qual a mensagem principal?

**Estratégia, aqui, é sequência de decisões sob restrição: simplificar para aprender, testar o que o mercado responde, e garantir que os dados refletem a realidade antes de otimizar.**

O leitor deve pensar: *"Eles pensam antes de escalar — e sabem quando o problema não é a campanha, é a medição."*

## O que fica de fora?

- Strings de conversão, nomes de arquivos, fluxos de funções.
- Lista de 11 pontos de clique auditados.
- Detalhes do Tag Assistant antes/depois.
- Relatório via Cursor.
- Comentário "anúncio bonitão".
- Tipos de correspondência (exata, frase) como aula de Google Ads.

---

# Ato 3 — A Evolução

## Quais fatos entram?

- Performance estabilizada: **3–7 conversões/dia**.
- Consolidado ~2 semanas: R$655, 101 cliques, 23 conversões, CPA ~R$28.
- Primeiros leads eram curiosos; qualidade foi evoluindo.
- Feedback honesto da Viviane: procura aumentou consideravelmente; **matrículas ainda não**.
- Interpretação transparente: **topo do funil funciona** — gargalo migrou para conversão comercial.
- Oscilações reais: dia com CPC R$20, 4 cliques, zero conversões → investigação → dia atípico → recuperação no dia seguinte.
- Decisão de **não mudar estratégia de lance** diante de volatilidade pontual.
- Comunicação constante: alinhamento de expectativas, explicação de algoritmo, sem promessas vazias.
- Relacionamento evolui: de contratante a parceira — pede projeto da Pousada, consulta antes de responder terceiros.
- Caso Magicpin (opcional, 1 frase): orientação proativa contra spam — prova de cuidado.

## Qual a mensagem principal?

**Resultado não é linha reta. A Raise One acompanha, interpreta, explica — e mantém disciplina estratégica quando o painel assusta.**

O leitor deve pensar: *"Posso confiar neles nos dias ruins também."*

## O que fica de fora?

- Termo específico "humanitas medicina bolsa" e CPC R$46.
- Framework interno de cenários 0–3 matrículas (usar só a conclusão).
- Detalhes de hipóteses de leilão/concorrência.
- Pedido interno para contabilizar leads manualmente.
- Estado operacional itemizado (#35).

---

# Ato 4 — O Resultado

## Quais fatos entram?

**Quantitativos (período ~2 semanas documentado):**

| Métrica | Valor |
|---|---|
| Investimento | R$655 |
| Cliques | 101 |
| Conversões (WhatsApp) | 23 |
| CPA médio | ~R$28 |
| Conversões/dia (fase estável) | 3–7 |
| Evolução CPC | ~R$7 → R$3,80 |

**Qualitativos:**

- "A procura aumentou consideravelmente." — Viviane
- Mensagens mais qualificadas ao longo do tempo.
- Cliente satisfeita; confiança para novo projeto (Pousada Itanhaém).
- Matrículas: **[A CONFIRMAR — não documentadas no período]**

**Aprendizados selecionados (3–4 máximo):**

1. Budget pequeno exige simplificação — não fragmentação.
2. Mensuração incorreta invalida toda otimização; diagnóstico vem antes de escala.
3. Oscilação em campanhas novas é normal; decisão exige histórico, não reação.
4. Lead ≠ matrícula — funil completo precisa ser avaliado em camadas.

## Qual a mensagem principal?

**Em menos de um mês, com investimento controlado, o polo saiu de uma operação sem tração mensurável para um funil que gera procura previsível — com clareza sobre o próximo gargalo.**

O leitor deve pensar: *"Eles entregam — e sabem dizer o que ainda falta."*

## O que fica de fora?

- Listas completas de aprendizados (#33, #34) — só curadoria.
- Timeline de 18 passos em texto corrido.
- Detalhes técnicos de correção.
- Números sem período definido ou sem fonte.
- Promessa de matrículas futuras.

---

# CTA

## O que o visitante deve pensar ao terminar?

> **"Se com R$50/dia e uma operação do zero eles construíram isso — imagina com o nosso contexto."**

> **"Esses caras têm método. Diagnosticam, decidem, corrigem e não somem quando o gráfico oscila."**

## Direção do CTA

- **Primário:** Diagnóstico gratuito — espelha o início deste projeto.
- **Secundário:** Programa de Crescimento — funil completo, não peça avulsa.
- **Tom:** convite, não urgência artificial.
- **Evitar:** "Somos especialistas", "melhor solução", "nossa equipe".

---

# Parte 3 — Tabela de tradução editorial

| Informação | Por que importa para o potencial cliente | Onde aparece | Representação visual |
|---|---|---|---|
| Funil completo, não só landing page | Prova visão de negócio vs. entrega tática | Hero + Ato 1 | Diagrama simples: Anúncio → LP → WhatsApp → Comercial |
| Viviane / Polo UNIP Caraguatatuba | Ancora humanidade e contexto local | Ato 1 | Foto do polo ou card com nome + cidade + segmento (Educação) |
| Orçamento R$50/dia | Mostra eficiência sob restrição real | Ato 1 + Ato 4 | Badge ou card de contexto: "Investimento diário: R$50" |
| Campanha travada (sem entrega) | Identificação imediata com dor comum | Ato 1 | Gráfico flat / linha do tempo com "Sem tração" |
| Decisão: 3 grupos, não 5 | Demonstra decisão analítica sob budget | Ato 2 | Card de decisão: "Simplificar para aprender" |
| Resistência → adoção de amplas | Mostra processo, não dogma | Ato 2 | Before/after conceitual de volume (sem jargão) |
| Leads chegam, painel mostra zero | Tensão narrativa — competência diagnóstica | Ato 2 | Split visual: "Realidade" vs. "Painel" |
| Bug de 1 caractere na mensuração | Insight memorável sobre rigor | Ato 2 | Tipografia grande: "1 caractere. Toda a medição invalidada." |
| CPC R$7 → R$3,80 | Prova otimização progressiva | Ato 3 ou 4 | Sparkline ou 4 números em sequência |
| 23 conversões, CPA ~R$28, 101 cliques | Resultado concreto e auditável | Ato 4 | Cards de métricas (bento grid) |
| 3–7 conversões/dia | Operacionalização do resultado | Ato 4 | Faixa ou range visual |
| "A procura aumentou consideravelmente" | Prova social qualitativa | Ato 4 | Blockquote premium + atribuição |
| Sem matrículas ainda (honestidade) | Credibilidade — não vende fumaça | Ato 4 | Texto direto + "próximo gargalo: comercial" |
| Topo do funil OK; gargalo é matrícula | Pensamento de funil completo | Ato 4 | Funil com etapa destacada |
| Oscilação CPC R$20 → recuperação | Resiliência e método nos dias ruins | Ato 3 | Mini timeline de 2 dias |
| Não mudar estratégia de lance | Disciplina baseada em evidência | Ato 3 | Card "Decisão: manter curso" |
| Comunicação constante, sem promessas vazias | Gestão de expectativa = parceria | Ato 3 | Ícones de touchpoints (relatório, alinhamento) |
| Evolução do relacionamento (contrato → upsell) | Prova confiança de longo prazo | Ato 3 + CTA | Timeline de parceria (4 estágios) |
| Projeto Pousada Itanhaém | Upsell orgânico — cliente pede mais | Ato 3 ou 4 | Card discreto "Nova frente de projeto" |
| Orientação sobre spam Magicpin | Advisory além do escopo | Ato 3 (opcional) | Nota lateral curta |
| Aprendizado: budget pequeno = simplificar | Transferível a outros setores | Ato 4 | Lista curta (3 items max) |
| Aprendizado: medir certo antes de escalar | Diferencial Raise One | Ato 4 | Ícone + frase |
| Aprendizado: lead ≠ matrícula | Maturidade de funil | Ato 4 | Diagrama funil em camadas |
| Matrículas [A CONFIRMAR] | Honestidade editorial | Ato 4 | Marcador explícito, não omitir lacuna |

---

# Notas para produção futura

1. **Período exato** das métricas (~2 semanas) deve ser confirmado antes de publicar.
2. **Matrículas** permanecem `[A CONFIRMAR]` — não inferir.
3. **Citação da Viviane** deve ser aprovada para uso público.
4. **Projeto Pousada** — mencionar com discrição; foco permanece UNIP.
5. Extensão alvo do texto final: **1.500–2.500 palavras** — este outline suporta ~2.000 com curadoria.

---

## Controle

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 2026-08-05 | Classificação A/B/C + outline editorial + tabela de tradução |
