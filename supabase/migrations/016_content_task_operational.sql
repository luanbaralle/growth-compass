-- Sprint B — Produção como objeto operacional

-- ── Briefing, aprovação, publicação ───────────────────────────

alter table public.content_tasks
  add column if not exists briefing_hook text;

alter table public.content_tasks
  add column if not exists briefing_script text;

alter table public.content_tasks
  add column if not exists briefing_cta text;

alter table public.content_tasks
  add column if not exists briefing_references text;

alter table public.content_tasks
  add column if not exists client_approved_at timestamptz;

alter table public.content_tasks
  add column if not exists client_approved_by text;

alter table public.content_tasks
  add column if not exists publication jsonb not null default '{}'::jsonb;

-- ── Arquivos por tarefa ───────────────────────────────────────

create table if not exists public.content_task_files (
  id uuid primary key default gen_random_uuid(),
  content_task_id uuid not null references public.content_tasks (id) on delete cascade,
  file_type text not null
    check (file_type in ('raw_video', 'edit', 'thumbnail', 'script', 'other')),
  name text not null,
  storage_path text not null,
  mime_type text,
  size_bytes bigint,
  uploaded_by text,
  created_at timestamptz not null default now()
);

create index if not exists content_task_files_task_idx
  on public.content_task_files (content_task_id, created_at desc);

alter table public.content_task_files enable row level security;

create policy "no public access content_task_files"
  on public.content_task_files for all using (false);

-- ── Timeline: novos tipos de evento ─────────────────────────────

alter table public.content_task_events
  drop constraint if exists content_task_events_type_check;

alter table public.content_task_events
  add constraint content_task_events_type_check check (type in (
    'created',
    'status_changed',
    'title_changed',
    'channels_changed',
    'theme_changed',
    'content_type_changed',
    'post_date_changed',
    'production_owner_changed',
    'notes_changed',
    'company_changed',
    'briefing_changed',
    'approval_changed',
    'publication_changed',
    'file_added',
    'file_removed',
    'note'
  ));
