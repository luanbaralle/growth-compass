-- Snapshot imutável do transcript no artifact ao encerrar a reunião

alter table public.copilot_meeting_artifacts
  add column if not exists transcript_segments jsonb not null default '[]'::jsonb;
