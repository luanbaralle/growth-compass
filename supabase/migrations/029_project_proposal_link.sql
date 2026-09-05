-- Projects -> Proposals (optional link)
-- Structural only: nullable FK + unique partial index. No backfill.

alter table public.projects
  add column if not exists proposal_id uuid
  references public.proposals (id) on delete set null;

create unique index if not exists projects_proposal_id_uidx
  on public.projects (proposal_id)
  where proposal_id is not null;
