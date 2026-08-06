import type { SegmentPlaybook } from "./types";

export const escolasPlaybook: SegmentPlaybook = {
  slug: "escolas",
  scripts: {
    segment_overview: `Escola vive de matrícula e reputação. Família pesquisa, visita, compara.

Captação sazonal — pico janeiro. Indicação de pais pesa muito.

Conversas interessantes: origem de matrículas, vagas ociosas, famílias indecisas, diferencial pedagógico, região.`,

    pre_contact_checklist: `□ Site — proposta pedagógica clara?
□ GMB — avaliações, fotos
□ Instagram — ativo fora de janeiro?
□ Formulário de interesse
□ Tour virtual / vídeo
□ Nível de ensino (infantil, fundamental, médio)
□ Bairro/região
□ Vagas visíveis?
□ Resposta a avaliações
□ Escola nova ou consolidada?`,

    conversation_philosophy: `Conversa respeitosa sobre educação e negócio.

Você pesquisa escolas da região. Não vende matrícula. Não fala de marketing escolar.

Primeira mensagem: observação + curiosidade + pergunta. Sem Raise One.

Família e gestor querem falar de matrícula, indicação, visita — não de agência.`,

    first_approach_examples: `**Padrão 1 — Avaliações**

Oi, [Nome], tudo bem?

Estava pesquisando escolas em [Cidade] e encontrei a [Escola].

Vi que vocês têm bastante avaliação no Google — família leva isso a sério.

Fiquei curioso: matrícula nova costuma vir mais por indicação ou vocês sentem família chegando pelo Google?

---

**Padrão 2 — Proposta pedagógica**

Oi, [Nome]!

Passei pelo site da [Escola] e a proposta de [bilingue/infantil/etc.] ficou clara.

Como famílias novas costumam encontrar vocês — indicação, visita, pesquisa online?

---

**Padrão 3 — Sazonalidade**

Oi, [Nome], tudo bem?

Converso com gestores e janeiro sempre aparece como pico.

Fora desse período, vocês sentem vaga ociosa ou matrícula vem o ano todo?

---

**Padrão 4 — Região**

Oi, [Nome]!

Família muda de bairro o ano todo. Vi a [Escola] na região de [bairro].

Vocês captam essa demanda ou depende muito de indicação?

---

**Padrão 5 — Visita**

Oi, [Nome], boa tarde.

Vi que vocês agendam visita pelo site.

Família que visita e não matricula — alguém retoma contato ou se perde?

---

**Padrão 6 — Segmento específico**

Oi, [Nome], tudo bem?

Vi que a [Escola] foca em [infantil/médio/etc.].

Esse segmento enche fácil aí ou tem turma com vaga?`,

    conversation_patterns: `**"Mais indicação"** → "Indicação é ouro. Vocês preveem vagas fora de janeiro?"

**"Marketing só janeiro"** → "Janeiro é pico. Família pesquisa o ano todo — vocês sentem isso?"

**"Escola cheia"** → "Ótimo. Obrigado por responder."

**"Família indecisa"** → "Família visita várias escolas. O que vocês fazem quando não matricula de primeira?"

**Perguntou quem você é** → "Trabalho na Raise One."`,

    conversation_questions: `- Matrícula vem mais por indicação ou pesquisa?
- Fora de janeiro, tem vaga ociosa?
- Família que visitou e não matriculou — alguém retoma?
- Qual diferencial vocês mais destacam?
- Qual segmento gostariam de crescer?`,

    when_to_present_raise_one: `Só se perguntarem. Decisão envolve mantenedora — paciência e respeito.`,

    how_to_present_raise_one: `**"Quem é você?"** — Trabalho na Raise One.

**"O que fazem?"** — Crescimento digital. Em escola: família certa, no momento certo — depende da realidade.

Nunca "ajudamos escolas a captar matrícula".`,

    best_practices: `Tom respeitoso. Nunca trate escola como produto.

Horário: 9h–11h ou 14h–16h.

Pesquise proposta pedagógica antes de escrever.`,
  },

  objections: [
    { objection: "Matrícula é indicação", response: "Indicação é o melhor. Vocês preveem vagas fora de janeiro?", objective: "Conversa." },
    { objection: "Escola cheia", response: "Ótimo. Obrigado pelo tempo.", objective: "Encerrar." },
    { objection: "Não tenho interesse", response: "Tranquilo. Obrigado.", objective: "Encerrar." },
    { objection: "Pais não vêm da internet", response: "Parte vem por indicação, mas família pesquisa antes de visitar — vocês sentem isso?", objective: "Reflexão." },
  ],

  qualifications: [
    "Matrícula vem mais por indicação ou pesquisa?",
    "Fora de janeiro, tem vaga ociosa?",
    "Família que visitou e não matriculou — alguém retoma?",
    "Qual segmento gostariam de crescer?",
  ],
};
