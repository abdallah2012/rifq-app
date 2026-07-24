begin;

create extension if not exists pgcrypto;

create type public.cycle_phase as enum ('menstrual','follicular','ovulation','luteal');
create type public.energy_level as enum ('low','medium','high');
create type public.budget_level as enum ('free','low','medium');
create type public.feedback_status as enum ('saved','completed','dismissed','unsuitable');

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 80),
  nickname text check (char_length(nickname) <= 80),
  avatar_key text, theme_color text not null default '#286f66',
  expected_cycle_length smallint not null default 28 check (expected_cycle_length between 15 and 60),
  expected_period_length smallint not null default 5 check (expected_period_length between 1 and 12),
  expected_luteal_length smallint not null default 14 check (expected_luteal_length between 9 and 18),
  cycle_regularity text not null default 'unknown' check (cycle_regularity in ('regular','variable','unknown')),
  timezone text not null default 'Africa/Casablanca', notes text,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.cycle_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  period_start_date date not null, period_end_date date,
  notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (profile_id, period_start_date),
  check (period_end_date is null or period_end_date >= period_start_date),
  check (period_end_date is null or period_end_date <= period_start_date + 12)
);

create table public.daily_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  checkin_date date not null,
  energy_level energy_level, mood text, communication_desire energy_level,
  discomfort_level text check (discomfort_level is null or discomfort_level in ('none','mild','medium','high')),
  preferred_mode text, indoor_outdoor_preference text check (indoor_outdoor_preference is null or indoor_outdoor_preference in ('indoor','outdoor','either')),
  available_minutes smallint check (available_minutes is null or available_minutes between 5 and 720),
  budget_level budget_level, notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (profile_id, checkin_date)
);

create table public.activities (
  id uuid primary key default gen_random_uuid(), phase cycle_phase[] not null,
  devi_elements text[] not null, frame_name text not null, title_ar text not null,
  description_ar text not null, category text not null, energy_requirement energy_level not null,
  communication_requirement energy_level not null default 'medium',
  indoor_outdoor text not null check (indoor_outdoor in ('indoor','outdoor','either')),
  approximate_minutes smallint not null check (approximate_minutes between 5 and 720),
  budget_level budget_level not null, is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.profile_activity_preferences (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  activity_id uuid not null references public.activities(id) on delete cascade,
  preference_status text not null check (preference_status in ('liked','neutral','excluded')),
  custom_note text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (profile_id, activity_id)
);

create table public.activity_feedback (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  activity_id uuid not null references public.activities(id) on delete restrict,
  feedback_date date not null default current_date, status feedback_status not null,
  rating smallint check (rating between 1 and 5), notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.profile_phase_preferences (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade, phase cycle_phase not null,
  preferred_support text, likes text[] not null default '{}', dislikes text[] not null default '{}',
  custom_guidance text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (profile_id, phase)
);

create table public.notification_preferences (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  reminders_enabled boolean not null default false,
  neutral_notification_text text not null default 'لديك تحديث جديد داخل رِفق.',
  daily_summary_enabled boolean not null default false, daily_summary_time time,
  cycle_reminder_enabled boolean not null default false, privacy_mode boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.user_settings (
  id uuid primary key default gen_random_uuid(), user_id uuid not null unique references auth.users(id) on delete cascade,
  locale text not null default 'ar', timezone text not null default 'Africa/Casablanca',
  theme text not null default 'light', app_lock_enabled boolean not null default false,
  analytics_opt_in boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null, entity_type text, entity_id uuid, metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index profiles_user_idx on public.profiles(user_id);
create index cycles_profile_date_idx on public.cycle_records(profile_id, period_start_date desc);
create index checkins_profile_date_idx on public.daily_checkins(profile_id, checkin_date desc);
create index feedback_profile_date_idx on public.activity_feedback(profile_id, feedback_date desc);
create index cycles_user_idx on public.cycle_records(user_id);
create index checkins_user_idx on public.daily_checkins(user_id);
create unique index activities_title_ar_idx on public.activities(title_ar);
create index profile_activity_preferences_user_idx on public.profile_activity_preferences(user_id);
create index profile_activity_preferences_activity_idx on public.profile_activity_preferences(activity_id);
create index activity_feedback_user_idx on public.activity_feedback(user_id);
create index activity_feedback_activity_idx on public.activity_feedback(activity_id);
create index profile_phase_preferences_user_idx on public.profile_phase_preferences(user_id);
create index notification_preferences_user_idx on public.notification_preferences(user_id);
create index notification_preferences_profile_idx on public.notification_preferences(profile_id) where profile_id is not null;
create index audit_events_user_created_idx on public.audit_events(user_id, created_at desc);
create unique index notification_user_default_idx on public.notification_preferences(user_id) where profile_id is null;
create unique index notification_user_profile_idx on public.notification_preferences(user_id, profile_id) where profile_id is not null;

create function public.set_updated_at() returns trigger language plpgsql security invoker set search_path = '' as $$
begin new.updated_at = now(); return new; end $$;

do $$ declare t text; begin
  foreach t in array array['profiles','cycle_records','daily_checkins','activities','profile_activity_preferences','activity_feedback','profile_phase_preferences','notification_preferences','user_settings']
  loop execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()', 'set_updated_at', t); end loop;
end $$;

alter table public.profiles enable row level security;
alter table public.cycle_records enable row level security;
alter table public.daily_checkins enable row level security;
alter table public.activities enable row level security;
alter table public.profile_activity_preferences enable row level security;
alter table public.activity_feedback enable row level security;
alter table public.profile_phase_preferences enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.user_settings enable row level security;
alter table public.audit_events enable row level security;

create policy "activities readable" on public.activities for select to authenticated using (is_active);

do $$ declare t text; begin
  foreach t in array array['profiles','cycle_records','daily_checkins','profile_activity_preferences','activity_feedback','profile_phase_preferences','notification_preferences','user_settings','audit_events']
  loop
    execute format('create policy %I on public.%I for select to authenticated using ((select auth.uid()) = user_id)', t || ' select own', t);
    execute format('create policy %I on public.%I for insert to authenticated with check ((select auth.uid()) = user_id)', t || ' insert own', t);
    execute format('create policy %I on public.%I for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)', t || ' update own', t);
    execute format('create policy %I on public.%I for delete to authenticated using ((select auth.uid()) = user_id)', t || ' delete own', t);
  end loop;
end $$;

create function public.owns_profile(target_profile uuid) returns boolean
language sql stable security definer set search_path = '' as
$$ select exists(select 1 from public.profiles where id = target_profile and user_id = (select auth.uid())) $$;

create or replace function public.enforce_profile_ownership() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  if new.profile_id is null then return new; end if;
  if not public.owns_profile(new.profile_id) then raise exception 'not authorized'; end if;
  return new;
end $$;

do $$ declare t text; begin
  foreach t in array array['cycle_records','daily_checkins','profile_activity_preferences','activity_feedback','profile_phase_preferences','notification_preferences']
  loop execute format('create trigger %I before insert or update on public.%I for each row execute function public.enforce_profile_ownership()', 'enforce_profile_ownership', t); end loop;
end $$;

commit;
