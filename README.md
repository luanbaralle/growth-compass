# Raise One — Aquisição + Raise One OS v2

Site de captação segmentada + **Raise One OS** — sistema operacional interno da agência.

**Stack:** TanStack Start · React 19 · Vite · Nitro (Vercel) · Tailwind CSS 4 · Supabase

---

## Módulos

| Módulo | Rotas | Função |
|--------|-------|--------|
| **Site / LP** | `/`, `/:segment`, `/blog`, etc. | Captação, diagnóstico, conteúdo |
| **Raise One OS** | `/os/*` | Dashboard, Empresas, Projetos, Marketing, Financeiro, Config |

---

## Começando

```bash
npm install
cp .env.example .env
npm run dev
```

**Login OS:** `/os/login`  
**Home após login:** `/os`

---

## Variáveis obrigatórias (OS)

| Variável | Uso |
|----------|-----|
| `SUPABASE_URL` | URL do projeto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave service role (server-side) |
| `ADMIN_PASSWORD` | Senha do painel `/os/login` |
| `SESSION_SECRET` | Assinatura dos cookies (mín. 32 caracteres) |
| `VITE_WHATSAPP_NUMBER` | Links WhatsApp nos formulários |

---

## Supabase — Setup

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute no SQL Editor, em ordem:
   - `supabase/migrations/001_os_schema.sql`
   - `supabase/migrations/002_drop_execution_state.sql` (se existir tabela legada)
   - `supabase/migrations/003_finance_receipts.sql` (comprovantes nos lançamentos)
   - `supabase/migrations/014_content_task_events_company.sql`
   - `supabase/migrations/015_domain_events.sql` (eventos + notificações — Sprint A)
3. Configure `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` no `.env`

### Migrar dados legados (opcional)

Se você tinha `data/leads.json` ou `data/execution.json`:

```bash
npx tsx scripts/migrate-legacy-data.ts
```

---

## Raise One OS — Navegação

```
/os                     Dashboard
/os/empresas            Lista de empresas (leads + clientes unificados)
/os/empresas/:id        Detalhe com abas (dados, timeline, arquivos, links, serviços, projetos)
/os/projetos            Lista de projetos (filtros, CRUD)
/os/projetos/:id        Detalhe (checklist, comentários, status)
/os/financeiro          Lançamentos (mensalidade, setup, cobranças)
/os/marketing           Métricas por canal (Google Ads, Meta, SEO...)
/os/configuracoes       Preferências, equipe, status do sistema
```

### Empresas — Estágios

`lead` → `contato` → `proposta` → `negociacao` → `ativo` → `pausado` → `encerrado`

Formulários públicos criam empresas automaticamente no estágio **lead**.

### Projetos

Tipos: site, landing, tráfego, conteúdo, design, consultoria, outro.  
Status: pendente → ativo → revisão → concluído (ou bloqueado/cancelado).  
Criar projeto na lista global ou na aba **Projetos** de uma empresa. Mudanças de status geram atividade na timeline da empresa.

### Financeiro

Tipos: mensalidade, setup, outro. Status: pendente, pago, atrasado, cancelado.  
Marcar como pago registra atividade na timeline da empresa. Aba **Financeiro** no detalhe da empresa.

### Marketing

Canais: Google Ads, Meta Ads, Landing Page, SEO, Google Meu Negócio.  
Registro manual de investimento, leads, conversões, CTR, CPC e CPA por período. Aba **Marketing** no detalhe da empresa.

### Dashboard

Visão consolidada: pipeline, leads recentes, projetos/cobranças atrasados, financeiro, marketing e atalhos.

### Configurações

Preferências da agência (nome, WhatsApp interno, notas), status da equipe/PINs, checklist do .env e integrações.

---

## Estrutura do código

```
src/
├── domains/companies/     # Empresas (types, schema, repo, service, api, UI)
├── domains/projects/      # Projetos (types, schema, repo, service, api, UI)
├── domains/finance/       # Financeiro (types, schema, repo, service, api, UI)
├── domains/marketing/     # Marketing (types, schema, repo, service, api, UI)
├── domains/settings/      # Configurações (types, repo, service, api, UI)
├── os/                    # Shell, dashboard, UI kit
├── lib/
│   ├── supabase/          # Client REST Supabase
│   └── auth/              # Sessão e tipos do time
└── routes/
    ├── os/                # Rotas do OS
    └── (site público)
```

---

## Scripts

```bash
npm run dev          # Desenvolvimento
npm run build        # Build produção
npm run lint         # ESLint
npx tsx scripts/migrate-legacy-data.ts   # Migração legado → Supabase
```

---

## Redirects legados

Rotas `/admin/*` redirecionam para `/os/*` equivalente.
