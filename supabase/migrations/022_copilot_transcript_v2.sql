-- Raise One Copilot — Transcript v2 + meeting phase (Fase 2)

-- ── Transcript segments: recorder fields ──────────────────────

alter table public.copilot_transcript_segments
  add column if not exists sequence int,
  add column if not exists ended_at timestamptz,
  add column if not exists confidence real,
  add column if not exists speaker_confidence real,
  add column if not exists analyzed_at timestamptz;

-- speaker already allows prospect/consultant/unknown via check — extend if needed
alter table public.copilot_transcript_segments
  drop constraint if exists copilot_transcript_segments_speaker_check;

alter table public.copilot_transcript_segments
  add constraint copilot_transcript_segments_speaker_check
  check (speaker in ('prospect', 'consultant', 'unknown'));

create index if not exists copilot_transcript_session_seq_idx
  on public.copilot_transcript_segments (session_id, sequence asc);

-- Backfill sequence for existing rows
with numbered as (
  select id, row_number() over (
    partition by session_id order by started_at asc, created_at asc
  ) as seq
  from public.copilot_transcript_segments
  where sequence is null
)
update public.copilot_transcript_segments t
set sequence = numbered.seq
from numbered
where t.id = numbered.id;

-- ── Session: conversational state ─────────────────────────────

alter table public.copilot_sessions
  add column if not exists meeting_phase text not null default 'opening'
    check (meeting_phase in (
      'opening', 'context', 'discovery', 'deep_discovery',
      'qualification', 'synthesis', 'closing'
    )),
  add column if not exists copilot_action text not null default 'observe'
    check (copilot_action in (
      'observe', 'capture', 'explore', 'clarify', 'recommend'
    )),
  add column if not exists last_intelligence_at timestamptz;
