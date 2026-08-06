-- Raise One OS v2 — Schema completo
-- Execute no SQL Editor do Supabase (ou via CLI)

-- ── Empresas ────────────────────────────────────────────────

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  legal_name text,
  cnpj text,
  city text,
  city_state text,
  responsible_id text,
  whatsapp text,
  email text,
  website text,
  origin text,
  segment text,
  stage text not null default 'lead'
    check (stage in ('lead', 'contato', 'proposta', 'negociacao', 'ativo', 'pausado', 'encerrado')),
  notes text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  template_slug text,
  microvertical_id text,
  match_level text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists companies_stage_idx on public.companies (stage);
create index if not exists companies_name_idx on public.companies (name);
create index if not exists companies_created_at_idx on public.companies (created_at desc);

-- ── Timeline ────────────────────────────────────────────────

create table if not exists public.company_activities (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  type text not null
    check (type in ('note', 'stage_change', 'file_added', 'project_created', 'payment', 'meeting', 'system')),
  title text not null,
  body text,
  metadata jsonb not null default '{}',
  author_id text,
  created_at timestamptz not null default now()
);

create index if not exists company_activities_company_idx on public.company_activities (company_id, created_at desc);

-- ── Arquivos ────────────────────────────────────────────────

create table if not exists public.company_files (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  name text not null,
  storage_path text not null,
  category text not null default 'other'
    check (category in ('contract', 'receipt', 'invoice', 'other')),
  mime_type text,
  size_bytes bigint,
  uploaded_by text,
  created_at timestamptz not null default now()
);

create index if not exists company_files_company_idx on public.company_files (company_id);

-- ── Links rápidos ───────────────────────────────────────────

create table if not exists public.company_links (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  type text not null
    check (type in ('google_ads', 'meta_ads', 'landing_page', 'analytics', 'search_console', 'google_business', 'other')),
  label text not null,
  url text not null,
  created_at timestamptz not null default now()
);

create index if not exists company_links_company_idx on public.company_links (company_id);

-- ── Serviços contratados ────────────────────────────────────

create table if not exists public.company_services (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  name text not null,
  description text,
  status text not null default 'active'
    check (status in ('active', 'paused', 'completed')),
  created_at timestamptz not null default now()
);

create index if not exists company_services_company_idx on public.company_services (company_id);

-- ── Projetos (Etapa 2) ──────────────────────────────────────

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  type text not null,
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'review', 'done', 'blocked', 'cancelled')),
  owner_id text,
  priority text not null default 'medium'
    check (priority in ('low', 'medium', 'high', 'urgent')),
  due_date date,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_company_idx on public.projects (company_id);

create table if not exists public.project_checklist_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  text text not null,
  done boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.project_comments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  body text not null,
  author_id text,
  created_at timestamptz not null default now()
);

-- ── Financeiro (Etapa 3) ─────────────────────────────────────

create table if not exists public.finance_entries (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  type text not null check (type in ('monthly', 'setup', 'other')),
  description text not null,
  amount_cents bigint not null,
  due_date date not null,
  paid_at date,
  payment_method text,
  status text not null default 'pending'
    check (status in ('paid', 'pending', 'overdue', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists finance_entries_company_idx on public.finance_entries (company_id);
create index if not exists finance_entries_due_date_idx on public.finance_entries (due_date);
create index if not exists finance_entries_status_idx on public.finance_entries (status);

-- ── Marketing (Etapa 4) ───────────────────────────────────────

create table if not exists public.marketing_snapshots (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  channel text not null
    check (channel in ('google_ads', 'meta_ads', 'landing_page', 'seo', 'google_business')),
  period_start date not null,
  period_end date not null,
  investment_cents bigint,
  leads int,
  conversions int,
  ctr numeric(8, 4),
  cpc_cents bigint,
  cpa_cents bigint,
  metrics jsonb not null default '{}',
  sync_source text not null default 'manual' check (sync_source in ('manual', 'api')),
  created_at timestamptz not null default now()
);

create index if not exists marketing_snapshots_company_idx on public.marketing_snapshots (company_id);

-- ── Dashboard auxiliar ────────────────────────────────────────

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  due_date date,
  assignee_id text,
  company_id uuid references public.companies (id) on delete set null,
  project_id uuid references public.projects (id) on delete set null,
  done boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.meetings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  starts_at timestamptz not null,
  company_id uuid references public.companies (id) on delete set null,
  attendees text[],
  notes text,
  created_at timestamptz not null default now()
);

-- ── Configurações ─────────────────────────────────────────────

create table if not exists public.settings (
  key text primary key,
  value jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

-- ── RLS — service role only ───────────────────────────────────

alter table public.companies enable row level security;
alter table public.company_activities enable row level security;
alter table public.company_files enable row level security;
alter table public.company_links enable row level security;
alter table public.company_services enable row level security;
alter table public.projects enable row level security;
alter table public.project_checklist_items enable row level security;
alter table public.project_comments enable row level security;
alter table public.finance_entries enable row level security;
alter table public.marketing_snapshots enable row level security;
alter table public.tasks enable row level security;
alter table public.meetings enable row level security;
alter table public.settings enable row level security;

create policy "no public access companies" on public.companies for all using (false);
create policy "no public access activities" on public.company_activities for all using (false);
create policy "no public access files" on public.company_files for all using (false);
create policy "no public access links" on public.company_links for all using (false);
create policy "no public access services" on public.company_services for all using (false);
create policy "no public access projects" on public.projects for all using (false);
create policy "no public access checklist" on public.project_checklist_items for all using (false);
create policy "no public access comments" on public.project_comments for all using (false);
create policy "no public access finance" on public.finance_entries for all using (false);
create policy "no public access marketing" on public.marketing_snapshots for all using (false);
create policy "no public access tasks" on public.tasks for all using (false);
create policy "no public access meetings" on public.meetings for all using (false);
create policy "no public access settings" on public.settings for all using (false);

-- ── Storage bucket ────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('company-files', 'company-files', false)
on conflict (id) do nothing;

create policy "no public storage" on storage.objects for all using (false);

-- ── Updated_at trigger ────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists companies_updated_at on public.companies;
create trigger companies_updated_at
  before update on public.companies
  for each row execute function public.set_updated_at();

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

drop trigger if exists finance_updated_at on public.finance_entries;
create trigger finance_updated_at
  before update on public.finance_entries
  for each row execute function public.set_updated_at();
