-- Raise One Copilot — Sessões de reunião, transcript e artifacts (Sprint 2)

-- ── Estende meetings ──────────────────────────────────────────

alter table public.meetings
  add column if not exists prospect_id uuid references public.prospects (id) on delete set null,
  add column if not exists mode text,
  add column if not exists objective text,
  add column if not exists status text default 'scheduled';

create index if not exists meetings_prospect_idx on public.meetings (prospect_id);

-- ── Sessões Copilot ───────────────────────────────────────────

create table if not exists public.copilot_sessions (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid references public.prospects (id) on delete set null,
  meeting_id uuid references public.meetings (id) on delete set null,
  mode text not null default 'discovery_qualification'
    check (mode in (
      'discovery_qualification', 'briefing', 'strategy', 'review', 'sales_proposal'
    )),
  status text not null default 'live'
    check (status in ('live', 'processing', 'completed', 'cancelled')),
  meeting_objective jsonb not null default '{}'::jsonb,
  diagnostic_state jsonb not null default '{}'::jsonb,
  business_profile jsonb not null default '{}'::jsonb,
  coverage jsonb not null default '[]'::jsonb,
  proposal_readiness jsonb not null default '{}'::jsonb,
  current_thread jsonb,
  latest_insight jsonb,
  orb_state text not null default 'listening',
  suppress_suggestion boolean not null default false,
  suppress_reason text,
  inconsistencies jsonb not null default '[]'::jsonb,
  elapsed_seconds int not null default 0,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists copilot_sessions_prospect_idx
  on public.copilot_sessions (prospect_id, started_at desc);

create index if not exists copilot_sessions_status_idx
  on public.copilot_sessions (status, started_at desc);

-- ── Transcript bruto (append-only) ────────────────────────────

create table if not exists public.copilot_transcript_segments (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.copilot_sessions (id) on delete cascade,
  speaker text not null check (speaker in ('prospect', 'consultant', 'unknown')),
  text text not null,
  segment_kind text,
  source text not null default 'manual_paste'
    check (source in ('manual_paste', 'live_stt', 'import')),
  started_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists copilot_transcript_session_idx
  on public.copilot_transcript_segments (session_id, started_at asc);

-- ── Artifact pós-reunião ──────────────────────────────────────

create table if not exists public.copilot_meeting_artifacts (
  session_id uuid primary key references public.copilot_sessions (id) on delete cascade,
  transcript_summary text,
  diagnosis jsonb not null default '{}'::jsonb,
  opportunities jsonb not null default '[]'::jsonb,
  unknowns jsonb not null default '[]'::jsonb,
  recommended_engagement jsonb,
  pain_points jsonb not null default '[]'::jsonb,
  goals jsonb not null default '[]'::jsonb,
  hypotheses jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- ── RLS ───────────────────────────────────────────────────────

alter table public.copilot_sessions enable row level security;
alter table public.copilot_transcript_segments enable row level security;
alter table public.copilot_meeting_artifacts enable row level security;

create policy "no public access copilot_sessions"
  on public.copilot_sessions for all using (false);

create policy "no public access copilot_transcript_segments"
  on public.copilot_transcript_segments for all using (false);

create policy "no public access copilot_meeting_artifacts"
  on public.copilot_meeting_artifacts for all using (false);

drop trigger if exists copilot_sessions_updated_at on public.copilot_sessions;
create trigger copilot_sessions_updated_at
  before update on public.copilot_sessions
  for each row execute function public.set_updated_at();
