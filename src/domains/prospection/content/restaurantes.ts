import type { SegmentPlaybook } from "./types";

export const restaurantesPlaybook: SegmentPlaybook = {
  slug: "restaurantes",
  scripts: {
    segment_overview: `Restaurante vive de fluxo e reputação. Sábado lotado, terça vazio — padrão clássico.

Delivery via app traz volume, margem apertada.

Conversas interessantes: salão vs delivery, dias fracos, avaliações, ticket médio, movimento no almoço/jantar.`,

    pre_contact_checklist: `□ GMB — cardápio, fotos, horários
□ Avaliações — nota, respostas
□ Instagram — pratos, frequência
□ Delivery — app ou próprio?
□ Cardápio legível no celular?
□ Dias/horários aparentemente vazios
□ Prato ou ambiente que se destaca
□ Região/bairro
□ Fecham algum dia?
□ Movimento visível (filas, lotação em fotos)`,

    conversation_philosophy: `Você pesquisa restaurantes da região. Conversa sobre operação, movimento, delivery.

Dono não tem tempo — seja curto e real.

Primeira mensagem: observação + curiosidade + pergunta. Sem Raise One. Sem marketing.

Fale de mesa, prato, horário, delivery — não de "captação de clientes".`,

    first_approach_examples: `**Padrão 1 — Avaliações**

Oi, [Nome], tudo bem?

Estava pesquisando restaurantes em [Cidade] e encontrei o [Restaurante].

Vi que vocês têm bastante avaliação — [mencionar prato/comentário se viu].

Fiquei curioso: movimento vem mais do salão ou delivery pesa mais?

---

**Padrão 2 — Prato específico**

Oi, [Nome]!

Vi fotos do [prato] no Instagram de vocês — chamou atenção.

Esse prato é carro-chefe ou tem outros que vendem mais?

---

**Padrão 3 — Delivery**

Oi, [Nome], tudo bem?

Vi o [Restaurante] no Maps. Delivery de vocês é pelo app ou tem canal próprio?

---

**Padrão 4 — Dia fraco**

Oi, [Nome]!

Converso com donos de restaurante e uma coisa sempre aparece: fim de semana lotado, meio de semana mais tranquilo.

Como é aí — tem dia que costuma sobrar mesa?

---

**Padrão 5 — Movimento almoço**

Oi, [Nome], tudo bem?

Região de [bairro] movimenta no almoço. Vi o [Restaurante].

Almoço corporativo pesa na receita de vocês ou é mais jantar/fim de semana?

---

**Padrão 6 — Restaurante novo**

Oi, [Nome]!

Vi que o [Restaurante] está em [bairro] — parece recente.

Como tem sido os primeiros meses de movimento?`,

    conversation_patterns: `**"Mais salão"** → "Salão é margem melhor. Delivery entra ou quase não?"

**"iFood concentra"** → "App traz volume. Margem de vocês compensa ou aperta?"

**"Terça vazia"** → "Super comum. Vocês fazem algo nesse dia ou deixam natural?"

**"Indicação"** → "Indicação é ouro. Google traz gente nova ou só quem já conhece?"

**Perguntou quem você é** → "Trabalho na Raise One."`,

    conversation_questions: `- Salão e delivery — o que pesa mais?
- Tem dia que costuma ficar vazio?
- Delivery é app ou direto?
- Margem do app compensa?
- Avaliações negativas — vocês respondem?
- Almoço ou jantar pesa mais?`,

    when_to_present_raise_one: `Só se perguntarem. Nunca no meio do rush (almoço/jantar).`,

    how_to_present_raise_one: `**"Quem é você?"** — Trabalho na Raise One.

**"O que fazem?"** — Crescimento digital. Em restaurante: movimento, delivery, dias — depende da operação.

Sem "ajudamos restaurantes".`,

    best_practices: `Horário: 15h–17h. Nunca sábado almoço.

Mencione prato ou ambiente se viu. Frases curtas.

Sensação: conversa de dono com dono.`,
  },

  objections: [
    { objection: "iFood resolve", response: "App traz volume. Margem compensa aí?", objective: "Conversa." },
    { objection: "Restaurante cheio", response: "Ótimo. Obrigado.", objective: "Encerrar." },
    { objection: "Não tenho interesse", response: "Tranquilo. Obrigado.", objective: "Encerrar." },
    { objection: "Não acredito em marketing", response: "Entendo. Minha curiosidade era sobre movimento e operação, não propaganda.", objective: "Clareza." },
  ],

  qualifications: [
    "Salão e delivery — o que pesa mais?",
    "Tem dia que costuma ficar vazio?",
    "Delivery é app ou direto?",
    "Almoço ou jantar pesa mais?",
  ],
};
