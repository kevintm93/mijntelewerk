-- MijnTeleWerk MVP 0.15 — upgrade bestaand Supabase-project
-- Voer dit één keer uit in Supabase > SQL Editor.

alter table public.profiles add column if not exists language text not null default 'nl';
alter table public.profiles add column if not exists welcome_back_enabled boolean not null default true;
alter table public.profiles add column if not exists welcome_back_min_days smallint not null default 5;
alter table public.profiles add column if not exists last_welcome_leave_end date;

alter table public.reminder_settings add column if not exists monthly_mode text not null default 'last_workday';

-- Optionele constraints voor bestaande databases.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_language_check') then
    alter table public.profiles add constraint profiles_language_check check (language in ('nl','fr','en'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'profiles_welcome_back_min_days_check') then
    alter table public.profiles add constraint profiles_welcome_back_min_days_check check (welcome_back_min_days between 2 and 30);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'reminder_settings_monthly_mode_check') then
    alter table public.reminder_settings add constraint reminder_settings_monthly_mode_check check (monthly_mode in ('fixed','last_workday'));
  end if;
end $$;

notify pgrst, 'reload schema';
