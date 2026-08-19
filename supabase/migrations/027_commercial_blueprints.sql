-- Commercial Blueprint — structured data layer between Copilot and Proposal

create table if not exists public.commercial_blueprints (
  id uuid primary key default gen_random_uuid(),
  copilot_session_id uuid not null references public.copilot_sessions (id) on delete cascade,
  proposal_id uuid references public.proposals (id) on delete set null,
  company_name text not null,
  client_name text,
  archetype text not null default 'acceleration'
    check (archetype in ('acceleration', 'acquisition', 'positioning', 'structure', 'custom_solution')),
  status text not null default 'draft'
    check (status in ('draft', 'in_review', 'approved')),
  version text not null default '0.1',
  parent_version_id uuid references public.commercial_blueprints (id) on delete set null,
  author text not null default 'copilot'
    check (author in ('copilot', 'human')),
  blueprint jsonb not null default '{}'::jsonb,
  readiness jsonb not null default '{}'::jsonb,
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  approved_at timestamptz
);

create index if not exists commercial_blueprints_session_idx
  on public.commercial_blueprints (copilot_session_id, created_at desc);

create index if not exists commercial_blueprints_status_idx
  on public.commercial_blueprints (status, updated_at desc);

create index if not exists commercial_blueprints_proposal_idx
  on public.commercial_blueprints (proposal_id);

alter table public.proposals
  add column if not exists commercial_blueprint_id uuid
  references public.commercial_blueprints (id) on delete set null;

create index if not exists proposals_commercial_blueprint_idx
  on public.proposals (commercial_blueprint_id);

alter table public.commercial_blueprints enable row level security;

create policy "no public access commercial_blueprints"
  on public.commercial_blueprints for all using (false);

drop trigger if exists commercial_blueprints_updated_at on public.commercial_blueprints;
create trigger commercial_blueprints_updated_at
  before update on public.commercial_blueprints
  for each row execute function public.set_updated_at();
