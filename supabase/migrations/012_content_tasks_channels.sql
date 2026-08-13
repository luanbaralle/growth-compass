-- Migra canal único para seleção múltipla (channels[])

alter table public.content_tasks
  add column if not exists channels text[];

update public.content_tasks
set channels = array[channel]
where channels is null and channel is not null;

update public.content_tasks
set channels = array['instagram']::text[]
where channels is null or array_length(channels, 1) is null;

alter table public.content_tasks drop column if exists channel;

alter table public.content_tasks
  alter column channels set not null,
  alter column channels set default array['instagram']::text[];

alter table public.content_tasks drop constraint if exists content_tasks_channels_check;

alter table public.content_tasks
  add constraint content_tasks_channels_check
  check (
    array_length(channels, 1) >= 1
    and channels <@ array['instagram', 'facebook', 'youtube', 'tiktok']::text[]
  );
