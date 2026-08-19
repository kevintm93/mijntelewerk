-- MijnTelewerk MVP 0.16 — Supabase schema voor een nieuw project
-- Uitvoeren in Supabase > SQL Editor.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  timezone text not null default 'Europe/Brussels',
  language text not null default 'nl' check (language in ('nl','fr','en')),
  welcome_back_enabled boolean not null default true,
  welcome_back_min_days smallint not null default 5 check (welcome_back_min_days between 2 and 30),
  last_welcome_leave_end date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.planning_years (
  user_id uuid not null references auth.users(id) on delete cascade,
  year integer not null check (year between 2000 and 2100),
  max_telework_percent numeric(5,2) not null default 60 check (max_telework_percent between 0 and 100),
  categories jsonb not null default '[]'::jsonb,
  days jsonb not null default '{}'::jsonb,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, year)
);

create table if not exists public.reminder_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  enabled boolean not null default false,
  cadence text not null default 'monthly' check (cadence in ('weekly','monthly')),
  monthly_mode text not null default 'last_workday' check (monthly_mode in ('fixed','first_workday','last_workday')),
  weekday smallint check (weekday between 0 and 6),
  day_of_month smallint check (day_of_month between 1 and 28),
  local_time time not null default '17:00',
  timezone text not null default 'Europe/Brussels',
  last_sent_at timestamptz,
  last_acknowledged_period text,
  snoozed_until date,
  updated_at timestamptz not null default now()
);

-- Veilige upgrades voor oudere databases.
alter table public.profiles add column if not exists language text not null default 'nl';
alter table public.profiles add column if not exists welcome_back_enabled boolean not null default true;
alter table public.profiles add column if not exists welcome_back_min_days smallint not null default 5;
alter table public.profiles add column if not exists last_welcome_leave_end date;
alter table public.planning_years add column if not exists settings jsonb not null default '{}'::jsonb;
alter table public.reminder_settings add column if not exists monthly_mode text not null default 'last_workday';
alter table public.reminder_settings add column if not exists last_acknowledged_period text;
alter table public.reminder_settings add column if not exists snoozed_until date;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists planning_years_set_updated_at on public.planning_years;
create trigger planning_years_set_updated_at before update on public.planning_years for each row execute function public.set_updated_at();
drop trigger if exists reminder_settings_set_updated_at on public.reminder_settings;
create trigger reminder_settings_set_updated_at before update on public.reminder_settings for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.planning_years enable row level security;
alter table public.reminder_settings enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select to authenticated using ((select auth.uid()) = id);
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

drop policy if exists "planning_select_own" on public.planning_years;
create policy "planning_select_own" on public.planning_years for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "planning_insert_own" on public.planning_years;
create policy "planning_insert_own" on public.planning_years for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "planning_update_own" on public.planning_years;
create policy "planning_update_own" on public.planning_years for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "reminders_select_own" on public.reminder_settings;
create policy "reminders_select_own" on public.reminder_settings for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "reminders_insert_own" on public.reminder_settings;
create policy "reminders_insert_own" on public.reminder_settings for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "reminders_update_own" on public.reminder_settings;
create policy "reminders_update_own" on public.reminder_settings for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

grant usage on schema public to authenticated;
grant select, insert, update, delete on table public.profiles, public.planning_years, public.reminder_settings to authenticated;
create index if not exists planning_years_user_year_idx on public.planning_years(user_id, year);
notify pgrst, 'reload schema';
