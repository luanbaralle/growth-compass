-- Raise One OS — Domain Events + Notifications (Sprint A)

-- ── Domain events (hub único) ─────────────────────────────────

create table if not exists public.domain_events (
  id uuid primary key default gen_random_uuid(),
  idempotency_key text not null unique,
  event_key text not null,
  entity_type text not null,
  entity_id uuid not null,
  company_id uuid references public.companies (id) on delete set null,
  prospect_id uuid references public.prospects (id) on delete set null,
  actor_id text,
  payload jsonb not null default '{}'::jsonb,
  activity_title text not null,
  activity_body text,
  occurred_at timestamptz not null default now()
);

create index if not exists domain_events_entity_idx
  on public.domain_events (entity_type, entity_id, occurred_at desc);

create index if not exists domain_events_company_idx
  on public.domain_events (company_id, occurred_at desc)
  where company_id is not null;

create index if not exists domain_events_occurred_idx
  on public.domain_events (occurred_at desc);

-- ── Notifications (inbox acionável) ───────────────────────────

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  domain_event_id uuid not null references public.domain_events (id) on delete cascade,
  assignee_id text not null,
  title text not null,
  body text,
  action_url text not null,
  urgency text not null default 'default'
    check (urgency in ('critical', 'warning', 'default')),
  read_at timestamptz,
  dismissed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (domain_event_id, assignee_id)
);

create index if not exists notifications_assignee_idx
  on public.notifications (assignee_id, created_at desc)
  where dismissed_at is null;

create index if not exists notifications_unread_idx
  on public.notifications (assignee_id, read_at)
  where read_at is null and dismissed_at is null;

-- ── Tasks — extensão para automação ───────────────────────────

alter table public.tasks
  add column if not exists source_event_id uuid references public.domain_events (id) on delete set null;

alter table public.tasks
  add column if not exists source_type text;

alter table public.tasks
  add column if not exists urgency text not null default 'default';

create unique index if not exists tasks_source_event_title_idx
  on public.tasks (source_event_id, title)
  where source_event_id is not null;

-- ── RLS — service role only ───────────────────────────────────

alter table public.domain_events enable row level security;
alter table public.notifications enable row level security;

create policy "no public access domain_events"
  on public.domain_events for all using (false);

create policy "no public access notifications"
  on public.notifications for all using (false);
