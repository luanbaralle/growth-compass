-- Raise One OS — Módulo Prospecção

-- ── Prospects ─────────────────────────────────────────────────

create table if not exists public.prospects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  city text,
  state text,
  phone text,
  whatsapp text,
  instagram text,
  website text,
  google_maps_url text,
  owner_id text,
  source text,
  notes text,
  status text not null default 'novo'
    check (status in (
      'novo', 'primeiro_contato', 'respondeu', 'diagnostico_enviado',
      'interessado', 'proposta_enviada', 'negociacao', 'cliente', 'perdido'
    )),
  tags text[] not null default '{}',
  next_action text,
  next_action_date date,
  company_id uuid references public.companies (id) on delete set null,
  converted_at timestamptz,
  last_interaction_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists prospects_status_idx on public.prospects (status);
create index if not exists prospects_owner_idx on public.prospects (owner_id);
create index if not exists prospects_city_idx on public.prospects (city);
create index if not exists prospects_company_idx on public.prospects (company_id);
create index if not exists prospects_last_interaction_idx on public.prospects (last_interaction_at desc nulls last);

-- ── Interações / timeline / conversas ─────────────────────────

create table if not exists public.prospect_interactions (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references public.prospects (id) on delete cascade,
  type text not null
    check (type in (
      'registered', 'message_sent', 'message_received', 'follow_up',
      'proposal_sent', 'diagnosis_sent', 'converted', 'note', 'status_change'
    )),
  title text not null,
  body text,
  direction text check (direction in ('out', 'in', 'internal')),
  occurred_at timestamptz not null default now(),
  author_id text,
  created_at timestamptz not null default now()
);

create index if not exists prospect_interactions_prospect_idx
  on public.prospect_interactions (prospect_id, occurred_at desc);

-- ── Diagnóstico checklist ─────────────────────────────────────

create table if not exists public.prospect_checklist (
  prospect_id uuid not null references public.prospects (id) on delete cascade,
  item_key text not null,
  status text not null default 'no' check (status in ('yes', 'no', 'partial')),
  notes text,
  updated_at timestamptz not null default now(),
  primary key (prospect_id, item_key)
);

-- ── Oportunidades ─────────────────────────────────────────────

create table if not exists public.prospect_opportunities (
  prospect_id uuid not null references public.prospects (id) on delete cascade,
  opportunity_key text not null,
  checked boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (prospect_id, opportunity_key)
);

create index if not exists prospect_opportunities_key_idx
  on public.prospect_opportunities (opportunity_key) where checked = true;

-- ── Biblioteca comercial ──────────────────────────────────────

create table if not exists public.commercial_segments (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.commercial_scripts (
  id uuid primary key default gen_random_uuid(),
  segment_id uuid not null references public.commercial_segments (id) on delete cascade,
  script_type text not null
    check (script_type in (
      'initial', 'continuation', 'express_diagnosis',
      'followup_1', 'followup_2', 'followup_3', 'cta',
      'segment_overview', 'free_diagnosis', 'products',
      'opportunity_signals', 'reference_cases', 'best_practices'
    )),
  content text not null default '',
  updated_at timestamptz not null default now(),
  unique (segment_id, script_type)
);

create table if not exists public.commercial_objections (
  id uuid primary key default gen_random_uuid(),
  segment_id uuid not null references public.commercial_segments (id) on delete cascade,
  objection text not null,
  response text not null default '',
  objective text not null default '',
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.commercial_qualifications (
  id uuid primary key default gen_random_uuid(),
  segment_id uuid not null references public.commercial_segments (id) on delete cascade,
  question text not null,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.commercial_cases (
  id uuid primary key default gen_random_uuid(),
  segment_id uuid not null references public.commercial_segments (id) on delete cascade,
  case_slug text not null default '',
  title text not null default '',
  updated_at timestamptz not null default now(),
  unique (segment_id)
);

-- ── RLS ───────────────────────────────────────────────────────

alter table public.prospects enable row level security;
alter table public.prospect_interactions enable row level security;
alter table public.prospect_checklist enable row level security;
alter table public.prospect_opportunities enable row level security;
alter table public.commercial_segments enable row level security;
alter table public.commercial_scripts enable row level security;
alter table public.commercial_objections enable row level security;
alter table public.commercial_qualifications enable row level security;
alter table public.commercial_cases enable row level security;

create policy "no public access prospects" on public.prospects for all using (false);
create policy "no public access prospect_interactions" on public.prospect_interactions for all using (false);
create policy "no public access prospect_checklist" on public.prospect_checklist for all using (false);
create policy "no public access prospect_opportunities" on public.prospect_opportunities for all using (false);
create policy "no public access commercial_segments" on public.commercial_segments for all using (false);
create policy "no public access commercial_scripts" on public.commercial_scripts for all using (false);
create policy "no public access commercial_objections" on public.commercial_objections for all using (false);
create policy "no public access commercial_qualifications" on public.commercial_qualifications for all using (false);
create policy "no public access commercial_cases" on public.commercial_cases for all using (false);

-- ── Triggers ──────────────────────────────────────────────────

drop trigger if exists prospects_updated_at on public.prospects;
create trigger prospects_updated_at
  before update on public.prospects
  for each row execute function public.set_updated_at();

-- ── Seed biblioteca comercial (editável depois) ─────────────────

insert into public.commercial_segments (slug, name, sort_order) values
  ('saloes', 'Salões', 1),
  ('advogados', 'Advogados', 2),
  ('clinicas', 'Clínicas', 3),
  ('imobiliarias', 'Imobiliárias', 4),
  ('escolas', 'Escolas', 5),
  ('contabilidade', 'Contabilidade', 6),
  ('restaurantes', 'Restaurantes', 7),
  ('academias', 'Academias', 8)
on conflict (slug) do nothing;

-- Scripts vazios por segmento (conteúdo via seed: npm run seed:commercial-library)
insert into public.commercial_scripts (segment_id, script_type, content)
select s.id, t.script_type, ''
from public.commercial_segments s
cross join (
  values
    ('segment_overview'), ('express_diagnosis'), ('opportunity_signals'),
    ('initial'), ('continuation'),
    ('followup_1'), ('followup_2'), ('followup_3'),
    ('free_diagnosis'), ('cta'),
    ('products'), ('reference_cases'), ('best_practices')
) as t(script_type)
on conflict (segment_id, script_type) do nothing;

insert into public.commercial_objections (segment_id, objection, response, objective, sort_order)
select s.id, 'Já tenho agência', '', 'Continuar conversa e diferenciar abordagem.', 0
from public.commercial_segments s
where not exists (
  select 1 from public.commercial_objections o where o.segment_id = s.id limit 1
);

insert into public.commercial_qualifications (segment_id, question, sort_order)
select s.id, 'Qual o principal desafio de captação hoje?', 0
from public.commercial_segments s
where not exists (
  select 1 from public.commercial_qualifications q where q.segment_id = s.id limit 1
);

insert into public.commercial_cases (segment_id, case_slug, title)
select s.id, '', ''
from public.commercial_segments s
on conflict (segment_id) do nothing;
