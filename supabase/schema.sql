
-- FinPath experimental backend (Supabase/Postgres)
-- Designed for AFEI 2026-2 B2C product experiment.
-- Apply with `supabase db push` or paste into the Supabase SQL Editor.

create extension if not exists pgcrypto;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.triage_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  total_score integer not null default 0,
  level text not null check (level in ('beginner','intermediate','advanced')),
  interests text[] not null default '{}',
  recommended_path_ids text[] not null default '{}',
  recommended_goal_template_ids text[] not null default '{}',
  completed_at timestamptz not null default now()
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  path_id text not null,
  status text not null default 'started' check (status in ('started','completed')),
  current_step integer not null default 0,
  score integer,
  error_tags text[] not null default '{}',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  template_id text,
  title text not null,
  description text not null default '',
  type text not null default 'saving_amount',
  target_amount numeric(14,2) not null default 0,
  current_amount numeric(14,2) not null default 0,
  target_value numeric(14,2) not null default 0,
  current_value numeric(14,2) not null default 0,
  unit text,
  target_date date,
  status text not null default 'active' check (status in ('active','completed','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.goal_entries (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(14,2) not null default 0,
  entry_type text not null default 'contribution',
  created_at timestamptz not null default now()
);

create table if not exists public.simulator_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  simulator_id text not null,
  result_code text not null,
  completed_at timestamptz not null default now()
);

create table if not exists public.experiment_sessions (
  id uuid primary key,
  experiment_id text not null,
  device_id uuid not null,
  user_id uuid references auth.users(id) on delete set null,
  started_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  experiment_id text not null,
  actor_key text not null,
  user_id uuid references auth.users(id) on delete set null,
  device_id uuid not null,
  session_id uuid references public.experiment_sessions(id) on delete set null,
  event_name text not null,
  object_type text,
  object_id text,
  properties jsonb not null default '{}'::jsonb,
  dedupe_key text unique,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_experiment_idx on public.analytics_events(experiment_id);
create index if not exists analytics_events_user_idx on public.analytics_events(user_id);
create index if not exists analytics_events_event_idx on public.analytics_events(event_name);
create index if not exists analytics_events_session_idx on public.analytics_events(session_id);

create table if not exists public.experiment_state (
  actor_key text primary key,
  experiment_id text not null,
  user_id uuid references auth.users(id) on delete cascade,
  device_id uuid not null,
  first_seen_at timestamptz not null default now(),
  last_event_at timestamptz not null default now(),
  registered_at timestamptz,
  triage_completed_at timestamptz,
  route_viewed_at timestamptz,
  central_feature_used_at timestamptz,
  lesson_completed_at timestamptz,
  goal_created_at timestamptz,
  simulator_completed_at timestamptz,
  adaptive_practice_shown_at timestamptz,
  adaptive_practice_completed_at timestamptz,
  minimum_journey_completed_at timestamptz,
  premium_offer_viewed_at timestamptz,
  premium_selected_at timestamptz,
  checkout_started_at timestamptz,
  checkout_details_completed_at timestamptz,
  checkout_confirmed_at timestamptz
);

create unique index if not exists experiment_state_user_unique
  on public.experiment_state(user_id)
  where user_id is not null;

create table if not exists public.premium_checkout_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  actor_key text not null,
  offer_price integer not null default 9000,
  currency text not null default 'COP',
  payment_method text,
  status text not null default 'started'
    check (status in ('started','details_completed','confirmed_intent','abandoned')),
  started_at timestamptz not null default now(),
  details_completed_at timestamptz,
  confirmed_at timestamptz
);

-- Automatically create the public profile when an Auth user is created.
create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure private.handle_new_user();

-- Keep the experiment funnel synchronized using the first occurrence of each milestone.
create or replace function private.sync_experiment_state()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.experiment_state (
    actor_key, experiment_id, user_id, device_id, first_seen_at, last_event_at
  )
  values (
    new.actor_key, new.experiment_id, new.user_id, new.device_id, new.created_at, new.created_at
  )
  on conflict (actor_key) do update
    set last_event_at = excluded.last_event_at,
        user_id = coalesce(public.experiment_state.user_id, excluded.user_id);

  update public.experiment_state
  set
    registered_at = case when new.event_name in ('user_authenticated','registration_submitted')
      then coalesce(registered_at,new.created_at) else registered_at end,
    triage_completed_at = case when new.event_name='triage_completed'
      then coalesce(triage_completed_at,new.created_at) else triage_completed_at end,
    route_viewed_at = case when new.event_name='route_viewed'
      then coalesce(route_viewed_at,new.created_at) else route_viewed_at end,
    lesson_completed_at = case when new.event_name='lesson_completed'
      then coalesce(lesson_completed_at,new.created_at) else lesson_completed_at end,
    goal_created_at = case when new.event_name='goal_created'
      then coalesce(goal_created_at,new.created_at) else goal_created_at end,
    simulator_completed_at = case when new.event_name='simulator_completed'
      then coalesce(simulator_completed_at,new.created_at) else simulator_completed_at end,
    central_feature_used_at = case when new.event_name in ('lesson_completed','goal_created','goal_progress_registered','simulator_completed')
      then coalesce(central_feature_used_at,new.created_at) else central_feature_used_at end,
    adaptive_practice_shown_at = case when new.event_name='adaptive_practice_shown'
      then coalesce(adaptive_practice_shown_at,new.created_at) else adaptive_practice_shown_at end,
    adaptive_practice_completed_at = case when new.event_name='adaptive_practice_completed'
      then coalesce(adaptive_practice_completed_at,new.created_at) else adaptive_practice_completed_at end,
    premium_offer_viewed_at = case when new.event_name='premium_offer_viewed'
      then coalesce(premium_offer_viewed_at,new.created_at) else premium_offer_viewed_at end,
    premium_selected_at = case when new.event_name='premium_selected'
      then coalesce(premium_selected_at,new.created_at) else premium_selected_at end,
    checkout_started_at = case when new.event_name='checkout_started'
      then coalesce(checkout_started_at,new.created_at) else checkout_started_at end,
    checkout_details_completed_at = case when new.event_name='checkout_details_completed'
      then coalesce(checkout_details_completed_at,new.created_at) else checkout_details_completed_at end,
    checkout_confirmed_at = case when new.event_name='checkout_confirmed'
      then coalesce(checkout_confirmed_at,new.created_at) else checkout_confirmed_at end
  where actor_key = new.actor_key;

  update public.experiment_state
  set minimum_journey_completed_at = coalesce(minimum_journey_completed_at,new.created_at)
  where actor_key = new.actor_key
    and triage_completed_at is not null
    and route_viewed_at is not null
    and central_feature_used_at is not null
    and minimum_journey_completed_at is null;

  return new;
end;
$$;

drop trigger if exists sync_experiment_state_from_event on public.analytics_events;
create trigger sync_experiment_state_from_event
after insert on public.analytics_events
for each row execute procedure private.sync_experiment_state();

-- RLS
alter table public.profiles enable row level security;
alter table public.triage_results enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.goals enable row level security;
alter table public.goal_entries enable row level security;
alter table public.simulator_runs enable row level security;
alter table public.experiment_sessions enable row level security;
alter table public.analytics_events enable row level security;
alter table public.experiment_state enable row level security;
alter table public.premium_checkout_attempts enable row level security;

drop policy if exists "profiles own select" on public.profiles;
create policy "profiles own select" on public.profiles for select to authenticated
using ((select auth.uid()) = id);
drop policy if exists "profiles own update" on public.profiles;
create policy "profiles own update" on public.profiles for update to authenticated
using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

drop policy if exists "triage own all" on public.triage_results;
create policy "triage own all" on public.triage_results for all to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "lesson own all" on public.lesson_progress;
create policy "lesson own all" on public.lesson_progress for all to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "goals own all" on public.goals;
create policy "goals own all" on public.goals for all to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "goal entries own all" on public.goal_entries;
create policy "goal entries own all" on public.goal_entries for all to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "simulator own all" on public.simulator_runs;
create policy "simulator own all" on public.simulator_runs for all to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "sessions insert anon or own" on public.experiment_sessions;
create policy "sessions insert anon or own" on public.experiment_sessions for insert
to anon, authenticated with check (user_id is null or (select auth.uid()) = user_id);
drop policy if exists "sessions update anon or own" on public.experiment_sessions;
create policy "sessions update anon or own" on public.experiment_sessions for update
to anon, authenticated using (user_id is null or (select auth.uid()) = user_id)
with check (user_id is null or (select auth.uid()) = user_id);
drop policy if exists "sessions own select" on public.experiment_sessions;
create policy "sessions own select" on public.experiment_sessions for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "events insert anon or own" on public.analytics_events;
create policy "events insert anon or own" on public.analytics_events for insert
to anon, authenticated with check (user_id is null or (select auth.uid()) = user_id);
drop policy if exists "events own select" on public.analytics_events;
create policy "events own select" on public.analytics_events for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "state own select" on public.experiment_state;
create policy "state own select" on public.experiment_state for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "checkout own all" on public.premium_checkout_attempts;
create policy "checkout own all" on public.premium_checkout_attempts for all to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- Grants used by the browser client. RLS remains the authorization layer.
grant usage on schema public to anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.triage_results, public.lesson_progress, public.goals, public.goal_entries, public.simulator_runs, public.premium_checkout_attempts to authenticated;
grant select, insert, update on public.experiment_sessions to authenticated;
grant insert, update on public.experiment_sessions to anon;
grant select, insert on public.analytics_events to authenticated;
grant insert on public.analytics_events to anon;
grant select on public.experiment_state to authenticated;
