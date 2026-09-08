-- Vini feedback — produção (Drive), empresa (docs/acessos/operação), prospecção (presença)

-- ── Produção: link do material bruto + arquivos externos (Drive) ──

alter table public.content_tasks
  add column if not exists briefing_raw_material_url text;

alter table public.content_task_files
  add column if not exists external_url text;

alter table public.content_task_files
  alter column storage_path drop not null;

alter table public.content_task_files
  alter column storage_path set default '';

-- ── Prospecção: redes sociais adicionais ───────────────────────

alter table public.prospects
  add column if not exists facebook text;

alter table public.prospects
  add column if not exists tiktok text;

alter table public.prospects
  add column if not exists youtube text;

-- ── Empresa: categorias de arquivo ampliadas ───────────────────

alter table public.company_files
  drop constraint if exists company_files_category_check;

alter table public.company_files
  add constraint company_files_category_check check (
    category in (
      'contract',
      'receipt',
      'invoice',
      'proposal_doc',
      'analysis',
      'document',
      'other'
    )
  );

-- ── Empresa: tipos de link ampliados ───────────────────────────

alter table public.company_links
  drop constraint if exists company_links_type_check;

alter table public.company_links
  add constraint company_links_type_check check (
    type in (
      'google_ads',
      'meta_ads',
      'landing_page',
      'analytics',
      'search_console',
      'google_business',
      'website',
      'instagram',
      'facebook',
      'tiktok',
      'youtube',
      'proposal',
      'contract',
      'drive',
      'other'
    )
  );

-- ── Empresa: cofre de acessos / credenciais ────────────────────

create table if not exists public.company_credentials (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  platform text not null
    check (platform in (
      'google',
      'instagram',
      'facebook',
      'tiktok',
      'youtube',
      'crm',
      'ads',
      'hosting',
      'other'
    )),
  label text not null,
  username text,
  secret_encrypted text,
  url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists company_credentials_company_idx
  on public.company_credentials (company_id, created_at desc);

alter table public.company_credentials enable row level security;

create policy "no public access company_credentials"
  on public.company_credentials for all using (false);

-- ── Empresa: itens de operação (relatórios, auditorias, etc.) ──

create table if not exists public.company_operation_items (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  item_type text not null
    check (item_type in (
      'roadmap_note',
      'report',
      'analysis',
      'audit',
      'alignment_meeting',
      'scope_change',
      'other'
    )),
  title text not null,
  body text,
  url text,
  occurred_at date,
  author_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists company_operation_items_company_idx
  on public.company_operation_items (company_id, occurred_at desc nulls last, created_at desc);

alter table public.company_operation_items enable row level security;

create policy "no public access company_operation_items"
  on public.company_operation_items for all using (false);
