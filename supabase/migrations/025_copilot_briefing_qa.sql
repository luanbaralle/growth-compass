-- Sprint 4+: Q&A pós-reunião sobre o briefing

alter table public.copilot_sessions
  add column if not exists briefing_qa_messages jsonb not null default '[]'::jsonb;
