# Raise One Client — Contrato do Portal

**Sprint C0** · Branch `feat/client-portal-sprint-0`  
**Mantra:** O Client não é Admin reduzido — é **transparência, resultado e aprovação**.

---

## Perguntas que o portal responde

1. O que a Raise One está fazendo?
2. O que isso está gerando para mim?
3. O que precisa da minha ação?

---

## Admin vs Client

| Admin | Client |
|-------|--------|
| O que precisamos fazer? | O que está acontecendo? |
| Work Queue interna | Ações pendentes do **cliente** |
| Notas, margem, pipeline | Apenas dados da **própria empresa** |
| Status internos crus | Camada de **tradução** |

---

## Auth (C0)

| Conceito | Decisão |
|----------|---------|
| Usuário | `company_users` — e-mail único, ligado a `company_id` |
| Login | Magic link (15 min, uso único) |
| Sessão | Cookie `raise_client_session`, path `/client`, 7 dias |
| E-mail | Resend (`RESEND_API_KEY`) — dev loga link no console |

### Variáveis

| Variável | Uso |
|----------|-----|
| `CLIENT_APP_URL` | Base URL dos magic links |
| `RESEND_API_KEY` | Envio de e-mail (prod) |
| `CLIENT_EMAIL_FROM` | Remetente |

### Piloto

```bash
# Após migration 019
npx tsx scripts/seed-client-user.ts
# ou
npx tsx scripts/seed-client-user.ts --email voce@empresa.com --name "Gabriel"
```

---

## Dados visíveis

O cliente **nunca** vê: prospects, pipeline, custos internos, margem, tarefas internas, notas internas, outros clientes.

Consome (via server, filtrado por `company_id`):

- `marketing_snapshots` → Resultados
- `content_tasks` (subset) → Conteúdo / Aprovação
- `projects` (subset) → Projetos
- `finance_entries` (subset) → Financeiro
- `domain_events` (catálogo filtrado) → Atividade / notificações

---

## Camada de tradução

Implementação: `src/domains/client-portal/translate.ts`

- Status de conteúdo → labels client-facing
- `project.blocked` + tipo → mensagem amigável
- Eventos → subset `CLIENT_VISIBLE_EVENT_KEYS`

---

## Eventos client-facing (subset)

- `content.sent_for_approval`
- `content.approved`
- `content.revision_requested` *(C2)*
- `project.status_changed`, `project.blocked`, `project.unblocked`
- `finance.payment_*`
- `marketing.synced`, `marketing.snapshot_created`

Mesmo evento no OS → experiências diferentes (notificação interna vs ação do cliente).

---

## Rotas (C0)

| Rota | Sprint |
|------|--------|
| `/client/login` | C0 |
| `/client/auth/verify` | C0 |
| `/client` (Visão geral) | C0 shell · C1 dados |
| `/client/resultados` | C1.1 |
| `/client/conteudo` | C2 |
| `/client/projetos` | C3 |
| `/client/financeiro` | C4 |

---

## Roadmap Client

| Sprint | Entrega |
|--------|---------|
| **C0** | Auth magic link + shell + contrato | ✅ |
| **C1** | Home: métricas, Precisa de você, O que fizemos, projetos, conteúdo | ✅ |
| **C1.1** | Resultados + bloco “Seu mês” na home (métricas, comparativo, canais, gráfico) | ✅ |
| **C2** | Conteúdo: preview, aprovar, solicitar alteração → `content.revision_requested` | ✅ |
| **C3** | Projetos: status, progresso, histórico traduzido | ✅ |
| **C4** | Financeiro: assinatura, mídia, histórico | ✅ |
| **C1.1+** | Notificações, IA narrativa, integrações Ads API |

---

## Schema (migration 019)

- `company_users`
- `client_magic_links`

RLS habilitado; acesso via service role + autorização na aplicação (`requireClientAuth()`).
