# Raise One Copilot — Visão de Produto

**Nome:** Raise One Copilot  
**Não é:** Pitch Assistant, gravador de reunião, checklist de 98 perguntas  
**É:** Copiloto de diagnóstico comercial em tempo real — conduz **você**, não a reunião

---

## Mantra

> Transformar conversa comercial não estruturada em **dados estruturados sobre o negócio + diagnóstico + oportunidade**.

O sistema **nunca** pensa: *"Pergunta 31 ainda não foi feita."*  
Ele pensa: *"Ainda não tenho evidência suficiente sobre volume de leads."*

---

## Pipeline cognitivo

```text
Áudio → Transcrição → Contexto → Estado do diagnóstico → Próxima melhor ação
```

Em cada ciclo a IA responde:

1. O que já descobri?
2. O que ainda não sei?
3. O que é importante descobrir **agora**?
4. Qual pergunta destrava essa informação?

---

## Princípios invioláveis

| # | Princípio | Implementação |
|---|-----------|---------------|
| 1 | **Não é questionário** | Discovery Objectives, não lista linear |
| 2 | **Evidence > Answer** | Valor + confiança + citação + fonte |
| 3 | **Fact / Inference / Hypothesis** | Nunca misturar o que foi dito com o que a IA acha |
| 4 | **Captura espontânea** | Se o prospect respondeu, marcar captured — nunca re-perguntar |
| 5 | **Silêncio inteligente** | História emocional, narrativa → não interromper |
| 6 | **Next Best Question** | Prioridade por importância × contexto × missingness |
| 7 | **Transcript imutável** | Interpretação provisória nunca sobrescreve o bruto |
| 8 | **Human override** | Consultor pode corrigir qualquer descoberta |
| 9 | **Gaps explícitos** | "Não recomendamos fechar proposta antes de X" |
| 10 | **Modelo ≠ UI** | Cérebro independente da HUD (Orb hoje, painel amanhã) |

---

## Estados cognitivos da HUD (Orb)

| Estado | Significado | Comportamento |
|--------|-------------|---------------|
| `listening` | Acompanhando | Orb respira; transcrição discreta |
| `understanding` | Processando contexto | Ondas internas |
| `insight` | Descoberta registrada | "Você descobriu: …" |
| `suggestion` | Próximo ponto a investigar | Card Explore + Ask/Skip |
| `capture` | Evidência consolidada | "Captured: Leads/mês ~30" |
| `warning` | Inconsistência detectada | Orb atenção + diff |

---

## Artefatos da reunião

```text
Meeting
├── Transcript (bruto, append-only)
├── Structured conversation state
├── Business Profile (grafo)
├── Discoveries + Evidence
├── Pain Points / Goals / Opportunities
├── Unknowns + Hypotheses
├── Diagnostic coverage
├── Proposal readiness
└── Recommended engagement (Sprint 4+)
```

---

## Fluxo no Raise One OS

```text
Prospect → Pré-contexto → Meeting → Copilot → Business Profile
    → Diagnosis → Opportunities → Proposal Context → Company → Project
```

---

## Separação de Copilots

| Módulo | Uso |
|--------|-----|
| `prospection/copilot/` | Prospecção fria async (WhatsApp, Salões) — **mantido** |
| `domains/copilot/` | Reuniões ao vivo de qualificação/diagnóstico — **este produto** |

---

## Meeting Modes (roadmap)

- `discovery_qualification` — Sprint 1–3 (ativo)
- `briefing`, `strategy`, `review`, `sales_proposal` — futuro
