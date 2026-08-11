import type { SegmentPlaybook } from "./types";

export const saloesPlaybook: SegmentPlaybook = {
  slug: "saloes",
  scripts: {
    segment_overview: `Salão vive de agenda. Cliente marca, volta, indica.

A maioria depende de indicação e Instagram. Quando um profissional sai ou a indicação esfria, sente na receita.

Cliente escolhe pelo Google Maps, avaliações e facilidade de marcar. Demora no retorno = cliente vai pro concorrente.

Erros comuns: Instagram bonito sem caminho pra agendar, GMB desatualizado, terça/quarta vazias sem ninguém perceber, ninguém sabe de onde veio o último cliente.

Conversas interessantes com donos de salão giram em torno de: agenda, profissionais, horários mortos, avaliações, recorrência, de onde vem cliente novo.`,

    pre_contact_checklist: `Antes de escrever, observe. A mensagem nasce daqui.

□ Google Maps — avaliações, nota, fotos, horários
□ Instagram — frequência, tipo de conteúdo, link na bio
□ Site ou só redes?
□ Algum serviço que se destaca (loiro, progressiva, unhas)
□ Profissionais — um lotado e outro ocioso?
□ Horários que parecem vazios
□ Abriram recentemente?
□ Respostas a comentários e avaliações
□ WhatsApp comercial ou pessoal na bio
□ Concorrentes na mesma rua — como se comparam?

Anote 1–2 observações reais. A conversa nasce delas.`,

    conversation_philosophy: `**Filosofia — abordagem direta e persuasiva**

Você representa a Raise One: crescimento de empresas por estratégia e marketing. O dono do salão precisa bater o olho e pensar *"essa empresa pode me fazer faturar mais"*.

**A primeira mensagem tem 3 objetivos:**
1. Posicionar a Raise One com clareza — sem rodeio, sem disfarce
2. Mostrar que o salão se encaixa no perfil de cliente que vocês buscam
3. Convidar para uma conversa curta (15 min), com observação real como prova de que analisaram

**Tom:** parceiro de negócios, não curioso disfarçado. Todo mundo percebe venda encoberta — melhor ser direto e profissional.

**Proibido na primeira mensagem:**
- "Fiquei curioso..."
- Perguntas retóricas ("isso traz cliente ou é indicação?")
- Fingir que pesquisa salões por hobby
- Tom de auditoria ou crítica ("não vi link pra agendar")
- Mascarar que é abordagem comercial

**Recomendado:**
- Dizer que trabalham com crescimento, estratégia e marketing
- Mencionar perfil ideal (salão consolidado, quer previsibilidade)
- Usar observação concreta como gancho — não como julgamento
- CTA claro: conversa de 15 min

**O fluxo:**
Posicionamento → Perfil encaixa → Gancho (opcional) → Convite para conversa → Diagnóstico na call`,

    first_approach_examples: `Cada mensagem segue: **Posicionamento → Perfil encaixa → Gancho (opcional) → Convite**

A Raise One aparece desde a primeira linha. Sem disfarce.

---

**Padrão 1 — Genérico (salão consolidado)**

Oi, [Nome], tudo bem?

Sou da Raise One — trabalhamos com crescimento de empresas por estratégia e marketing digital.

Estamos selecionando salões consolidados em [Cidade] que já têm operação rodando, mas querem captar clientes com mais previsibilidade. Pelo perfil, o [Salão] se encaixou no que buscamos.

Vale uma conversa de 15 min essa semana?

---

**Padrão 2 — Instagram forte, Google fraco**

Oi, [Nome], tudo bem?

Sou da Raise One — estratégia e marketing para salões.

Analisando o [Salão] em [Cidade]: Instagram ativo, mas presença no Google ainda não acompanha. Esse gap costuma deixar cliente novo na mesa — e é o que resolvemos.

Topa 15 min para eu te mostrar onde enxergamos oportunidade?

---

**Padrão 3 — Boa reputação no Google**

Oi, [Nome], tudo bem?

Aqui é da Raise One. Estruturamos marketing para salões que já têm reputação e querem transformar isso em clientes novos todo mês — não só indicação.

O [Salão] se encaixou no perfil em [Cidade]. Faz sentido trocar uma ideia de 15 min?

---

**Padrão 4 — Especialidade (coloração/loiro)**

Oi, [Nome], tudo bem?

Sou da Raise One — crescimento por estratégia e marketing.

Estamos conversando com salões em [Cidade] com operação consolidada. O [Salão] se destacou pela especialidade — perfil ideal para escalar demanda além da indicação.

Vale alinhar em 15 min?`,

    conversation_patterns: `A conversa não segue roteiro. Você reage.

**Se disser: "Mais Instagram"**
→ "Faz sentido. E vocês conseguem perceber quantos agendamentos vieram do Insta no último mês?"

**Se disser: "Mais indicação"**
→ "Indicação é o melhor canal. Vocês sentem que isso é estável ou varia muito?"

**Se disser: "Os dois"**
→ "Interessante. Tem algum dia da semana que costuma ficar mais parado?"

**Se disser: "Terça/quarta vazia"**
→ "Converso com bastante salão e isso é super comum. Vocês já tentaram alguma coisa pra equilibrar ou deixaram natural?"

**Se disser: "Não sei / nunca parei pra ver"**
→ "Normal. A maioria não mede. Vocês sentiriam diferença se soubessem de onde vem cada cliente?"

**Se disser: "Um profissional lota, outro não"**
→ "Isso aparece muito. Vocês chegaram a entender por quê — indicação pessoal, Instagram, especialidade?"

**Se perguntar: "E você, trabalha com o quê?"**
→ Agora sim. Veja a seção "Como falar da Raise One".

**Se responder curto ou emoji**
→ Não insista. "Boa, [Nome]. Valeu por responder." Encerre ou retome em outro dia com nova observação.

**Regra:** enquanto ele falar do negócio dele, continue falando do negócio dele. Não puxe para Raise One.`,

    conversation_questions: `Perguntas que surgem naturalmente — não interrogatório.

- Tem algum dia da semana que a agenda costuma ficar mais tranquila?
- Um profissional lota mais que os outros?
- Quem manda mensagem no Instagram — marca rápido ou demora?
- Vocês percebem de onde veio o último cliente novo?
- Indicação veio crescendo ou está estável?
- Quando a agenda esvazia, o que vocês fazem?
- Tem serviço que vocês gostariam que enchese mais?
- A recepção dá conta do volume de mensagem?
- Vocês fecham algum dia — foi escolha ou demanda?
- Como foi captar cliente no começo?`,

    when_to_present_raise_one: `A Raise One já entra na **primeira mensagem** — posicionamento claro desde o início.

**Na conversa seguinte:**
- Aprofunde a dor (previsibilidade, indicação, agenda)
- Conecte observação com oportunidade concreta
- Proponha call ou diagnóstico se ainda não marcou

**Não volte ao tom de curioso disfarçado** se a conversa esfriar — retome com valor ("posso te mandar um ponto que vimos no digital de vocês?").`,

    how_to_present_raise_one: `**Na primeira mensagem** — posicione direto:

"A Raise One trabalha com crescimento de empresas por estratégia e marketing — captar cliente com previsibilidade."

---

**Se perguntarem "o que vocês fazem?"**

Estruturamos marketing e comercial: tráfego, presença digital, processo de agendamento. Para salões que já operam bem e querem crescer com previsibilidade — saber de onde vem cliente e encher agenda nos dias certos.

---

**Se perguntarem "vocês fazem para salão?"**

Sim. Trabalhamos com salões consolidados — uns querem equilibrar agenda, outros sair da dependência de indicação, outros converter Instagram em agendamento. Depende do momento.

---

**Se pedirem proposta antes da call**

Antes de qualquer proposta, preciso entender como o [Salão] funciona hoje. Por isso a conversa de 15 min — para ver se faz sentido e onde está a oportunidade.`,

    best_practices: `**Pesquise antes.** Google Maps, Instagram, avaliações. A observação prova que você analisou — não que está caçando defeito.

**Seja direto.** Posicione a Raise One na primeira mensagem. O empresário precisa entender que você pode ajudá-lo a faturar mais.

**Tom de parceiro.** Profissional, sem marketingês, sem curiosidade falsa.

**Personalize.** Cidade, serviço, observação real. Genérico não converte.

**Horário:** ter–qui, 10h–12h ou 14h–16h. Evite sábado manhã.

**Insistência:** no máximo uma retomada com novo ângulo de valor. Duas tentativas sem resposta = encerrar.

**Sensação desejada:** "Essa empresa entende meu negócio e pode me ajudar a crescer." — não "mais um vendedor disfarçado."`,
  },

  objections: [
    {
      objection: "Quem é você? / O que você quer?",
      response: "Sou da Raise One — trabalhamos com crescimento de salões por estratégia e marketing. Vi o perfil de vocês e achei que valia uma conversa.",
      objective: "Responder sem pitch.",
    },
    {
      objection: "Já tenho agência",
      response: "Faz sentido. Como tem sido aí — vocês sentem que sabem de onde vem cada cliente?",
      objective: "Voltar pro negócio dele.",
    },
    {
      objection: "Não tenho interesse",
      response: "Tranquilo, [Nome]. Obrigado por responder.",
      objective: "Encerrar com respeito.",
    },
    {
      objection: "Manda proposta / manda preço",
      response: "Antes de qualquer coisa, preciso entender melhor como o salão funciona. Pelo que conversamos, [retomar]. Faz sentido trocar mais uma ideia sobre isso?",
      objective: "Não enviar proposta fria.",
    },
    {
      objection: "Agenda cheia, não preciso",
      response: "Ótimo. De verdade. Se um dia quiser trocar ideia sobre negócio, estou por aqui.",
      objective: "Respeitar e encerrar.",
    },
    {
      objection: "Como conseguiu meu número?",
      response: "Vi o contato no Google / Instagram de vocês. Se preferir, não insisto.",
      objective: "Transparência.",
    },
    {
      objection: "Vou pensar",
      response: "Claro. Fica à vontade.",
      objective: "Zero pressão.",
    },
    {
      objection: "Não acredito em marketing",
      response: "Entendo. Nem todo salão precisa. Curiosidade minha era só sobre como vocês captam cliente — indicação, Google, Insta.",
      objective: "Voltar pra conversa, não debate.",
    },
  ],

  qualifications: [
    "Tem algum dia da semana que a agenda costuma ficar mais tranquila?",
    "Um profissional lota mais que os outros?",
    "Vocês percebem de onde veio o último cliente novo?",
    "Indicação veio crescendo ou está estável?",
    "Quem manda mensagem no Instagram — marca rápido ou demora?",
  ],
};
