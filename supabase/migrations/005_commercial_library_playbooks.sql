-- Biblioteca Comercial — tipos de script estendidos para playbooks completos

alter table public.commercial_scripts
  drop constraint if exists commercial_scripts_script_type_check;

alter table public.commercial_scripts
  add constraint commercial_scripts_script_type_check
  check (script_type in (
    'initial', 'continuation', 'express_diagnosis',
    'followup_1', 'followup_2', 'followup_3', 'cta',
    'segment_overview', 'free_diagnosis', 'products',
    'opportunity_signals', 'reference_cases', 'best_practices'
  ));

insert into public.commercial_scripts (segment_id, script_type, content)
select s.id, t.script_type, ''
from public.commercial_segments s
cross join (
  values
    ('segment_overview'), ('free_diagnosis'), ('products'),
    ('opportunity_signals'), ('reference_cases'), ('best_practices')
) as t(script_type)
on conflict (segment_id, script_type) do nothing;
