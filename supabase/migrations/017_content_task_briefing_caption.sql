-- Legenda de publicação (separada de hook, roteiro e CTA)

alter table public.content_tasks
  add column if not exists briefing_caption text;
