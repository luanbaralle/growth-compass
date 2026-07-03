# Raise One — Aquisição

Landing pages segmentadas para captação de leads + **Central de Execução** no painel admin. O admin não é só documentação: é o sistema operacional interno da R1 para transformar operação manual em capacidade escalável.

**Stack:** TanStack Start · React 19 · Vite · Nitro (Vercel) · Tailwind CSS 4 · shadcn/ui

---

## O que este repositório faz

| Módulo | Rotas | Função |
|--------|-------|--------|
| **Hub / LP** | `/`, `/:segment` | Diagnóstico guiado, landing por segmento, formulário de lead |
| **Admin — Execução** | `/admin/execucao/*` | Central de Execução (planejamento, produção, capacidade, rituais) |
| **Admin — Leads** | `/admin/leads` | CRM simples de leads recebidos |

---

## Começando

### Pré-requisitos

- Node.js 22+
- npm (ou bun)

### Instalação

```bash
npm install
cp .env.example .env
# Edite .env — ADMIN_PASSWORD e SESSION_SECRET são obrigatórios para o admin
npm run dev
```

App em `http://localhost:3000` (porta pode variar conforme o Vite).

### Variáveis essenciais

| Variável | Uso |
|----------|-----|
| `ADMIN_PASSWORD` | Senha do painel `/admin/login` |
| `ADMIN_PIN_LUAN` / `VINI` / `CAIO` | PIN opcional por pessoa no login/troca de perfil |
| `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` | Persistência da Central em produção (opcional) |
| `SESSION_SECRET` | Assinatura dos cookies de sessão (mín. 32 caracteres) |
| `VITE_WHATSAPP_NUMBER` | Número usado nos links `wa.me` dos leads |

Demais variáveis (Serper, Google CSE, rate limit SERP) estão documentadas em `.env.example`.

---

## Painel Admin

**Login:** `/admin/login`  
**Home após login:** `/admin/execucao/hoje`

### Central de Execução

North Star da plataforma: **horas recuperadas + slots de cliente desbloqueados**. Tudo existe para provar, toda semana, que a R1 está saindo da operação manual.

#### Executar

| Seção | Rota | Descrição |
|-------|------|-----------|
| **Hoje** | `/admin/execucao/hoje` | Cockpit diário: gargalo, horas recuperadas, 3 prioridades, minhas tarefas |
| **Planejamento** | `/admin/execucao/planejamento` | Plano 30 dias (4 semanas) + backlog (máx. 3 em "Agora") |
| **Produção** | `/admin/execucao/producao` | Kanban: Briefing → Editando → Revisão → Aprovado → Agendado → Publicado |
| **Clientes** | `/admin/execucao/clientes` | Referência + matriz de dependência (hoje vs meta) + capacidade do time |
| **Capacidade** | `/admin/execucao/capacidade` | Gargalo ativo, Delegação Tracker, horas recuperadas, mapa de gargalos |
| **Rituais** | `/admin/execucao/rituais` | Hub dos rituais semanais |

#### Referência

| Seção | Rota | Descrição |
|-------|------|-----------|
| **Referência** | `/admin/execucao/referencia` | Diagnóstico, RACI, scripts de escopo, SOPs como checklist executável |

#### Comercial

| Seção | Rota | Descrição |
|-------|------|-----------|
| **Leads** | `/admin/leads` | Leads captados com status, WhatsApp e filtros |

### Rituais (cadência do time)

| Ritual | Rota | Quando | Duração |
|--------|------|--------|---------|
| Planning | `/admin/execucao/rituais/planning` | Segunda | 30 min |
| Check-in | `/admin/execucao/rituais/checkin` | Quarta | 15 min |
| Review | `/admin/execucao/rituais/review` | Sexta | 30 min |

Cada ritual gera output formatado para copiar no grupo WhatsApp.

### Divisão Sistema vs Notion

| Sistema (este admin) | Notion (conhecimento) |
|----------------------|------------------------|
| Estado mutável: fila, delegação, rituais, checklists | Contratos, playbooks finais, treinamentos |
| Accountability e métricas de capacidade | Arquivo e referência de longo prazo |

---

## Persistência de dados

Dados locais em `data/` (gitignored):

| Arquivo | Conteúdo |
|---------|----------|
| `data/leads.json` | Leads do formulário |
| `data/execution.json` | Estado completo da Central de Execução |

Em deploy serverless (Vercel), os arquivos vão para `/tmp` — adequado para MVP; **Fase 3** prevê Supabase para persistência multi-device.

**Seed:** na primeira abertura, `execution.json` é criado a partir da [Central de Execução](../Calls/15-06/central-execucao/) (reunião 15/06). Instalações v1 migram automaticamente para v2 (produção, clientes, SOPs, capacidade).

---

## Estrutura do código

```
src/
├── routes/                    # Rotas file-based (TanStack Router)
│   ├── index.tsx              # Hub de aquisição
│   ├── $segment.tsx           # Landing por segmento
│   └── admin/
│       ├── route.tsx          # Layout + auth
│       ├── login.tsx
│       ├── leads.tsx
│       └── execucao/          # Central de Execução
├── components/
│   ├── landing/               # LP e seções
│   ├── hub/                   # Diagnóstico guiado
│   └── admin/
│       ├── AdminShell.tsx     # Sidebar do admin
│       └── execution/         # Páginas da Central
├── lib/
│   ├── execution/             # Types, seed, store, helpers
│   ├── api/                   # Server functions
│   └── leads/                 # Store de leads
└── config/segments/           # Personalização por vertical
```

Documentação de convenções de rotas: [`src/routes/README.md`](src/routes/README.md).

---

## Scripts

```bash
npm run dev       # Desenvolvimento
npm run build     # Build produção (Vercel/Nitro)
npm run preview   # Preview do build
npm run lint      # ESLint
npm run format    # Prettier
```

---

## Roadmap da Central de Execução

### ✅ Fase 1 — MVP executável

- Shell admin com sidebar
- Hoje, Planejamento, Capacidade, Backlog
- Ritual Planning
- Persistência JSON + seed da documentação 15/06

### ✅ Fase 2 — Operação

- Kanban de Produção
- Clientes + matriz de dependência + capacidade do time
- Rituais Check-in e Review
- Referência com SOPs executáveis

### ✅ Fase 3 — Escala

- Auth por pessoa (Luan / Vini / Caio) + PIN opcional
- Histórico de horas recuperadas (gráfico + snapshot no Review)
- Export de SOPs validados → markdown para Notion
- Supabase opcional para persistência em produção (`supabase/schema.sql`)

---

## Origem da Central de Execução

Conteúdo estratégico derivado da call de **15/06/2026** (Luan, Vini, Caio), documentado em `Calls/15-06/central-execucao/` (repositório irmão no monorepo local):

- `README.md` — hub e prioridade #1
- `01-diagnostico.md` … `07-rituais.md` — diagnóstico, RACI, escopo, plano 30d, backlog, SOPs, rituais

O admin implementa a camada **executável** desses documentos. Notion permanece como base de conhecimento permanente.

---

## Deploy

Build gera output em `.vercel/output/` (preset Nitro + Vercel). Configure no painel da Vercel:

- `ADMIN_PASSWORD`
- `SESSION_SECRET`
- `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (recomendado em produção)
- Demais vars de `.env.example` conforme necessário

**Persistência:** com Supabase configurado, o estado da Central vive em `r1_execution_state`. Sem Supabase, `data/execution.json` local (efêmero em serverless).
