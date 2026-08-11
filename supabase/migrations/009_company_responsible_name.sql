-- Responsável da empresa = nome da pessoa de contato (não membro interno da equipe)
-- Idempotente: funciona se a coluna já foi renomeada ou ainda é responsible_id.

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'companies'
      and column_name = 'responsible_id'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'companies'
      and column_name = 'responsible_name'
  ) then
    alter table public.companies rename column responsible_id to responsible_name;
  elsif not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'companies'
      and column_name = 'responsible_name'
  ) then
    alter table public.companies add column responsible_name text;
  end if;
end $$;

update public.companies
set responsible_name = null
where responsible_name in ('luan', 'vini', 'caio');
