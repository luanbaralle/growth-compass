-- Raise One Copilot — mensagens do narrador LLM (Sprint 4)

alter table public.copilot_sessions
  add column if not exists narrator_messages jsonb not null default '[]'::jsonb;
