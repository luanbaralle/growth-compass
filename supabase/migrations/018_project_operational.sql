-- Sprint C — Projetos operacionais (bloqueio + próxima ação)

alter table public.projects
  add column if not exists blocked_by_type text
    check (
      blocked_by_type is null
      or blocked_by_type in ('client', 'access', 'approval', 'internal', 'other')
    );

alter table public.projects
  add column if not exists blocked_by_detail text;

alter table public.projects
  add column if not exists next_action text;

alter table public.projects
  add column if not exists next_action_due date;

create index if not exists projects_next_action_due_idx
  on public.projects (next_action_due asc nulls last)
  where status not in ('done', 'cancelled');

create index if not exists projects_blocked_idx
  on public.projects (status)
  where status = 'blocked';
