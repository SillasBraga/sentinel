begin;

create table public.presence_xp_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  source text not null check (source in ('checkin', 'habit', 'sos', 'reflection', 'protection')),
  source_key text not null,
  points smallint not null check (points in (10, 15, 20)),
  earned_at timestamptz not null default now(),
  unique (user_id, source, source_key),
  check ((source = 'checkin' and points = 15) or (source = 'habit' and points = 10) or (source = 'sos' and points = 20) or (source = 'reflection' and points = 10) or (source = 'protection' and points = 10))
);

create index presence_xp_events_user_earned_idx on public.presence_xp_events(user_id, earned_at desc);
alter table public.presence_xp_events enable row level security;
create policy "own presence xp read" on public.presence_xp_events for select using ((select auth.uid()) = user_id);

create or replace function public.award_presence_xp(p_source text, p_source_key text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare v_user_id uuid := auth.uid(); v_points smallint; v_valid boolean := false;
begin
  if v_user_id is null then raise exception 'Authentication required'; end if;
  case p_source
    when 'checkin' then v_points := 15; select exists(select 1 from public.daily_checkins where user_id = v_user_id and local_date = p_source_key::date) into v_valid;
    when 'habit' then v_points := 10; select exists(select 1 from public.habit_logs where user_id = v_user_id and habit_id = split_part(p_source_key, ':', 1)::uuid and local_date = split_part(p_source_key, ':', 2)::date) into v_valid;
    when 'sos' then v_points := 20; select exists(select 1 from public.sos_sessions where id = p_source_key::uuid and user_id = v_user_id and completed = true) into v_valid;
    when 'reflection' then v_points := 10; select exists(select 1 from public.journal_entries where id = p_source_key::uuid and user_id = v_user_id) into v_valid;
    when 'protection' then v_points := 10; select exists(select 1 from public.daily_missions where user_id = v_user_id and local_date = p_source_key::date and protection_completed = true) into v_valid;
    else raise exception 'Invalid XP source';
  end case;
  if not v_valid then raise exception 'XP source does not belong to the current user'; end if;
  insert into public.presence_xp_events(user_id, source, source_key, points) values (v_user_id, p_source, p_source_key, v_points) on conflict (user_id, source, source_key) do nothing;
  return found;
end;
$$;

revoke all on function public.award_presence_xp(text, text) from public;
grant execute on function public.award_presence_xp(text, text) to authenticated;
commit;
