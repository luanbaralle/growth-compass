import type { SegmentPlaybook } from "./types";

export const imobiliariasPlaybook: SegmentPlaybook = {
  slug: "imobiliarias",
  scripts: {
    segment_overview: `Imobiliária vive de lead e velocidade. Quem responde primeiro fecha.

Maioria depende de portais. Lead disputado, custo sobe.

Conversas interessantes: origem do lead, tempo de resposta, imóvel parado, lançamentos, plantão, conversão visita → venda.`,

    pre_contact_checklist: `□ Portais — Zap, OLX, Viva Real
□ Site próprio ou só portal?
□ Instagram — imóveis, região
□ Google Maps
□ Lançamento ativo?
□ Imóveis parados há tempo?
□ WhatsApp centralizado ou por corretor?
□ Avaliações
□ Tempo de resposta (simule formulário)
□ Região/bairro de atuação`,

    conversation_philosophy: `Você pesquisa imobiliárias da região. Conversa sobre o mercado deles.

Primeira mensagem: observação + curiosidade + pergunta. Sem Raise One.

Imobiliário é direto — seja objetivo, mas humano.

Raise One só se perguntarem.`,

    first_approach_examples: `**Padrão 1 — Portais**

Oi, [Nome], tudo bem?

Estava olhando imobiliárias em [Cidade] e vi a [Imobiliária] nos portais.

Fiquei curioso — hoje a maior parte dos leads vem de portal ou vocês captam por canal próprio também?

---

**Padrão 2 — Lançamento**

Oi, [Nome]!

Vi que vocês estão com [empreendimento] na região.

Como está sendo captar interessados — plantão, portal, indicação?

---

**Padrão 3 — Tempo de resposta**

Oi, [Nome], tudo bem?

Pesquisando imobiliárias da região, uma coisa que sempre me chama atenção: velocidade de resposta.

Quando lead chega aí, em quanto tempo alguém responde, em média?

---

**Padrão 4 — Região/bairro**

Oi, [Nome]!

Vi que a [Imobiliária] atua bastante em [bairro/região].

Esse mercado está movimentado aí ou imóvel está parado?

---

**Padrão 5 — Instagram**

Oi, [Nome]!

Instagram de vocês com imóveis bem apresentados.

Esse canal traz lead que vira visita ou é mais vitrine?

---

**Padrão 6 — Alto padrão (se observou)**

Oi, [Nome], tudo bem?

Reparei que vocês trabalham com imóveis de [alto padrão/faixa X].

Cliente desse perfil chega como — indicação, portal, outro?`,

    conversation_patterns: `**"Portal concentra"** → "Portal funciona. Vocês medem quantos viram visita?"

**"Resposta demora"** → "Converso com imobiliárias e isso custa negócio. O que trava aí?"

**"Imóvel parado"** → "Mercado apertado ou falta divulgação? Vocês sentem qual dos dois?"

**"Lead ruim"** → "Parte é curioso. Vocês qualificam antes de visita?"

**Perguntou quem você é** → "Trabalho na Raise One."`,

    conversation_questions: `- De onde vêm a maioria dos leads?
- Portal — sabem custo por lead que vira visita?
- Lead chega — quem responde, em quanto tempo?
- Imóvel parado — falta lead ou mercado?
- Follow-up de quem visitou e não fechou?
- Lançamento — como captam interessados?`,

    when_to_present_raise_one: `Só se perguntarem. Mercado imobiliário não tem paciência para pitch não solicitado.`,

    how_to_present_raise_one: `**"Quem é você?"** — Trabalho na Raise One.

**"O que fazem?"** — Crescimento digital e processo comercial. Em imobiliária: lead, resposta, origem clara.

Sem listar portal, ads, CRM.`,

    best_practices: `Direto e objetivo. Pesquise portais e Instagram antes.

Horário: 9h–11h ou 17h–18h.

Respeite ciclos do mercado — eficiência, não volume inventado.`,
  },

  objections: [
    { objection: "Portal resolve", response: "Funciona. Vocês medem quantos viram visita e venda?", objective: "Conversa." },
    { objection: "Mercado difícil", response: "Justamente. Quem responde rápido captura o que existe. Como está aí?", objective: "Negócio dele." },
    { objection: "Lead de portal é ruim", response: "Parte é curioso. Processo de qualificação muda isso?", objective: "Processo." },
    { objection: "Não tenho interesse", response: "Tranquilo. Obrigado.", objective: "Encerrar." },
  ],

  qualifications: [
    "De onde vêm a maioria dos leads?",
    "Quando lead chega, em quanto tempo respondem?",
    "Imóvel parado — falta lead ou mercado?",
    "Follow-up de quem visitou e não fechou?",
  ],
};
