import type { SegmentPlaybook } from "./types";

export const clinicasPlaybook: SegmentPlaybook = {
  slug: "clinicas",
  scripts: {
    segment_overview: `Clínica vive de agenda e confiança. Paciente pesquisa, lê avaliações, compara convênios.

Mix convênio + particular. Particular costuma ter margem melhor.

Conversas interessantes: especialidades, agenda ociosa, convênio vs particular, tempo de resposta, credibilidade online.`,

    pre_contact_checklist: `□ GMB — avaliações, horários, convênios
□ Agendamento online funciona?
□ Especialidades destacadas
□ Instagram — CTA, frequência
□ Procedimentos de ticket alto visíveis?
□ Recepção sobrecarregada? (avaliações mencionam?)
□ Site mobile
□ Concorrentes no Maps
□ Unidade nova ou consolidada?
□ Resposta a avaliações negativas`,

    conversation_philosophy: `Conversa entre empresários. Assunto: a clínica dele.

Você pesquisa clínicas da região. Não vende marketing.

Primeira mensagem: observação + curiosidade + pergunta. Zero Raise One.

Raise One só se perguntarem.

Paciente e gestor não querem ouvir pitch. Querem falar de agenda, convênio, particular, credibilidade.`,

    first_approach_examples: `**Padrão 1 — Avaliações**

Oi, [Nome], tudo bem?

Estava pesquisando clínicas de [especialidade] em [Cidade] e encontrei a [Clínica].

Vi que vocês têm bastante avaliação no Google.

Fiquei curioso — paciente novo costuma chegar mais por indicação ou vocês sentem movimento pelo Google?

---

**Padrão 2 — Especialidade**

Oi, [Nome]!

Vi que a [Clínica] atua em [implante/derm/odontologia].

Essa especialidade costuma lotar a agenda aí ou tem horário que sobra?

---

**Padrão 3 — Agendamento online**

Oi, [Nome], tudo bem?

Passei pelo site da [Clínica] e vi agendamento online.

A maioria dos pacientes marca por aí ou ainda prefere ligar?

---

**Padrão 4 — Convênio + particular**

Oi, [Nome]!

Encontrei a [Clínica] no Maps. Trabalham convênio e particular.

Particular pesa quanto na receita de vocês — vocês sentem que dá pra crescer mais nessa parte?

---

**Padrão 5 — Região competitiva**

Oi, [Nome], tudo bem?

Região de [bairro] tem bastante clínica. Vi a de vocês.

Como vocês se diferenciam na captação — indicação, Google, outra coisa?

---

**Padrão 6 — Procedimento específico**

Oi, [Nome]!

Reparei que vocês divulgam bastante [procedimento].

Esse serviço enche agenda sozinho ou vocês precisam divulgar ativamente?`,

    conversation_patterns: `**"Mais convênio"** → "Convênio traz volume. Particular vocês sentem que tem demanda reprimida?"

**"Agenda cheia"** → "Ótimo. Tem especialidade ou horário que sobra?"

**"Mais indicação"** → "Indicação é ouro. Google entra como credibilidade ou traz paciente?"

**"Recepção sobrecarregada"** → "Converso com gestores e isso aparece muito. Como vocês lidam?"

**Perguntou quem você é** → "Trabalho na Raise One."

Continue no negócio dele até ele puxar.`,

    conversation_questions: `- Convênio e particular — o que pesa mais?
- Tem especialidade com agenda ociosa?
- Paciente marca online ou liga?
- Avaliações — vocês pedem ativamente?
- Quem responde WhatsApp — em quanto tempo?
- Qual procedimento gostariam de crescer?`,

    when_to_present_raise_one: `Só se perguntarem ou puxarem ("como vocês fariam?", "conhece alguém?").

Enquanto falar de agenda, convênio, pacientes — fique nisso.`,

    how_to_present_raise_one: `**"Quem é você?"** — Trabalho na Raise One.

**"O que fazem?"** — Crescimento digital. Em clínica: agenda, credibilidade, resposta — depende da realidade.

**Proibido:** prometer pacientes, "ajudamos clínicas", diagnóstico gratuito.`,

    best_practices: `Tom profissional, respeitoso. Pesquise Maps e site antes.

Horário: 12h–14h ou 18h–19h.

Ética CFM/CRM — nunca prometa cura ou resultado.`,
  },

  objections: [
    { objection: "Paciente vem por convênio", response: "Convênio traz volume. Particular vocês sentem demanda que não captam?", objective: "Conversa." },
    { objection: "Agenda cheia", response: "Ótimo. Obrigado por responder.", objective: "Encerrar." },
    { objection: "Marketing médico é restrito", response: "Correto. Minha curiosidade era sobre agenda e captação, não propaganda.", objective: "Clareza." },
    { objection: "Não tenho interesse", response: "Tranquilo. Obrigado.", objective: "Encerrar." },
    { objection: "Indicação basta", response: "Faz sentido. Paciente que pesquisa no Google antes de marcar — vocês sentem que isso cresceu?", objective: "Reflexão leve." },
  ],

  qualifications: [
    "Convênio e particular — o que pesa mais?",
    "Tem especialidade com agenda ociosa?",
    "Paciente marca online ou liga?",
    "Qual procedimento gostariam de crescer?",
  ],
};
