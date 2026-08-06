import type { SegmentPlaybook } from "./types";

export const advogadosPlaybook: SegmentPlaybook = {
  slug: "advogados",
  scripts: {
    segment_overview: `Escritório vive de confiança e indicação. Cliente precisa sentir segurança.

Captação oscila — meses bons, meses secos. Quem busca advogado pesquisa no Google antes de ligar.

Conversas interessantes giram em torno de: áreas de atuação, origem dos casos, previsibilidade, tempo de resposta a consultas, posicionamento no mercado local.`,

    pre_contact_checklist: `□ Site — clareza, mobile, áreas de atuação
□ Google Maps — avaliações, presença
□ LinkedIn do(s) sócio(s) — conteúdo, atividade
□ Especialidade clara ou genérico?
□ Formulário de contato — retorno visível?
□ Aparece em buscas locais da área?
□ Escritório novo ou consolidado?
□ Conteúdo jurídico (artigos, posts)?
□ E-mail comercial ou @gmail?
□ Parcerias visíveis (contadores, consultores)?`,

    conversation_philosophy: `**Filosofia oficial**

Conversa entre empresários. O assunto é o escritório dele, não a Raise One.

**Você pesquisa escritórios — não prospecta leads.**

**Primeira mensagem:** observação + curiosidade + pergunta. Sem Raise One. Sem marketing. Sem "ajudar".

**Raise One só entra se ele perguntar.**

**Fluxo:** Observação → Curiosidade → Pergunta → Conversa

Advogado não quer falar de marketing. Quer falar de captação de casos, indicação, posicionamento, mercado.`,

    first_approach_examples: `**Padrão 1 — Área de atuação clara**

Observação: atuação bem definida em [trabalhista/família/empresarial]
Curiosidade: essa área gera demanda constante?
Pergunta:

Dr(a). [Nome], tudo bem?

Estava pesquisando escritórios de [área] em [Cidade] e encontrei o [Escritório].

Pela apresentação de vocês, a atuação parece bem focada.

Fiquei curioso — hoje os casos novos entram mais por indicação ou vocês recebem consulta direta também?

---

**Padrão 2 — Avaliações no Google**

Observação: boa presença no Google
Curiosidade: Google gera consulta ou só credibilidade?
Pergunta:

Dr(a). [Nome], boa tarde.

Vi o [Escritório] no Google Maps — boa avaliação.

Sempre tive curiosidade: família ou empresa que chega pelo Google costuma converter ou ainda é mais indicação mesmo?

---

**Padrão 3 — LinkedIn ativo**

Observação: conteúdo jurídico no LinkedIn
Curiosidade: conteúdo traz caso ou é posicionamento?
Pergunta:

Dr(a). [Nome]!

Vi seu conteúdo sobre [tema] no LinkedIn.

Esse tipo de post traz consulta pro escritório ou vocês veem mais como autoridade?

---

**Padrão 4 — Site claro**

Observação: site transmite credibilidade
Curiosidade: site gera contato?
Pergunta:

Dr(a). [Nome], tudo bem?

Passei pelo site do [Escritório] — apresentação clara.

Quem preenche formulário aí — vocês sentem que converte ou ainda é indicação que concentra?

---

**Padrão 5 — Escritório em expansão**

Observação: parece estar crescendo
Curiosidade: como captam no momento?
Pergunta:

Dr(a). [Nome]!

Encontrei o [Escritório] pesquisando a região.

Como vocês estão conseguindo casos novos nesse momento — indicação, parcerias, outro canal?

---

**Padrão 6 — Especialidade nichada**

Observação: nicho específico (inventário, holding, etc.)
Curiosidade: demanda orgânica ou depende de rede?
Pergunta:

Dr(a). [Nome], tudo bem?

Vi que vocês atuam em [nicho] — área que exige bastante confiança.

Como os clientes costumam chegar nesse perfil — indicação de contador, advogado, busca direta?`,

    conversation_patterns: `**Se disser: "Mais indicação"**
→ "Faz sentido. Vocês conseguem prever quantos casos entram por mês ou oscila bastante?"

**Se disser: "Site traz consulta"**
→ "Interessante. Quantas viram contrato, vocês têm ideia?"

**Se disser: "Oscila muito"**
→ "Converso com bastante escritório e isso é comum. Vocês chegaram a entender o que muda nos meses bons vs secos?"

**Se disser: "LinkedIn é autoridade"**
→ "Entendo. E indicação continua sendo o principal?"

**Se perguntar quem você é**
→ "Trabalho na Raise One." (Pare. Deixe perguntarem mais.)

**Regra:** continue no negócio dele até ele puxar Raise One.`,

    conversation_questions: `- Indicação concentra quanto da carteira?
- Vocês preveem entrada de casos mês a mês?
- Qual área vocês gostariam de receber mais demanda?
- Quem responde consulta inicial — em quanto tempo?
- Consulta vira contrato — vocês medem?
- Parcerias (contador, consultor) trazem quanto?
- Aparecem quando buscam [área] em [cidade]?`,

    when_to_present_raise_one: `Só quando perguntarem ou demonstrarem interesse espontâneo.

Enquanto falar de casos, indicação, mercado — fique nisso.

Não puxe reunião. Não ofereça "análise do site".`,

    how_to_present_raise_one: `**"Quem é você?"**
Trabalho na Raise One.

**"O que fazem?"**
Crescimento digital — captar cliente, estruturar comercial, presença online. Em escritório, costuma ser clareza de posicionamento e previsibilidade de entrada de casos.

**"Fazem para advogado?"**
Sim, conversamos com escritórios. Cada um tem realidade diferente.

**Proibido:** "ajudamos", pitch de serviços, promessa de casos.`,

    best_practices: `Tom formal mas humano. Pesquise site, LinkedIn, Google antes.

Horário: seg–qui, 8h–9h30 ou 17h–18h30.

Nunca prometa resultado de processo.

Sensação desejada: conversa inteligente, não abordagem comercial.`,
  },

  objections: [
    { objection: "Captação é indicação", response: "Indicação é o melhor. Vocês conseguem prever entrada de casos ou varia?", objective: "Conversa." },
    { objection: "Marketing jurídico é complicado", response: "Verdade, tem regras. Minha curiosidade era mais sobre como vocês captam — indicação, site, parceria.", objective: "Voltar ao negócio." },
    { objection: "Não tenho interesse", response: "Tranquilo, Dr(a). Obrigado por responder.", objective: "Encerrar." },
    { objection: "Manda proposta", response: "Preciso entender melhor o escritório antes. Pelo que conversamos, [retomar].", objective: "Não proposta fria." },
    { objection: "Site não importa", response: "Quem recebe indicação pesquisa antes de ligar. Mas se indicação basta, faz sentido.", objective: "Sem confronto." },
    { objection: "Tenho muitos processos", response: "Ótimo problema. Obrigado pelo tempo.", objective: "Encerrar." },
  ],

  qualifications: [
    "Indicação concentra quanto da carteira?",
    "Vocês preveem entrada de casos mês a mês?",
    "Qual área gostariam de receber mais demanda?",
    "Consulta vira contrato — vocês medem?",
  ],
};
