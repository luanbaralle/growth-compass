-- Histórico / timeline de tarefas de conteúdo

create table if not exists public.content_task_events (
  id uuid primary key default gen_random_uuid(),
  content_task_id uuid not null references public.content_tasks (id) on delete cascade,
  type text not null check (type in (
    'created',
    'status_changed',
    'title_changed',
    'channels_changed',
    'theme_changed',
    'content_type_changed',
    'post_date_changed',
    'production_owner_changed',
    'notes_changed',
    'note'
  )),
  title text not null,
  body text,
  metadata jsonb not null default '{}'::jsonb,
  author_id text,
  created_at timestamptz not null default now()
);

create index if not exists content_task_events_task_idx
  on public.content_task_events (content_task_id, created_at desc);

-- Backfill: evento de criação para tarefas existentes
insert into public.content_task_events (content_task_id, type, title, body, created_at)
select
  id,
  'created',
  'Tarefa criada',
  title,
  created_at
from public.content_tasks;

alter table public.content_task_events enable row level security;
create policy "no public access content_task_events"
  on public.content_task_events for all using (false);
