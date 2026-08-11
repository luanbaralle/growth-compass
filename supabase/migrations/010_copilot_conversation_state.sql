-- Copilot V1 — memória de descobertas e objetivo atual (Salões)

alter table public.prospect_assistant_state
  add column if not exists current_objective_key text,
  add column if not exists discoveries jsonb not null default '{}';

alter table public.prospect_assistant_state
  drop constraint if exists prospect_assistant_state_step_check;

alter table public.prospect_assistant_state
  add constraint prospect_assistant_state_step_check
  check (step in (
    'observations', 'openings', 'opening', 'awaiting_reply',
    'no_reply', 'response_state', 'continuation', 'conversation',
    'raise_one', 'done'
  ));
