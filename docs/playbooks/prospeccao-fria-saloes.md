# PLAYBOOK — Prospecção Fria Raise One / Salões

**Versão:** 1.0 (estratégia comercial — base para o Copilot)  
**Segmento:** Salões de beleza, barbearias, clínicas estéticas  
**Canal:** WhatsApp (primário)  
**Remetente:** Luan, Raise One  

> Este documento define a **lógica comercial** da conversa. O Copilot será implementado *a partir daqui*, não o contrário.

---

## Princípios inegociáveis

1. **Conversa, não interrogatório.** Uma pergunta por vez. Ouvir antes de avançar.
2. **Abertura direta.** Raise One se apresenta na primeira mensagem. Sem disfarce.
3. **Não pressupor dor.** “Está bom hoje?” antes de “o que está errado?”.
4. **Ter problema ≠ querer resolver.** Descobrir desejo antes de vender.
5. **Adaptar ao tom do prospect.** Se ele está satisfeito, reconhecer — não forçar funil.
6. **Registrar o que foi descoberto.** Cada resposta alimenta a próxima pergunta.

---

## Mapa da conversa (5 descobertas)

```text
                         ABERTURA OFICIAL
                                │
                                ▼
                         RESPONDEU?
                    ┌───────┴───────┐
                   NÃO             SIM
                    │               │
              (follow-up)     D1 — MOTOR DE AQUISIÇÃO
                    │          (como atrai clientes hoje)
                    │               │
                    │               ▼
                    │        D2 — ESTÁ BOM HOJE?
                    │     (volume satisfaz o momento?)
                    │               │
                    │      ┌────────┴────────┐
                    │   SATISFEITO      QUER MAIS
                    │      │                │
                    │      ▼                ▼
                    │  D4-lite         D3 — LIMITAÇÃO
                    │  (desejo de        (o que trava?)
                    │   crescer?)             │
                    │      │                │
                    │      └────────┬────────┘
                    │               ▼
                    │        D4 — QUEREM RESOLVER?
                    │               │
                    │      ┌────────┴────────┐
                    │     NÃO              SIM
                    │      │                │
                    │   ENCERRA        D5 — FIT RAISE ONE
                    │   (respeito)          │
                    │                       ▼
                    │                 PRÓXIMO PASSO
                    │              (call / diagnóstico)
                    └───────────────────────────────
```

**Legenda das descobertas**

| ID | Nome | Pergunta central |
|----|------|------------------|
| D1 | Motor de aquisição | Como o negócio atrai clientes hoje? |
| D2 | Satisfação atual | Isso está bom o suficiente para o momento? |
| D3 | Limitação | O que impede de captar mais (se houver)? |
| D4 | Desejo de resolver | Eles querem fazer algo a respeito? |
| D5 | Fit Raise One | Existe oportunidade real para nós? |

---

## 1. Abertura oficial

**Status:** FECHADA. Não alterar estrutura. Só personalizar placeholders.

```
Oi, [Nome], tudo bem?

Aqui é o Luan, da Raise One.

A gente trabalha com marketing e aquisição para empresas que já têm uma operação rodando e querem crescer de forma mais previsível.

Encontrei o [Empresa] e vocês entraram no perfil de empresas que estamos buscando conversar: [traits].

Estou entrando em contato justamente para entender se existe alguma oportunidade de ajudarmos vocês a trazer mais clientes através do digital.

Se fizer sentido, posso te explicar rapidinho o que fazemos e entender um pouco melhor o momento de vocês.
```

### Placeholders

| Token | Origem |
|-------|--------|
| `[Nome]` | Primeiro nome do contato |
| `[Empresa]` | Nome do salão |
| `[traits]` | Montado a partir da pesquisa pré-contato (1–3 traits reais) |

### Exemplos de `[traits]`

- “boa avaliação no Google, presença ativa no Instagram e uma operação que já parece bem estabelecida”
- “Instagram ativo, boa reputação na região e estrutura profissional”
- “presença digital consistente e avaliações positivas no Google Maps”

**Regra:** Só citar o que foi observado de verdade. Nunca inventar trait.

### Objetivo da abertura

- Posicionar Raise One como parceiro de crescimento previsível
- Mostrar que o salão foi **selecionado**, não spam em massa
- Abrir porta para conversa — não fechar venda

---

## 2. Objetivo da conversa

**Macro-objetivo:** Descobrir se existe **oportunidade mútua** — o salão quer crescer (ou estruturar melhor a captação) e a Raise One pode ajudar.

**Micro-objetivos (em ordem):**

1. Obter resposta (qualquer resposta útil)
2. Entender o motor atual de aquisição (D1)
3. Calibrar satisfação vs. ambição (D2)
4. Se houver abertura, entender limitações (D3)
5. Confirmar desejo de agir (D4)
6. Conectar fit e propor próximo passo (D5)

**O que NÃO é objetivo na primeira conversa:**

- Enviar proposta ou preço
- Diagnosticar tecnicamente (Google Ads, CRM, etc.)
- Convencer quem está satisfeito e não quer mudar nada

---

## 3. Pergunta principal (por descoberta)

### D1 — Motor de aquisição

**Objetivo:** Entender de onde vêm os clientes novos hoje.

**Pergunta sugerida (adaptável):**

> “Pra eu entender melhor o momento de vocês — hoje, de onde costuma vir a maior parte dos clientes novos?”

**Variações naturais (se a abertura já gerou contexto):**

> “Você comentou que estão bem de movimento — isso vem mais de indicação, Instagram, Google…?”

> “Como funciona aí na prática: como a maioria das clientes novas chega até vocês?”

---

### D2 — Está bom o suficiente?

**Objetivo:** Medir satisfação **sem assumir problema**.

**Pergunta sugerida:**

> “E hoje vocês sentem que essa entrada de clientes novos está boa pro momento da empresa, ou ainda existe espaço para aumentar esse volume?”

**Variações:**

> “Vocês estão buscando manter esse nível ou crescer ainda mais?”

> “Pra vocês, o volume atual atende ou vocês gostariam de encher mais a agenda?”

---

### D3 — Limitação (só se D2 = quer mais / ou sinal de trava)

**Objetivo:** Nomear o que impede — sem lista de culpados.

**Pergunta sugerida:**

> “O que você acha que mais limita hoje — é oscilação, dependência de um canal, falta de tempo pra cuidar do digital, ou outra coisa?”

**Variações por canal (se D1 já revelou):**

| Se D1 foi… | Pergunta de aprofundamento |
|------------|----------------------------|
| Instagram | “O Insta traz movimento, mas vocês sentem que converte bem em agendamento ou fica mais no engajamento?” |
| Indicação | “Indicação é ótima — vocês sentem que consegue prever o fluxo ou varia bastante de mês pra mês?” |
| Google | “O Google traz gente, mas vocês sabem quanto e se é o perfil que vocês querem?” |
| Misto | “Entre os canais, tem algum que vocês gostariam que funcionasse melhor?” |
| Tráfego pago | “Vocês já investiram em anúncio — o que funcionou e o que não funcionou?” |

---

### D4 — Querem resolver?

**Objetivo:** Separar “sabe que poderia melhorar” de “quer fazer algo agora”.

**Pergunta sugerida:**

> “Faz sentido pra vocês explorar isso agora ou não é prioridade no momento?”

**Variações:**

> “Se existisse um caminho claro pra trazer mais clientes pelo digital, vocês teriam interesse em olhar ou preferem deixar como está?”

> “É algo que vocês gostariam de resolver nos próximos meses ou está ok assim por enquanto?”

---

### D5 — Fit Raise One

**Objetivo:** Conectar o que foi dito à nossa proposta — sem pitch genérico.

**Frase de transição:**

> “Pelo que você me contou, acho que existe uma oportunidade interessante aqui.”

**Conexão (adaptar ao que foi descoberto):**

| Contexto descoberto | Conexão Raise One |
|---------------------|-------------------|
| Depende de indicação | “A gente ajuda salões a construir um segundo canal previsível além da indicação — sem parar o que já funciona.” |
| Instagram não converte | “Muito salão tem visibilidade mas perde cliente no caminho até agendar — estruturamos isso.” |
| Google fraco | “Tem demanda na região; quem aparece bem no Google captura. É um dos pontos que trabalhamos.” |
| Oscilação / dias vazios | “Previsibilidade é exatamente o que buscamos — saber de onde vem cliente e equilibrar agenda.” |
| Já tentou ads e falhou | “A gente entra onde a maioria erra: estratégia e operação, não só ‘impulsionar post’.” |

---

## 4. Possíveis respostas (e o que fazer)

### Após a abertura

| Resposta | Interpretação | Próximo movimento |
|----------|---------------|-------------------|
| “Quem é você? / O que vocês fazem?” | Interesse cauteloso | Responder curto (2 linhas) + voltar ao convite de conversa |
| “Pode falar” / “Manda” | Porta aberta | Ir para D1 |
| “Estamos bem, obrigado” | Possível encerramento ou satisfação real | D2 suave: “Que bom! Vocês estão buscando crescer ou manter?” |
| “Manda proposta/preço” | Quer atalho | Não enviar. “Antes preciso entender como vocês captam hoje — 2 minutos?” |
| Silêncio | Ver follow-up | Seção 13 |
| “Não tenho interesse” | Desinteresse | Encerrar com respeito (Seção 7) |

### D1 — Motor de aquisição

| Resposta | Interpretação | Próximo movimento |
|----------|---------------|-------------------|
| “Instagram” | Canal social forte | D2 (não pular direto para “converte?”) |
| “Indicação” | Dependência relacional | D2 |
| “Google / Maps” | Demanda de busca | D2 |
| “Instagram e indicação” | Misto comum | D2 — reconhecer saúde |
| “De tudo um pouco” | Possível falta de clareza | “Tem algum que puxa mais?” → D2 |
| “Tráfego pago” | Já investe | D2 + anotar para D3 |
| “Não sei / nunca parei” | Oportunidade de consciência | D2 com tom leve |

### D2 — Está bom hoje?

| Resposta | Interpretação | Próximo movimento |
|----------|---------------|-------------------|
| “Está ótimo / graças a Deus lotado” | Satisfação alta | D4-lite: “Busca crescer mais ou manter?” — **não** ir para D3 |
| “Está ok, mas queríamos mais” | Oportunidade clara | D3 |
| “Varia muito” | Instabilidade | D3 (oscilação) |
| “Terça/quarta fracos” | Dor específica | D3 (agenda) → D4 |
| “Depende do mês” | Previsibilidade baixa | D3 → D4 |

### D3 — Limitação

| Resposta | Interpretação | Próximo movimento |
|----------|---------------|-------------------|
| Nomeia problema concreto | Dor identificada | D4 |
| “Não sei o que limita” | Precisa de diagnóstico | D4 + oferecer call |
| “Falta tempo” | Objeção operacional | Validar + D4 |
| “Já tentamos ads” | Experiência negativa | Empatia + D4 |
| “Indicação resolve” | Pode estar satisfeito | D4 — “Querem segundo canal?” |

### D4 — Querem resolver?

| Resposta | Interpretação | Próximo movimento |
|----------|---------------|-------------------|
| “Sim, faz sentido” | Qualificado | D5 |
| “Talvez, depende” | Morno | D5 suave + call |
| “Agora não” | Timing | Encerrar + follow-up futuro |
| “Não, estamos bem” | Sem fit agora | Encerrar (Seção 7) |

---

## 5. Como interpretar cada resposta

### Sinais de linguagem

| O prospect diz… | Provavelmente significa… |
|-----------------|--------------------------|
| “Graças a Deus”, “bem de movimento” | Orgulho da operação — **validar antes de questionar** |
| “Indicação” | Canal forte, possivelmente imprevisível |
| “Instagram lotado de mensagem” | Visibilidade ≠ conversão |
| “Não tenho tempo” | Prioridade baixa ou sobrecarga real |
| “Já tentei e não deu” | Desconfiança com marketing |
| “Quanto custa?” | Interesse ou filtro — não enviar preço no WhatsApp |
| Resposta curta / emoji | Pode estar ocupado — não insistir na hora |

### Regra de ouro interpretativa

> **Escute o tom, não só o conteúdo.**

Exemplo:

> “Instagram e indicação. Graças a Deus estamos com bastante movimento.”

**Interpretação errada:** “Preciso saber se Instagram converte.”  
**Interpretação certa:** “Operação saudável. Quero saber se buscam crescer além disso.”

**Resposta certa:**

> “Boa! Então vocês já têm uma aquisição bem saudável. Vocês estão buscando aumentar ainda mais o volume ou o foco hoje é mais manter esse nível?”

---

## 6. Próximo objetivo (regras de transição)

```text
SE abertura enviada E sem resposta → follow-up (não avançar funil)
SE respondeu → D1
SE D1 completo → D2 (sempre)
SE D2 = satisfeito E sem desejo de crescer → encerrar ou follow-up longo
SE D2 = quer mais OU instabilidade → D3
SE D3 revelou limitação → D4
SE D4 = sim → D5
SE D5 = fit → próximo passo (call)
```

**Nunca pular D2.** É a pergunta que evita interrogatório e pressuposição de dor.

**D3 é condicional.** Só entra se houver abertura (quer mais, varia, trava, curiosidade).

---

## 7. Quando não insistir

| Situação | Ação |
|----------|------|
| “Não tenho interesse” | Agradecer e encerrar |
| “Estamos bem, não precisamos” | Validar + “Se mudar, estou por aqui” |
| 2 mensagens sem resposta | 1 follow-up. Depois encerrar |
| Tom irritado / “pare de mandar” | Encerrar imediato |
| Pede para remover contato | Encerrar + marcar perdido |
| Satisfeito + zero desejo de crescer | Não empurrar D3/D5 |
| Só quer preço | Não enviar. Explicar que depende do contexto |

**Frase de encerramento respeitoso:**

> “Tranquilo, [Nome]. Obrigado pelo retorno. Sucesso com o [Empresa] — se um dia fizer sentido conversar sobre crescimento, estou por aqui.”

---

## 8. Objeções

| Objeção | Resposta orientada | Objetivo |
|---------|-------------------|----------|
| “Quem é você?” | “Sou o Luan, da Raise One. Trabalhamos com marketing e aquisição pra empresas que já operam bem e querem crescer com previsibilidade.” | Credibilidade rápida |
| “Como conseguiu meu número?” | “Vi o contato no Google / Instagram de vocês. Se preferir, não insisto.” | Transparência |
| “Já tenho agência” | “Faz sentido. O que me interessa é entender se vocês sentem que a captação está previsível — muita gente terceiriza mas não sabe o que está funcionando.” | Voltar para D2/D3 |
| “Já tentei anúncio e não funcionou” | “Infelizmente ouço isso bastante — geralmente faltou estratégia ou operação, não só budget. O que vocês fizeram na época?” | Empatia + D3 |
| “Não tenho tempo” | “Entendo, rotina de salão é corrida. Por isso a conversa inicial é rápida — 15 min. Se não for prioridade, sem problema.” | Respeitar + testar D4 |
| “Manda proposta” | “Consigo te passar algo útil depois de entender como vocês captam hoje — senão vira chute. Topa 15 min essa semana?” | Qualificar antes |
| “Marketing não funciona pra salão” | “Depende muito de como é feito. Muitos salões vivem bem de indicação — a pergunta é se vocês querem um segundo canal previsível.” | D2/D4 |
| “Agenda cheia” | “Ótimo, de verdade. Aí a conversa muda — às vezes é equilibrar profissionais, aumentar ticket ou fila de espera. Faz sentido?” | Reposicionar ou encerrar |

---

## 9. Sinais de interesse

- Responde com detalhe (não monossilábico)
- Faz pergunta de volta (“como vocês fazem?”, “vocês atendem salão?”)
- Menciona dor espontânea (“terça vazia”, “depende de indicação”)
- Aceita continuar conversa (“pode falar”, “manda”)
- Pede call ou horário
- Compartilha número de clientes, profissionais, dias fracos
- “A gente precisa melhorar isso”

**Ação:** Avançar para D5 e propor próximo passo concreto.

---

## 10. Sinais de desinteresse

- “Não tenho interesse”
- Resposta seca repetida
- Só emoji ou “ok” sem engajamento (após 2 tentativas)
- “Depois vejo” sem data
- Ignora 2 follow-ups
- Tom defensivo desde o início

**Ação:** Encerrar. Não queimar o contato.

---

## 11. Momento certo de apresentar Raise One

**Já apresentamos na abertura** (quem somos + o que fazemos em 1 linha).

**Aprofundar a apresentação quando:**

- Prospect pergunta “o que vocês fazem?” / “como funciona?”
- D4 = sim (querem explorar)
- D3 revelou limitação que mapeamos para nossa entrega
- Prospect pede exemplos ou cases

**Como apresentar (2–3 linhas, não pitch):**

> “A Raise One estrutura marketing e aquisição para salões — tráfego, presença digital e processo comercial — pra vocês saberem de onde vem cliente e crescer com previsibilidade. Não é só post bonito: é cliente na agenda.”

**Não apresentar quando:**

- Ainda não passou por D2
- Prospect disse que está satisfeito e não quer crescer
- Objeção não foi ouvida

---

## 12. Momento certo de pedir reunião

**Pedir call quando:**

- D4 = sim
- D5 = fit identificado
- Prospect pediu “como fariam?”
- Conversa rica o suficiente para diagnóstico (3+ trocas úteis)

**Frase sugerida:**

> “Pelo que você me contou, vale uma conversa rápida de 15 min — eu te mostro o que enxergamos e você me conta como funciona a operação aí. Qual dia funciona melhor, terça ou quinta?”

**Alternativa (menos pressão):**

> “Se fizer sentido, marcamos 15 min essa semana. Sem compromisso — só pra ver se existe fit.”

**Não pedir call quando:**

- Primeira resposta ainda é monossilábica
- Desinteresse explícito
- Só quer preço por mensagem

---

## 13. Follow-up

### Sem resposta à abertura

**+2 a 3 dias:**

> “Oi, [Nome] — passando de novo porque vi que o [Empresa] se encaixa no perfil de salões que estamos conversando em [Cidade]. Se fizer sentido, fico à disposição pra trocar uma ideia rápida.”

**+5 a 7 dias (última tentativa):**

> “[Nome], última mensagem minha — se não for o momento, sem problema. Sucesso com o [Empresa].”

**Regra:** Máximo **2 follow-ups** após abertura. Nunca repetir a mesma mensagem.

### Conversa parou no meio

Retomar com **referência ao que foi dito**:

> “Oi, [Nome] — você comentou que a maior parte vem de indicação. Fiquei pensando se faz sentido retomar aquele papo sobre previsibilidade. Ainda é um tema pra vocês?”

### Satisfeito mas cordial

**+30–60 dias** (opcional):

> “Oi, [Nome], tudo bem? Passando pra saber como estão as coisas no [Empresa]. Se um dia quiserem conversar sobre crescimento, estou por aqui.”

---

## 14. Quando marcar como perdido

| Critério | Ação no CRM |
|----------|-------------|
| “Não tenho interesse” explícito | Status: **perdido** |
| 2 follow-ups sem resposta após abertura | **perdido** (ou pausado 90 dias) |
| Pediu para não contatar | **perdido** + nota |
| Satisfeito + recusou conversa 2x | **perdido** |
| Convertido em cliente | **cliente** |

**Não marcar perdido:**

- “Agora não” → agendar follow-up + status morno
- Uma non-response → ainda em follow-up
- Conversa boa mas sem data → manter **respondeu** / **interessado**

---

## Apêndice A — Exemplo de conversa completa (fluxo saudável)

**Abertura** → enviada

**Prospect:** “Pode falar sim”

**Luan (D1):** “Pra eu entender melhor — hoje, de onde costuma vir a maior parte dos clientes novos?”

**Prospect:** “Instagram e indicação. Graças a Deus estamos com bastante movimento.”

**Luan (D2):** “Boa! Então vocês já têm uma aquisição bem saudável. Vocês estão buscando aumentar ainda mais o volume ou o foco hoje é mais manter esse nível?”

**Prospect:** “A gente gostaria de encher mais terça e quarta, sabe? Oscila.”

**Luan (D3):** “Entendi — terça e quarta mais fracos é bem comum. Vocês sentem que isso é falta de demanda ou falta de gente chegando nesses dias especificamente?”

**Prospect:** “Acho que falta gente sabendo que a gente tem vaga nesses dias.”

**Luan (D4):** “Faz sentido resolver isso agora ou é mais ‘um dia a gente vê’?”

**Prospect:** “Não, a gente quer melhorar isso.”

**Luan (D5 + call):** “Pelo que você me contou, acho que existe oportunidade sim — vocês já têm base forte, falta previsibilidade nos dias mais fracos. A Raise One trabalha exatamente nisso. Topa 15 min essa semana pra eu te mostrar como enxergamos?”

---

## Apêndice B — Exemplo de encerramento respeitoso (sem fit)

**Prospect:** “Estamos bem, não estamos buscando nada agora.”

**Luan:** “Perfeito, [Nome] — que bom que estão bem. Obrigado pelo retorno. Se um dia fizer sentido conversar sobre crescimento, estou por aqui. Sucesso com o [Empresa].”

→ Marcar: sem fit agora. Follow-up opcional em 60 dias.

---

## Apêndice C — Pesquisa pré-contato (antes da abertura)

Checklist rápido (1–2 min):

- [ ] Google Maps — avaliações, nota, fotos
- [ ] Instagram — frequência, link agendar, bio
- [ ] Especialidade visível (coloração, barba, unhas…)
- [ ] Sinais de operação estabelecida vs. recente
- [ ] Nome do contato (se disponível)

Alimenta `[traits]` na abertura. **Não** substitui a conversa.

---

## Próximo passo (para o produto)

Quando esta estratégia estiver validada por vocês:

1. Transformar D1–D5 + tabelas de resposta em **grafo TypeScript** (`copilot/graph/saloes.ts`)
2. Mapear cada linha deste doc para: `objectiveKey`, `suggestedQuestion`, `answerOptions`, `nextObjectiveKey`, `interpretation`
3. Implementar Copilot como **vendedor assistido por processo** — não gerador de scripts

**Este documento é a fonte da verdade comercial até segunda ordem.**
