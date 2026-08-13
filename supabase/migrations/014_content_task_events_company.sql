-- Permite evento de troca de cliente na timeline

alter table public.content_task_events
  drop constraint if exists content_task_events_type_check;

alter table public.content_task_events
  add constraint content_task_events_type_check check (type in (
    'created',
    'status_changed',
    'title_changed',
    'channels_changed',
    'theme_changed',
    'content_type_changed',
    'post_date_changed',
    'production_owner_changed',
    'notes_changed',
    'company_changed',
    'note'
  ));
