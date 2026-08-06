-- Assistente de Prospecção — estado por prospect

alter table public.prospects
  add column if not exists segment_slug text;

create index if not exists prospects_segment_slug_idx on public.prospects (segment_slug);

create table if not exists public.prospect_assistant_state (
  prospect_id uuid primary key references public.prospects (id) on delete cascade,
  step text not null default 'observations'
    check (step in (
      'observations', 'openings', 'awaiting_reply',
      'no_reply', 'response_state', 'continuation', 'done'
    )),
  selected_observations text[] not null default '{}',
  selected_opening_id text,
  opening_text text,
  opening_used boolean not null default false,
  reply_status text check (reply_status in ('waiting', 'no_reply', 'replied')),
  response_state_key text,
  updated_at timestamptz not null default now()
);

alter table public.prospect_assistant_state enable row level security;
create policy "no public access prospect_assistant_state"
  on public.prospect_assistant_state for all using (false);

drop trigger if exists prospect_assistant_state_updated_at on public.prospect_assistant_state;
create trigger prospect_assistant_state_updated_at
  before update on public.prospect_assistant_state
  for each row execute function public.set_updated_at();
