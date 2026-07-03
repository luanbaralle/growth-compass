-- Raise One — Central de Execução (Fase 3)
-- Execute no SQL Editor do Supabase

create table if not exists public.r1_execution_state (
  id text primary key default 'main',
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.r1_execution_state enable row level security;

-- Acesso apenas via service role (server-side). Anon/authenticated bloqueados.
create policy "no public access"
  on public.r1_execution_state
  for all
  using (false);
