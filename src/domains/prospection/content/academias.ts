import type { SegmentPlaybook } from "./types";

export const academiasPlaybook: SegmentPlaybook = {
  slug: "academias",
  scripts: {
    segment_overview: `Academia vive de matrícula e retenção. Janeiro lotado, março cancelamento.

Captação: indicação, promoção, experimental. Churn alto.

Conversas interessantes: experimental, matrícula, cancelamento, modalidades, janeiro vs resto do ano.`,

    pre_contact_checklist: `□ GMB — avaliações, fotos
□ Instagram — frequência, modalidades
□ Link de experimental na bio?
□ Promoção visível?
□ Modalidade destaque (cross, pilates, musculação)
□ Academia nova ou consolidada?
□ Estrutura/equipamentos (fotos)
□ Horários de pico aparentes
□ Avaliações mencionam cancelamento?
□ Região/bairro`,

    conversation_philosophy: `Você pesquisa academias da região. Conversa sobre matrícula, experimental, retenção.

Dono conhece promoção genérica de todo lado — seja diferente com observação real.

Primeira mensagem: observação + curiosidade + pergunta. Sem Raise One.

Fale de experimental, modalidade, janeiro — não de "captação de alunos".`,

    first_approach_examples: `**Padrão 1 — Estrutura/modalidade**

Oi, [Nome], tudo bem?

Estava pesquisando academias em [Cidade] e encontrei a [Academia].

Vi que vocês têm [musculação/cross/pilates] bem montado.

Fiquei curioso — aluno novo chega mais por indicação ou vocês sentem movimento pelo bairro?

---

**Padrão 2 — Experimental**

Oi, [Nome]!

Vi que vocês oferecem experimental.

Quem faz e não matricula — alguém retoma ou se perde?

---

**Padrão 3 — Janeiro**

Oi, [Nome], tudo bem?

Janeiro sempre aparece como pico em academia.

Fora disso, vocês captam matrícula o ano todo ou depende do calendário?

---

**Padrão 4 — Instagram ativo**

Oi, [Nome]!

Instagram de vocês com bastante conteúdo de treino.

Isso traz aluno que vira matrícula ou é mais engajamento?

---

**Padrão 5 — Modalidade específica**

Oi, [Nome]!

Vi que vocês destacam [Muay Thai/pilates/box].

Essa modalidade enche fácil ou depende de divulgação?

---

**Padrão 6 — Academia nova**

Oi, [Nome], tudo bem?

Vi a [Academia] em [bairro] — parece recente.

Como tem sido captar os primeiros alunos?`,

    conversation_patterns: `**"Mais indicação"** → "Indicação é o melhor aluno. Google ou Insta traz gente nova?"

**"Experimental não converte"** → "Converso com donos e isso aparece. Vocês sabem a taxa?"

**"Janeiro concentra"** → "Pico clássico. Gente busca academia o ano todo — vocês sentem?"

**"Churn alto"** → "Comum no setor. Vocês medem em quanto tempo cancela?"

**"Promoção funciona"** → "Traz volume. Aluno fica ou cancela rápido?"

**Perguntou quem você é** → "Trabalho na Raise One."`,

    conversation_questions: `- Aluno novo — indicação ou outro canal?
- Experimental vira matrícula — sabem a taxa?
- Captam o ano todo ou só janeiro?
- Churn — em quanto tempo cancela?
- Qual modalidade querem crescer?
- Promoção traz aluno que fica?`,

    when_to_present_raise_one: `Só se perguntarem. Dono de academia já ouviu todo pitch de promoção.`,

    how_to_present_raise_one: `**"Quem é você?"** — Trabalho na Raise One.

**"O que fazem?"** — Crescimento digital. Em academia: experimental, matrícula, retenção — depende da realidade.

Sem "ajudamos academias".`,

    best_practices: `Horário: 10h–12h ou 14h–16h, fora de pico.

Evite linguagem de "lead" e "funil".

Sensação: dono falando com dono sobre negócio.`,
  },

  objections: [
    { objection: "Promoção resolve", response: "Promoção traz volume. Aluno fica ou cancela rápido?", objective: "Conversa." },
    { objection: "Academia cheia", response: "Ótimo. Obrigado.", objective: "Encerrar." },
    { objection: "Janeiro é nosso mês", response: "Pico clássico. Fora disso, como é?", objective: "Conversa." },
    { objection: "Não tenho interesse", response: "Tranquilo. Obrigado.", objective: "Encerrar." },
    { objection: "Churn é do setor", response: "Comum. Vocês medem em quanto tempo?", objective: "Negócio dele." },
  ],

  qualifications: [
    "Aluno novo — indicação ou outro canal?",
    "Experimental vira matrícula — sabem a taxa?",
    "Captam o ano todo ou só janeiro?",
    "Qual modalidade querem crescer?",
  ],
};
