begin;
create extension if not exists pgcrypto;

create type public.spiritual_mode as enum ('off','christian','custom');
create type public.relationship_status as enum ('pending','active','revoked','declined');
create type public.risk_level as enum ('low','moderate','high','critical');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (char_length(display_name) <= 80),
  timezone text not null default 'America/Sao_Paulo',
  locale text not null default 'pt-BR',
  discreet_mode boolean not null default false,
  hide_sensitive_numbers boolean not null default false,
  onboarding_completed boolean not null default false,
  spiritual_mode public.spiritual_mode not null default 'off',
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.recovery_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  started_at timestamptz not null default now(), goals text[] not null default '{}',
  current_frequency text, risk_start time, risk_end time, motivations text,
  accountability_preference text check (accountability_preference in ('yes','later','no')),
  checkin_time time default '20:00', reminders_enabled boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.triggers (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('emotion','context','environment','platform','time','custom')),
  label text not null check (char_length(label) between 1 and 100), created_at timestamptz not null default now()
);
create table public.personal_reasons (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  reason text not null check (char_length(reason) between 1 and 1000), active boolean not null default true,
  created_at timestamptz not null default now()
);
create table public.alternative_activities (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  label text not null check (char_length(label) between 1 and 120), duration_minutes smallint check (duration_minutes between 1 and 240), active boolean not null default true,
  created_at timestamptz not null default now()
);
create table public.daily_checkins (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  local_date date not null, mood smallint not null check (mood between 1 and 5), urge_level smallint not null check (urge_level between 0 and 10),
  exposure text not null check (exposure in ('none','light','moderate','strong')), situations text[] not null default '{}',
  small_win text check (char_length(small_win) <= 500), occurred_at timestamptz not null default now(), created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(user_id, local_date)
);
create table public.urges (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  intensity smallint not null check (intensity between 0 and 10), emotion text, context text, location_context text,
  alone boolean, associated_platform text, thought text check (char_length(thought) <= 2000), response_taken text, outcome text,
  occurred_at timestamptz not null default now(), created_at timestamptz not null default now()
);
create table public.relapse_events (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  occurred_at timestamptz not null, trigger_summary text check (char_length(trigger_summary) <= 1000), emotions text[] not null default '{}',
  context text, learning text check (char_length(learning) <= 2000), next_step text check (char_length(next_step) <= 1000), created_at timestamptz not null default now()
);
create table public.sos_sessions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  started_at timestamptz not null default now(), finished_at timestamptz, initial_intensity smallint not null check (initial_intensity between 0 and 10),
  final_intensity smallint check (final_intensity between 0 and 10), environment text, strategies text[] not null default '{}', duration_seconds integer check (duration_seconds >= 0), completed boolean not null default false
);
create table public.habits (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100), cadence text not null default 'daily' check (cadence in ('daily','weekdays','custom')),
  active boolean not null default true, created_at timestamptz not null default now()
);
create table public.habit_logs (
  id uuid primary key default gen_random_uuid(), habit_id uuid not null references public.habits(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade, local_date date not null, completed_at timestamptz not null default now(), unique(habit_id, local_date)
);
create table public.goals (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 140), target_date date, completed_at timestamptz, created_at timestamptz not null default now()
);
create table public.journal_entries (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  title text check (char_length(title) <= 140), body text not null check (char_length(body) between 1 and 10000), mood smallint check (mood between 1 and 5),
  occurred_at timestamptz not null default now(), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.risk_items (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('domain','app','social','term','context')), value text not null check (char_length(value) between 1 and 250), created_at timestamptz not null default now()
);
create table public.risk_scores (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  score smallint not null check (score between 0 and 100), level public.risk_level not null, factors jsonb not null default '[]'::jsonb, calculated_at timestamptz not null default now()
);
create table public.accountability_relationships (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.profiles(id) on delete cascade,
  partner_id uuid references public.profiles(id) on delete set null, invite_email text,
  invite_token_hash text not null unique, invite_expires_at timestamptz not null default (now() + interval '7 days'),
  status public.relationship_status not null default 'pending',
  permissions jsonb not null default '{"streak":true,"checkins":false,"risk":false,"relapses":false,"support_requests":true,"weekly_progress":true,"goals":false,"journal":false}'::jsonb,
  accepted_at timestamptz, created_at timestamptz not null default now(), revoked_at timestamptz,
  check (owner_id <> partner_id)
);
create table public.support_requests (
  id uuid primary key default gen_random_uuid(), relationship_id uuid not null references public.accountability_relationships(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade, message text not null default 'Estou passando por um momento difícil. Pode falar comigo alguns minutos?',
  requested_at timestamptz not null default now(), acknowledged_at timestamptz, resolved_at timestamptz
);
create table public.accountability_access_events (
  id bigint generated always as identity primary key, relationship_id uuid not null references public.accountability_relationships(id) on delete cascade,
  partner_id uuid not null references public.profiles(id) on delete cascade, resource text not null, accessed_at timestamptz not null default now()
);
create table public.privacy_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade, personal_analytics boolean not null default true,
  browser_notifications boolean not null default false, quick_exit boolean not null default true, updated_at timestamptz not null default now()
);
create table public.notifications (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null, title text not null, body text not null, read_at timestamptz, created_at timestamptz not null default now()
);
create table public.achievements (id text primary key, title text not null, description text not null, rule jsonb not null default '{}'::jsonb);
create table public.user_achievements (user_id uuid not null references public.profiles(id) on delete cascade, achievement_id text not null references public.achievements(id) on delete cascade, earned_at timestamptz not null default now(), primary key(user_id, achievement_id));

create index checkins_user_date_idx on public.daily_checkins(user_id, local_date desc);
create index urges_user_time_idx on public.urges(user_id, occurred_at desc);
create index relapses_user_time_idx on public.relapse_events(user_id, occurred_at desc);
create index sos_user_time_idx on public.sos_sessions(user_id, started_at desc);
create index habit_logs_user_date_idx on public.habit_logs(user_id, local_date desc);
create index triggers_user_kind_idx on public.triggers(user_id, kind);
create index risk_scores_user_time_idx on public.risk_scores(user_id, calculated_at desc);
create index relationships_partner_status_idx on public.accountability_relationships(partner_id, status);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(id, display_name) values(new.id, nullif(new.raw_user_meta_data->>'display_name',''));
  insert into public.recovery_profiles(user_id) values(new.id);
  insert into public.privacy_preferences(user_id) values(new.id);
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.recovery_profiles enable row level security;
alter table public.triggers enable row level security;
alter table public.personal_reasons enable row level security;
alter table public.alternative_activities enable row level security;
alter table public.daily_checkins enable row level security;
alter table public.urges enable row level security;
alter table public.relapse_events enable row level security;
alter table public.sos_sessions enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.goals enable row level security;
alter table public.journal_entries enable row level security;
alter table public.risk_items enable row level security;
alter table public.risk_scores enable row level security;
alter table public.accountability_relationships enable row level security;
alter table public.support_requests enable row level security;
alter table public.accountability_access_events enable row level security;
alter table public.privacy_preferences enable row level security;
alter table public.notifications enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;

create policy "own profile" on public.profiles for all using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "own recovery profile" on public.recovery_profiles for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own triggers" on public.triggers for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own reasons" on public.personal_reasons for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own activities" on public.alternative_activities for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own checkins" on public.daily_checkins for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own urges" on public.urges for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own relapses" on public.relapse_events for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own sos" on public.sos_sessions for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own habits" on public.habits for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own habit logs" on public.habit_logs for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own goals" on public.goals for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own journal" on public.journal_entries for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own risk items" on public.risk_items for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own risk scores" on public.risk_scores for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "relationship parties read" on public.accountability_relationships for select using ((select auth.uid()) in (owner_id, partner_id));
create policy "owner manages relationship" on public.accountability_relationships for all using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy "relationship parties read requests" on public.support_requests for select using (exists(select 1 from public.accountability_relationships r where r.id = relationship_id and (select auth.uid()) in (r.owner_id,r.partner_id) and r.status = 'active'));
create policy "owner creates requests" on public.support_requests for insert with check ((select auth.uid()) = owner_id);
create policy "partner acknowledges requests" on public.support_requests for update using (exists(select 1 from public.accountability_relationships r where r.id = relationship_id and (select auth.uid()) = r.partner_id and r.status = 'active'));
create policy "own access audit read" on public.accountability_access_events for select using (exists(select 1 from public.accountability_relationships r where r.id = relationship_id and (select auth.uid()) = r.owner_id));
create policy "partner writes access audit" on public.accountability_access_events for insert with check ((select auth.uid()) = partner_id);
create policy "own privacy" on public.privacy_preferences for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own notifications" on public.notifications for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "achievements readable" on public.achievements for select using (true);
create policy "own earned achievements" on public.user_achievements for select using ((select auth.uid()) = user_id);

commit;
