-- Logo da empresa (armazenado no bucket company-files)
alter table companies
  add column if not exists logo_storage_path text;
