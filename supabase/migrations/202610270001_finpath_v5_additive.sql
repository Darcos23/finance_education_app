-- FinPath v5 · migración ADITIVA e idempotente.
-- No altera tablas ni triggers del experimento v4.
-- No ejecutada sobre el proyecto remoto en esta fase.

create table if not exists public.benefit_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  period_index integer not null check (period_index >= 0),
  helped boolean not null,
  approximate_amount_cop numeric(14,2)
    check (approximate_amount_cop is null or approximate_amount_cop >= 0),
  action_description text
    check (action_description is null or char_length(action_description) <= 280),
  sean_ellis_response text not null
    check (sean_ellis_response in ('very', 'somewhat', 'not')),
  created_at timestamptz not null default now(),
  unique (user_id, period_index)
);

comment on column public.benefit_checkins.approximate_amount_cop is
  'Monto AUTODECLARADO, no verificado mediante transacciones.';
comment on column public.benefit_checkins.period_index is
  'Periodo de 7 dias desde la fecha local de registro: 0,1,2... calculado en la aplicacion.';

create index if not exists benefit_checkins_user_created_idx
  on public.benefit_checkins (user_id, created_at desc);

create table if not exists public.skill_checks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('pre', 'post')),
  score integer not null check (score between 0 and 3),
  answers jsonb not null default '{}'::jsonb,
  lessons_completed_at_submission integer not null default 0
    check (lessons_completed_at_submission >= 0),
  created_at timestamptz not null default now(),
  unique (user_id, kind)
);

comment on column public.skill_checks.lessons_completed_at_submission is
  'Permite distinguir una medicion pre autentica (0 lecciones) de un pre tardio.';

create index if not exists skill_checks_user_created_idx
  on public.skill_checks (user_id, created_at desc);

alter table public.benefit_checkins enable row level security;
alter table public.skill_checks enable row level security;

drop policy if exists "benefit checkins own select" on public.benefit_checkins;
create policy "benefit checkins own select" on public.benefit_checkins
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "benefit checkins own insert" on public.benefit_checkins;
create policy "benefit checkins own insert" on public.benefit_checkins
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "skill checks own select" on public.skill_checks;
create policy "skill checks own select" on public.skill_checks
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "skill checks own insert" on public.skill_checks;
create policy "skill checks own insert" on public.skill_checks
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

grant usage on schema public to authenticated;
grant select, insert on public.benefit_checkins, public.skill_checks
  to authenticated;
