# Raise One OS — Roadmap de Produto

**Versão:** Sprint 0 (consolidado)  
**Mantra:** Uma ação → um event → múltiplos contextos atualizados.

---

## Visão

O Raise One OS deixa de ser "painel da agência" e vira **a máquina operacional da Raise One**.

```text
                    RAISE ONE OS (ADMIN)
                           │
     ┌─────────────────────┼─────────────────────┐
     │                     │                     │
 Comercial            Operação              Financeiro
 Prospecção           Projetos              Cobranças
 Empresas             Produção              Receita
     │                     │                     │
     └─────────────────────┼─────────────────────┘
                           │
                       MARKETING
                    (dados + resultados)
                           │
                           ▼
                    CLIENTE PORTAL (Fase 6)
```

---

## Regra de feature

> Elimina trabalho manual, reduz erro ou aumenta receita. Senão, não entra.

---

## Fase 1 — Consolidar o OS

| Sprint | Entrega | Validação |
|--------|---------|-----------|
| **0** | Contrato de domínio + eventos (`domain-contract.md`) | Equipe aprova catálogo |
| **A** | `domain_events` + `notifications` + `emitDomainEvent()` + tasks automáticas | Status change gera evento + notificação sem cadastro manual |
| **B** | Produção drawer completo (briefing, arquivos, aprovação, publicação) | Vini opera 1 conteúdo fim-a-fim no OS |
| **C** | Projetos: `blocked_by` + `next_action` + assignee | Todo atrasado tem motivo + ação |
| **D** | Empresa 360º (Produção, Serviços, Pendências) | 1 cliente = visão completa |
| **E** | Dashboard + **Work Queue** | Abrir de manhã = saber o que fazer em 30s |
| **F** | Atividade central `/os/atividade` | Feed das últimas 24h |
| **G** | Busca global Ctrl+K | Achar entidade em <3s |
| **H** | Minha agenda (UI) | Substitui post-it do dia |

**Cross-module desde Sprint A:** toda feature nova cria/consuma relações entre entidades.

**Agenda parcial desde Sprint A:** tasks automáticas antes da UI completa.

---

## Fase 2 — Conectar módulos

- Prospect convertido → company com histórico
- Marketing no perfil 360 com narrativa
- Pipeline comercial na Work Queue
- Consistência de responsáveis

---

## Fase 3 — Integrações (incremental)

| Etapa | Integração |
|-------|------------|
| 3.1 | **Google Ads** (prioridade — core Raise One) |
| 3.2 | Meta Ads |
| 3.3 | WhatsApp (prospecção) |

Fluxo: Integração → Marketing → Company → Dashboard → (futuro) Portal

---

## Fase 4 — Automações

Eventos → side effects fixos no código (sem rules engine configurável):

- `content.approved` → task "Programar publicação"
- `content.scheduled` → task "Publicar"
- `content.published` → task "Analisar em 7 dias"
- `lead.replied` → notification + work queue
- `payment.overdue` → notification + task

---

## Fase 5 — IA contextual

Botões onde há raciocínio — nunca menu "IA":

- Analisar prospect · Identificar risco · Gerar briefing
- Explicar queda · Resumir relacionamento · O que merece atenção?

**Regra:** Database → Metrics → AI → Explanation. IA nunca inventa dados.

---

## Fase 6 — Portal do cliente

Auth separada · Aprovações · Relatório narrativo mensal · Métricas + história de progresso.

---

## Ciclo de execução

```text
Sprint → uso real (Luan, Vini, Caio) → feedback → ajuste → próximo
```

Não acumular sprints sem validação.
