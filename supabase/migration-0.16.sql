-- MijnTelewerk MVP 0.16 — e-mailreminders vervangen door accountgebonden website-pop-up
-- Voer dit één keer uit in Supabase > SQL Editor.

-- De bestaande tabel blijft behouden, zodat ingestelde voorkeuren niet verloren gaan.
alter table public.reminder_settings add column if not exists last_acknowledged_period text;
alter table public.reminder_settings add column if not exists snoozed_until date;

-- Sta naast een vaste dag en laatste werkdag ook de eerste werkdag toe.
alter table public.reminder_settings drop constraint if exists reminder_settings_monthly_mode_check;
alter table public.reminder_settings drop constraint if exists reminder_settings_monthly_mode_check1;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'reminder_settings_monthly_mode_v016_check') then
    alter table public.reminder_settings
      add constraint reminder_settings_monthly_mode_v016_check
      check (monthly_mode in ('fixed','first_workday','last_workday'));
  end if;
end $$;

notify pgrst, 'reload schema';
