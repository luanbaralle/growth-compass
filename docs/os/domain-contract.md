# Raise One OS — Contrato de Domínio e Eventos

**Sprint 0** · Branch `feat/os-domain-events-sprint-0`  
**Status:** Fonte da verdade arquitetural até segunda ordem  
**Objetivo:** Definir entidades, relações, eventos e responsáveis **antes** de criar infra nova — evitando o quinto mecanismo de "algo aconteceu".

---

## Mantra

> **Uma ação do usuário → um domain event → múltiplos contextos atualizados automaticamente.**

O OS captura trabalho. Não exige cadastro manual de atividade.

---

## Tenant e usuários

| Conceito | Decisão |
|----------|---------|
| **Organização** | Single-tenant: Raise One. Sem `org_id` por enquanto. |
| **Usuários internos** | `TeamMember`: `luan` \| `vini` \| `caio` (`src/lib/auth/types.ts`) |
| **Autenticação** | PIN por membro + sessão cookie (`ADMIN_PASSWORD` legado) |
| **Cliente externo** | Não existe ainda (Portal — Fase 6) |

### Campos de responsável (importante)

| Campo | Entidade | Significado |
|-------|----------|-------------|
| `author_id` | Eventos, comentários, interações | Quem executou a ação |
| `owner_id` | Prospect, Project | Responsável interno Raise One |
| `production_owner_id` | ContentTask | Responsável de produção |
| `assignee_id` | Task (futuro) | Quem deve resolver |
| `responsible_name` | Company | **Nome do contato do cliente** — NÃO é membro da equipe |

---

## Mapa de entidades

### Hierarquia operacional

```text
Prospect ──convert──► Company (raiz operacional)
                          │
        ┌─────────────────┼─────────────────┬──────────────┐
        ▼                 ▼                 ▼              ▼
    Project         ContentTask      FinanceEntry   MarketingSnapshot
        │                 │                 │              │
    Checklist         Events            Receipt        metrics
    Comments          (timeline)        (file)
        │
      Task (futuro)
```

### Tabela de entidades

| Entidade | Tabela | PK | Pertence a | Fonte da verdade |
|----------|--------|-----|------------|------------------|
| **Company** | `companies` | `id` | — (raiz) | `companies` |
| **CompanyActivity** | `company_activities` | `id` | Company | *legado — migrar para derivar de event* |
| **CompanyFile** | `company_files` | `id` | Company | `company_files` |
| **CompanyLink** | `company_links` | `id` | Company | `company_links` |
| **CompanyService** | `company_services` | `id` | Company | `company_services` |
| **Prospect** | `prospects` | `id` | — (pré-company) | `prospects` |
| **ProspectInteraction** | `prospect_interactions` | `id` | Prospect | *legado — migrar* |
| **Project** | `projects` | `id` | Company | `projects` |
| **ProjectChecklistItem** | `project_checklist_items` | `id` | Project | `project_checklist_items` |
| **ProjectComment** | `project_comments` | `id` | Project | `project_comments` |
| **ContentTask** | `content_tasks` | `id` | Company | `content_tasks` |
| **ContentTaskEvent** | `content_task_events` | `id` | ContentTask | *legado — migrar* |
| **FinanceEntry** | `finance_entries` | `id` | Company | `finance_entries` |
| **MarketingSnapshot** | `marketing_snapshots` | `id` | Company | `marketing_snapshots` |
| **Task** | `tasks` | `id` | Company/Project (opc.) | `tasks` — **sem UI ainda** |
| **Meeting** | `meetings` | `id` | Company (opc.) | `meetings` — **sem UI ainda** |
| **DomainEvent** | `domain_events` | `id` | — | **Sprint A — hub único** |
| **Notification** | `notifications` | `id` | User (assignee) | **Sprint A** |
| **WorkQueueItem** | *view/computed* | — | User | Derivado de entidades + eventos |

### Relações novas (Sprint A–C)

| Relação | Campo | Sprint | Motivo |
|---------|-------|--------|--------|
| ContentTask → Project | `content_tasks.project_id` | B | Cross-module |
| Project bloqueio | `projects.blocked_by_type`, `blocked_by_detail` | C | Work Queue |
| Project próxima ação | `projects.next_action`, `next_action_due` | C | Work Queue |
| Task origem | `tasks.source_event_id`, `source_type` | A | Automação |
| Notification origem | `notifications.domain_event_id` | A | Rastreabilidade |

---

## Arquitetura: Evento ≠ Atividade ≠ Notificação ≠ Automação

```text
AÇÃO DO USUÁRIO
       │
       ▼
DOMAIN EVENT                    ← única fonte: "algo aconteceu"
(domain_events)
       │
       ├──────────────────┬──────────────────┬──────────────────
       ▼                  ▼                  ▼
   ACTIVITY          NOTIFICATION         AUTOMATION
   (timeline/feed)   (sino/inbox)        (side effects)
       │                  │                  │
 company timeline    assignee_id         create task
 content timeline    action_url          future rules
 prospect timeline   read_at             send webhook
 global feed
       │
       └──────────────────┴──────────────────┘
                          ▼
                    WORK QUEUE
              "O que eu faço agora?"
```

### Definições

| Camada | O que é | Persistência | Exemplo |
|--------|---------|--------------|---------|
| **Domain Event** | Fato imutável do domínio | `domain_events` | `content.status_changed` |
| **Activity** | Representação humana para timeline | Derivada + legado durante migração | "Vini moveu para Aprovação" |
| **Notification** | Alerta acionável para alguém | `notifications` | "Conteúdo aguardando aprovação → Abrir" |
| **Automation** | Efeito colateral programático | Tasks, emails futuros | Criar task "Programar publicação" |
| **Work Queue** | Vista priorizada de pendências | Computada + cache opcional | 🔴 3 itens precisam de você |

### Regra de ouro

**Nenhum service escreve diretamente em `company_activities`, `content_task_events` ou `prospect_interactions` após Sprint A.**

Todos passam por `emitDomainEvent()`. Writers legados permanecem como **projections** durante migração.

---

## Catálogo de Domain Events

Convenção: `{entity}.{action}` em snake_case no banco, dot notation no código.

### Company

| Event key | Disparado quando | Payload mínimo | Notifica? | Task? |
|-----------|------------------|----------------|-----------|-------|
| `company.created` | Empresa criada manualmente | `{ stage }` | Não | Não |
| `company.lead_captured` | Formulário público | `{ source, segment }` | Sim → comercial | Não |
| `company.stage_changed` | Mudança de estágio | `{ from, to }` | Se → ativo | Não |
| `company.note_added` | Anotação manual | `{ body }` | Não | Não |
| `company.file_added` | Upload de arquivo | `{ fileId, category }` | Não | Não |

### Prospect

| Event key | Disparado quando | Payload mínimo | Notifica? | Task? |
|-----------|------------------|----------------|-----------|-------|
| `prospect.created` | Prospect cadastrado | `{ status }` | Não | Não |
| `prospect.status_changed` | Pipeline move | `{ from, to }` | Não | Não |
| `prospect.message_sent` | Mensagem enviada | `{ direction: out }` | Não | Não |
| `prospect.message_received` | Lead respondeu | `{ direction: in }` | **Sim → owner** | Sim se sem next_action |
| `prospect.converted` | Virou company | `{ companyId }` | Sim → owner | Não |
| `prospect.next_action_due` | Prazo venceu (job futuro) | `{ action }` | **Sim → owner** | Sim |

### Project

| Event key | Disparado quando | Payload mínimo | Notifica? | Task? |
|-----------|------------------|----------------|-----------|-------|
| `project.created` | Projeto criado | `{ type }` | Não | Não |
| `project.status_changed` | Status alterado | `{ from, to }` | Se → blocked | Não |
| `project.blocked` | Marcado bloqueado | `{ blockedByType, detail }` | **Sim → owner** | Sim |
| `project.unblocked` | Desbloqueado | `{ previousBlock }` | Não | Completa task |
| `project.overdue` | due_date < hoje (job) | `{ daysOverdue }` | **Sim → owner** | Sim |
| `project.next_action_set` | Próxima ação definida | `{ action, due }` | Não | Sim |

### Content

| Event key | Disparado quando | Payload mínimo | Notifica? | Task? |
|-----------|------------------|----------------|-----------|-------|
| `content.created` | Conteúdo criado | `{ channels, contentType }` | Não | Não |
| `content.status_changed` | Qualquer mudança de status | `{ from, to }` | Condicional | Condicional |
| `content.sent_for_approval` | → `aprovacao` | `{ title }` | Sim → comercial | Task p/ cliente (futuro) |
| `content.approved` | → `aprovado` | `{ title }` | Sim → produção | Task "Programar" |
| `content.scheduled` | → `programado` | `{ postDate, channels }` | Sim → produção | Task "Publicar" |
| `content.published` | → `publicado` | `{ channels }` | Não | Task "Analisar em 7d" |
| `content.note_added` | Nota na timeline | `{ body }` | Não | Não |

### Finance

| Event key | Disparado quando | Payload mínimo | Notifica? | Task? |
|-----------|------------------|----------------|-----------|-------|
| `finance.entry_created` | Cobrança criada | `{ amountCents, dueDate }` | Não | Não |
| `finance.payment_received` | Marcado pago | `{ amountCents, type }` | Não | Não |
| `finance.payment_overdue` | Vencimento passou (job) | `{ amountCents, daysOverdue }` | **Sim → financeiro** | Sim |
| `finance.payment_due_soon` | Vence em 1–3 dias (job) | `{ amountCents, dueDate }` | **Sim → financeiro** | Sim |

### Marketing

| Event key | Disparado quando | Payload mínimo | Notifica? | Task? |
|-----------|------------------|----------------|-----------|-------|
| `marketing.snapshot_created` | Snapshot manual | `{ channel }` | Não | Não |
| `marketing.synced` | Integração API (Fase 3) | `{ channel, period }` | Não | Não |

### Task / Meeting

| Event key | Disparado quando | Payload mínimo | Notifica? | Task? |
|-----------|------------------|----------------|-----------|-------|
| `task.created` | Task manual ou auto | `{ sourceEventId? }` | Sim → assignee | — |
| `task.completed` | Task concluída | `{ title }` | Não | — |
| `meeting.scheduled` | Reunião agendada | `{ startsAt }` | Sim → attendees | — |

---

## Work Queue — modelo de item acionável

Todo item na fila responde **cinco perguntas**:

```text
1. O que precisa de atenção?
2. Quem é responsável?        → assignee_id (TeamMember)
3. Qual o bloqueio/contexto?   → blocked_by / subtitle
4. Qual a próxima ação?        → next_action label + action_url
5. Qual a urgência/prazo?      → 🔴 🟡 🟢 + due_at
```

### Fontes da Work Queue

| Prioridade | Fonte | Condição | Responsável default |
|------------|-------|----------|---------------------|
| 🔴 Urgente | Project | `status = blocked` OR overdue | `owner_id` |
| 🔴 Urgente | FinanceEntry | overdue OR due in 1 day | `luan` (financeiro) |
| 🔴 Urgente | Prospect | `next_action_date` ≤ hoje | `owner_id` |
| 🟡 Hoje | ContentTask | `status = aprovacao` | `production_owner_id` |
| 🟡 Hoje | ContentTask | `status = aprovado` sem programar | `production_owner_id` |
| 🟡 Hoje | Task | `due_date = hoje` AND `done = false` | `assignee_id` |
| 🟢 Acomp. | Prospect | next_action futura | `owner_id` |
| 🟢 Acomp. | Project | in_progress, no overdue | `owner_id` |

### Interface computada (Sprint E)

```typescript
interface WorkQueueItem {
  id: string;                    // "{source}:{entityId}"
  source: WorkQueueSource;
  entityId: string;
  companyId: string | null;
  title: string;
  subtitle: string;              // bloqueio / contexto
  nextActionLabel: string;       // "Cobrar cliente"
  actionUrl: string;
  assigneeId: TeamMember | null;
  urgency: "critical" | "today" | "watch";
  dueAt: string | null;
}
```

---

## Responsáveis — regras de atribuição

| Contexto | Responsável | Fallback |
|----------|-------------|----------|
| Projeto | `project.owner_id` | `luan` |
| Prospect | `prospect.owner_id` | `luan` |
| Conteúdo (produção) | `content_task.production_owner_id` | `vini` |
| Cobrança | Fixo financeiro | `luan` |
| Lead captado | Comercial | `luan` |
| Aprovação de conteúdo (cliente) | Externo — sem assignee interno | Notifica produção |

---

## Estado legado — três mecanismos atuais

| Tabela | Módulo | Writers atuais | Destino |
|--------|--------|----------------|---------|
| `company_activities` | Empresas, Projetos, Financeiro, Produção | 6+ services | Projection de `domain_events` com `scope: company` |
| `content_task_events` | Produção | `content-task-events.server.ts` | Projection com `scope: content_task` |
| `prospect_interactions` | Prospecção | `prospection/service.server.ts` | Projection com `scope: prospect` |

### Problemas do legado

1. **Duplicação:** Produção escreve em `content_task_events` E `company_activities` no status change
2. **Sem hub:** Dashboard recomputa notificações a cada load (`dashboard-notifications.ts`)
3. **Sem assignee persistido:** Notificações não sabem quem leu
4. **Timelines isoladas:** Sem feed global

### Estratégia de migração (Sprint A)

**Fase 1 — Adicionar sem quebrar**

1. Criar `domain_events` + `notifications`
2. Criar `src/domains/events/emit.server.ts` com `emitDomainEvent()`
3. Novos writers passam pelo hub; projections legadas continuam

**Fase 2 — Migrar writers módulo a módulo**

Ordem: Produção → Financeiro → Projetos → Prospecção → Empresas

**Fase 3 — Deprecar writes diretos**

Manter tabelas legadas como read-only projections por compatibilidade de UI existente.

**Fase 4 — Feed global**

`/os/atividade` lê de `domain_events`, não de 3 tabelas.

---

## Schema proposto — Sprint A

```sql
-- domain_events: hub único
create table domain_events (
  id uuid primary key default gen_random_uuid(),
  event_key text not null,           -- 'content.status_changed'
  entity_type text not null,         -- 'content_task' | 'project' | ...
  entity_id uuid not null,
  company_id uuid references companies(id) on delete set null,
  prospect_id uuid references prospects(id) on delete set null,
  actor_id text,                     -- TeamMember | null (sistema)
  payload jsonb not null default '{}',
  -- projections geradas
  activity_title text not null,
  activity_body text,
  occurred_at timestamptz not null default now()
);

-- notifications: inbox acionável
create table notifications (
  id uuid primary key default gen_random_uuid(),
  domain_event_id uuid references domain_events(id) on delete cascade,
  assignee_id text not null,         -- TeamMember
  title text not null,
  body text,
  action_url text not null,
  urgency text not null default 'default'
    check (urgency in ('critical', 'warning', 'default')),
  read_at timestamptz,
  dismissed_at timestamptz,
  created_at timestamptz not null default now()
);

-- tasks: estender schema existente
alter table tasks add column if not exists source_event_id uuid references domain_events(id);
alter table tasks add column if not exists source_type text;
alter table tasks add column if not exists urgency text default 'default';
```

---

## IA — regra arquitetural

```text
DATABASE → DOMAIN LOGIC → METRICS → AI → EXPLANATION
```

A IA **interpreta** dados existentes. Nunca inventa métricas.  
Botões contextuais ("Analisar prospect", "O que merece atenção?") — nunca menu "IA".

---

## Cross-module — regra transversal (desde Sprint A)

> Toda feature nova cria/consome relações com entidades existentes.

| Ação | Relações obrigatórias |
|------|----------------------|
| Criar conteúdo | → Company, → User (owner), → Event |
| Mover conteúdo | → Event → Company timeline → Notification se aplicável |
| Bloquear projeto | → Event → Work Queue → Task |
| Lead responde | → Event → Notification → Task comercial |
| Pagamento recebido | → Event → Company timeline → Dashboard KPI |

---

## Writers atuais — inventário (baseline Sprint 0)

| Service | Arquivo | Escreve em |
|---------|---------|------------|
| Companies | `companies/service.server.ts` | `company_activities` |
| Projects | `projects/service.server.ts` | `company_activities` |
| Finance | `finance/service.server.ts` | `company_activities` |
| Content | `content-production/service.server.ts` | `content_task_events` + `company_activities` |
| Prospection | `prospection/service.server.ts` | `prospect_interactions` + `company_activities` (convert) |

| Consumer | Arquivo | Lê de |
|----------|---------|-------|
| Dashboard bell | `os/dashboard-notifications.ts` | Recomputa de dashboard data |
| Company timeline | `companies/CompanyTimeline.tsx` | `company_activities` |
| Content timeline | `content-production/ContentTaskTimeline.tsx` | `content_task_events` |
| Prospect timeline | `prospection/ProspectTimeline.tsx` | `prospect_interactions` |

---

## Validação Sprint 0

- [ ] Equipe revisou mapa de entidades
- [ ] Catálogo de eventos aprovado (ajustes permitidos)
- [ ] Regras de responsável confirmadas
- [ ] Estratégia de migração aceita
- [ ] Schema Sprint A aprovado

**Próximo:** Sprint A — implementar `domain_events`, `notifications`, `emitDomainEvent()`, primeiro writer (Produção).
