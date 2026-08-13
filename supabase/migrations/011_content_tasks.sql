-- Produção de conteúdo — Kanban + Calendário editorial

create table if not exists public.content_tasks (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  status text not null default 'ideia'
    check (status in (
      'ideia', 'definicao', 'agendamento',
      'gravacao', 'edicao', 'aprovacao', 'correcao',
      'aprovado', 'programado', 'publicado'
    )),
  channels text[] not null default array['instagram']::text[]
    check (
      array_length(channels, 1) >= 1
      and channels <@ array['instagram', 'facebook', 'youtube', 'tiktok']::text[]
    ),
  theme_objective text,
  content_type text not null
    check (content_type in ('video_curto', 'video_medio', 'video_longo', 'imagem', 'carrossel')),
  post_date date,
  production_owner_id text,
  notes text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists content_tasks_status_idx on public.content_tasks (status);
create index if not exists content_tasks_post_date_idx on public.content_tasks (post_date);
create index if not exists content_tasks_company_idx on public.content_tasks (company_id);
create index if not exists content_tasks_production_owner_idx on public.content_tasks (production_owner_id);

create trigger content_tasks_set_updated_at
  before update on public.content_tasks
  for each row execute function public.set_updated_at();

-- RLS — service role only
alter table public.content_tasks enable row level security;
create policy "no public access content_tasks" on public.content_tasks for all using (false);
