-- Sprint 4: síntese pós-reunião — evidence graph, what we learned, knowledge depth

alter table public.copilot_meeting_artifacts
  add column if not exists what_we_learned jsonb not null default '[]'::jsonb,
  add column if not exists evidence_graph jsonb not null default '[]'::jsonb,
  add column if not exists knowledge_depth int not null default 0,
  add column if not exists meeting_synthesis jsonb;

alter table public.copilot_sessions
  add column if not exists knowledge_depth int not null default 0,
  add column if not exists evidence_graph jsonb not null default '[]'::jsonb;
