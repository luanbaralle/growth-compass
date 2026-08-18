-- Propostas comerciais — páginas publicáveis (UNIP / Nobre)

create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  template text not null default 'acceleration'
    check (template in ('acceleration', 'custom_solution')),
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  company_id uuid references public.companies (id) on delete set null,
  prospect_id uuid references public.prospects (id) on delete set null,
  copilot_session_id uuid references public.copilot_sessions (id) on delete set null,
  client_name text,
  company_name text not null,
  creative_brief jsonb,
  content jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists proposals_slug_idx on public.proposals (slug);
create index if not exists proposals_status_idx on public.proposals (status, updated_at desc);
create index if not exists proposals_company_idx on public.proposals (company_id);
create index if not exists proposals_copilot_session_idx on public.proposals (copilot_session_id);

alter table public.proposals enable row level security;

create policy "no public access proposals"
  on public.proposals for all using (false);

drop trigger if exists proposals_updated_at on public.proposals;
create trigger proposals_updated_at
  before update on public.proposals
  for each row execute function public.set_updated_at();
