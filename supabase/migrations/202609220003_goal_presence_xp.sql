begin;

alter table public.presence_xp_events
  drop constraint if exists presence_xp_events_source_check,
  drop constraint if exists presence_xp_events_points_check,
  drop constraint if exists presence_xp_events_check,
  add constraint presence_xp_events_source_check check (source in ('checkin', 'habit', 'sos', 'reflection', 'protection', 'goal')),
  add constraint presence_xp_events_points_check check (points in (10, 15, 20, 25)),
  add constraint presence_xp_events_reward_check check (
    (source = 'checkin' and points = 15) or (source = 'habit' and points = 10) or (source = 'sos' and points = 20) or (source = 'reflection' and points = 10) or (source = 'protection' and points = 10) or (source = 'goal' and points = 25)
  );

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
    when 'goal' then v_points := 25; select exists(select 1 from public.goals where id = p_source_key::uuid and user_id = v_user_id and completed_at is not null) into v_valid;
    else raise exception 'Invalid XP source';
  end case;
  if not v_valid then raise exception 'XP source does not belong to the current user'; end if;
  insert into public.presence_xp_events(user_id, source, source_key, points) values (v_user_id, p_source, p_source_key, v_points) on conflict (user_id, source, source_key) do nothing;
  return found;
end;
$$;

commit;
