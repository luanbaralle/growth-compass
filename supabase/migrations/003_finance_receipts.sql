-- Vincula comprovantes/recibos aos lançamentos financeiros
alter table public.company_files
  add column if not exists finance_entry_id uuid references public.finance_entries (id) on delete set null;

create index if not exists company_files_finance_entry_idx on public.company_files (finance_entry_id);
