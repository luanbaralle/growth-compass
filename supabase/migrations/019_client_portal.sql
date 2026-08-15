-- Raise One Client — Sprint C0
-- Auth: company_users + magic links (session via app cookie)

create table if not exists public.company_users (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  email text not null,
  name text not null,
  phone text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint company_users_email_lower check (email = lower(email))
);

create unique index if not exists company_users_email_idx on public.company_users (email);
create index if not exists company_users_company_idx on public.company_users (company_id);

create table if not exists public.client_magic_links (
  id uuid primary key default gen_random_uuid(),
  company_user_id uuid not null references public.company_users (id) on delete cascade,
  token_hash text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists client_magic_links_active_idx
  on public.client_magic_links (token_hash)
  where used_at is null;

alter table public.company_users enable row level security;
alter table public.client_magic_links enable row level security;
