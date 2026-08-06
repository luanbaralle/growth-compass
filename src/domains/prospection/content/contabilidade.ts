import type { SegmentPlaybook } from "./types";

export const contabilidadePlaybook: SegmentPlaybook = {
  slug: "contabilidade",
  scripts: {
    segment_overview: `Escritório contábil vive de confiança, recorrência e indicação.

Crescimento lento. Carteira estável, indicação de clientes e parceiros.

Conversas interessantes: origem de empresas novas, perfil ideal (MEI, Simples, médio porte), previsibilidade, parcerias, posicionamento local.`,

    pre_contact_checklist: `□ Site profissional?
□ GMB, avaliações
□ LinkedIn
□ Segmentação (MEI, empresas)
□ Landing abertura/migração?
□ E-mail comercial ou @gmail?
□ Conteúdo tributário
□ Parcerias visíveis
□ Escritório novo ou consolidado?
□ Aparece em "contador [cidade]"?`,

    conversation_philosophy: `Você pesquisa escritórios contábeis. Conversa sobre carteira, crescimento, mercado.

Primeira mensagem: observação + curiosidade + pergunta. Sem Raise One. Sem "ajudar empresas".

Contador decide com cautela. Tom de parceiro de negócio.`,

    first_approach_examples: `**Padrão 1 — Região**

Oi, [Nome], tudo bem?

Estava pesquisando escritórios contábeis em [Cidade] e encontrei o [Escritório].

Pela apresentação, vocês parecem bem estruturados.

Fiquei curioso — empresas novas chegam mais por indicação ou vocês recebem consulta direta?

---

**Padrão 2 — Segmento MEI/Simples**

Oi, [Nome]!

Vi que vocês atuam com [MEI/Simples/empresas].

Esse perfil vocês captam como — indicação, parceria com advogado, busca no Google?

---

**Padrão 3 — Abertura de empresa**

Oi, [Nome], boa tarde.

Empresário que vai abrir empresa pesquisa "contador" antes de decidir.

Vocês sentem esse movimento aí ou concentra indicação?

---

**Padrão 4 — LinkedIn**

Oi, [Nome]!

Vi conteúdo de vocês sobre [tributário/folha].

Post traz empresa nova ou é mais posicionamento?

---

**Padrão 5 — Carteira**

Oi, [Nome], tudo bem?

Encontrei o [Escritório] pesquisando a região.

Carteira de vocês está no limite ou ainda há espaço para empresas novas?

---

**Padrão 6 — Site claro**

Oi, [Nome]!

Site do [Escritório] transmite credibilidade.

Quem preenche formulário — vocês sentem que converte ou indicação concentra?`,

    conversation_patterns: `**"Mais indicação"** → "Indicação é o melhor. Vocês preveem empresas novas por trimestre?"

**"Carteira cheia"** → "Ótimo. Obrigado por responder."

**"Site traz consulta"** → "Interessante. Quantas viram cliente?"

**"Parcerias"** → "Advogado, consultor — traz quanto da carteira?"

**Perguntou quem você é** → "Trabalho na Raise One."`,

    conversation_questions: `- Empresas novas — indicação ou busca direta?
- Carteira no limite ou há espaço?
- Qual perfil preferem — MEI, Simples, médio porte?
- Parcerias trazem quanto?
- Proposta enviada — alguém faz follow-up?
- Aparecem em buscas locais?`,

    when_to_present_raise_one: `Só se perguntarem. Ciclo longo — paciência.`,

    how_to_present_raise_one: `**"Quem é você?"** — Trabalho na Raise One.

**"O que fazem?"** — Crescimento digital e processo comercial. Em contabilidade: empresa certa, no momento de decisão.

Sem "ajudamos escritórios".`,

    best_practices: `Tom profissional, parceiro. Horário: 8h–9h30 ou 17h–18h.

Empresa troca contador com cuidado — timing importa.`,
  },

  objections: [
    { objection: "Cliente vem por indicação", response: "Indicação é o melhor. Vocês preveem empresas novas por trimestre?", objective: "Conversa." },
    { objection: "Carteira cheia", response: "Ótimo. Obrigado.", objective: "Encerrar." },
    { objection: "Empresa não troca fácil", response: "Ciclo longo, concordo. Minha curiosidade era sobre como vocês captam hoje.", objective: "Voltar." },
    { objection: "Não tenho interesse", response: "Tranquilo. Obrigado.", objective: "Encerrar." },
  ],

  qualifications: [
    "Empresas novas — indicação ou busca direta?",
    "Carteira no limite ou há espaço?",
    "Qual perfil preferem?",
    "Parcerias trazem quanto?",
  ],
};
