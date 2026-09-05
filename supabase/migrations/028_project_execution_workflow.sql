-- Project Execution Workflow — templates, fases, tarefas, briefing, finance link

-- ── Expand project status (lifecycle operacional) ────────────

alter table public.projects drop constraint if exists projects_status_check;

alter table public.projects
  add constraint projects_status_check
  check (
    status in (
      'pending',
      'approved',
      'formalization',
      'onboarding',
      'in_progress',
      'waiting_client',
      'review',
      'paused',
      'done',
      'blocked',
      'cancelled'
    )
  );

alter table public.projects
  add column if not exists start_date date;

alter table public.projects
  add column if not exists setup_amount_cents bigint;

alter table public.projects
  add column if not exists recurring_amount_cents bigint;

alter table public.projects
  add column if not exists media_budget_notes text;

alter table public.projects
  add column if not exists strategy_notes text;

alter table public.projects
  add column if not exists context_json jsonb not null default '{}';

-- ── Finance → project link ───────────────────────────────────

alter table public.finance_entries
  add column if not exists project_id uuid references public.projects (id) on delete set null;

create index if not exists finance_entries_project_idx
  on public.finance_entries (project_id)
  where project_id is not null;

-- ── Workflow templates ───────────────────────────────────────

create table if not exists public.workflow_templates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workflow_template_phases (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.workflow_templates (id) on delete cascade,
  key text not null,
  name text not null,
  objective text,
  sort_order int not null default 0,
  is_recurring boolean not null default false,
  completion_criteria text,
  project_status_on_enter text,
  unique (template_id, key)
);

create index if not exists workflow_template_phases_template_idx
  on public.workflow_template_phases (template_id, sort_order);

create table if not exists public.workflow_template_tasks (
  id uuid primary key default gen_random_uuid(),
  phase_id uuid not null references public.workflow_template_phases (id) on delete cascade,
  key text not null,
  title text not null,
  description text,
  sort_order int not null default 0,
  default_priority text not null default 'medium'
    check (default_priority in ('low', 'medium', 'high', 'urgent')),
  default_assignee_id text,
  is_recurring boolean not null default false,
  blocks_phase_completion boolean not null default true,
  waiting_client_default boolean not null default false,
  checklist_json jsonb not null default '[]',
  depends_on_task_keys text[] not null default '{}',
  unique (phase_id, key)
);

create index if not exists workflow_template_tasks_phase_idx
  on public.workflow_template_tasks (phase_id, sort_order);

create table if not exists public.workflow_template_deliverables (
  id uuid primary key default gen_random_uuid(),
  phase_id uuid not null references public.workflow_template_phases (id) on delete cascade,
  title text not null,
  sort_order int not null default 0
);

-- ── Project workflow instances ───────────────────────────────

create table if not exists public.project_workflows (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null unique references public.projects (id) on delete cascade,
  template_id uuid not null references public.workflow_templates (id),
  status text not null default 'active'
    check (status in ('active', 'paused', 'completed', 'cancelled')),
  current_phase_key text,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_workflow_phases (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.project_workflows (id) on delete cascade,
  key text not null,
  name text not null,
  objective text,
  sort_order int not null default 0,
  status text not null default 'pending'
    check (status in ('pending', 'active', 'done', 'skipped')),
  is_recurring boolean not null default false,
  completion_criteria text,
  project_status_on_enter text,
  owner_id text,
  started_at timestamptz,
  completed_at timestamptz,
  unique (workflow_id, key)
);

create index if not exists project_workflow_phases_workflow_idx
  on public.project_workflow_phases (workflow_id, sort_order);

create table if not exists public.project_workflow_tasks (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.project_workflows (id) on delete cascade,
  phase_id uuid not null references public.project_workflow_phases (id) on delete cascade,
  key text not null,
  title text not null,
  description text,
  sort_order int not null default 0,
  status text not null default 'todo'
    check (status in ('todo', 'in_progress', 'blocked', 'waiting_client', 'done')),
  priority text not null default 'medium'
    check (priority in ('low', 'medium', 'high', 'urgent')),
  assignee_id text,
  due_date date,
  checklist_json jsonb not null default '[]',
  is_recurring boolean not null default false,
  blocks_phase_completion boolean not null default true,
  dependency_override boolean not null default false,
  waiting_client_name text,
  waiting_client_since date,
  waiting_client_due date,
  notes text,
  origin text not null default 'template'
    check (origin in ('template', 'manual', 'automation')),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workflow_id, key)
);

create index if not exists project_workflow_tasks_phase_idx
  on public.project_workflow_tasks (phase_id, sort_order);

create index if not exists project_workflow_tasks_status_idx
  on public.project_workflow_tasks (status);

create index if not exists project_workflow_tasks_assignee_idx
  on public.project_workflow_tasks (assignee_id)
  where assignee_id is not null;

create table if not exists public.project_workflow_task_dependencies (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.project_workflow_tasks (id) on delete cascade,
  depends_on_task_id uuid not null references public.project_workflow_tasks (id) on delete cascade,
  unique (task_id, depends_on_task_id),
  check (task_id <> depends_on_task_id)
);

create index if not exists project_workflow_task_deps_task_idx
  on public.project_workflow_task_dependencies (task_id);

create table if not exists public.project_deliverables (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  phase_id uuid references public.project_workflow_phases (id) on delete set null,
  title text not null,
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'done')),
  sort_order int not null default 0,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists project_deliverables_project_idx
  on public.project_deliverables (project_id, sort_order);

create table if not exists public.project_briefings (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null unique references public.projects (id) on delete cascade,
  objective text,
  offer text,
  audience text,
  location text,
  differentials text,
  services text,
  hours text,
  pricing text,
  availability text,
  commercial_process text,
  current_channels text,
  competitors text,
  notes text,
  status text not null default 'draft'
    check (status in ('draft', 'sent', 'received', 'approved')),
  sent_at timestamptz,
  received_at timestamptz,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── RLS (deny-all; service role bypasses) ────────────────────

alter table public.workflow_templates enable row level security;
alter table public.workflow_template_phases enable row level security;
alter table public.workflow_template_tasks enable row level security;
alter table public.workflow_template_deliverables enable row level security;
alter table public.project_workflows enable row level security;
alter table public.project_workflow_phases enable row level security;
alter table public.project_workflow_tasks enable row level security;
alter table public.project_workflow_task_dependencies enable row level security;
alter table public.project_deliverables enable row level security;
alter table public.project_briefings enable row level security;

create policy "no public access workflow_templates" on public.workflow_templates for all using (false);
create policy "no public access workflow_template_phases" on public.workflow_template_phases for all using (false);
create policy "no public access workflow_template_tasks" on public.workflow_template_tasks for all using (false);
create policy "no public access workflow_template_deliverables" on public.workflow_template_deliverables for all using (false);
create policy "no public access project_workflows" on public.project_workflows for all using (false);
create policy "no public access project_workflow_phases" on public.project_workflow_phases for all using (false);
create policy "no public access project_workflow_tasks" on public.project_workflow_tasks for all using (false);
create policy "no public access project_workflow_task_dependencies" on public.project_workflow_task_dependencies for all using (false);
create policy "no public access project_deliverables" on public.project_deliverables for all using (false);
create policy "no public access project_briefings" on public.project_briefings for all using (false);
