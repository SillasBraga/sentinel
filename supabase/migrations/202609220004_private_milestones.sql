begin;

insert into public.achievements (id, title, description, rule) values
  ('first_checkin', 'Primeiro passo', 'Você concluiu seu primeiro check-in.', '{"checkins":1}'::jsonb),
  ('seven_days_present', 'Sete dias de presença', 'Você reservou presença para si em sete dias.', '{"checkin_days":7}'::jsonb),
  ('three_sos_completed', 'Pausa que protege', 'Você concluiu três sessões SOS de autocuidado.', '{"sos_completed":3}'::jsonb),
  ('five_checkins_week', 'Semana de cuidado', 'Você registrou cinco momentos em uma janela de sete dias.', '{"checkins_in_7_days":5}'::jsonb),
  ('conscious_restart', 'Recomeço consciente', 'Você registrou um recomeço e preservou sua história.', '{"relapse_events":1}'::jsonb)
on conflict (id) do update set title = excluded.title, description = excluded.description, rule = excluded.rule;

create or replace function public.award_private_milestones()
returns table (achievement_id text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_today date;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  select (now() at time zone timezone)::date into v_today
  from public.profiles
  where id = v_user_id;

  if exists (select 1 from public.daily_checkins where user_id = v_user_id) then
    return query
      insert into public.user_achievements (user_id, achievement_id)
      values (v_user_id, 'first_checkin')
      on conflict do nothing
      returning user_achievements.achievement_id;
  end if;

  if (select count(*) from public.daily_checkins where user_id = v_user_id) >= 7 then
    return query
      insert into public.user_achievements (user_id, achievement_id)
      values (v_user_id, 'seven_days_present')
      on conflict do nothing
      returning user_achievements.achievement_id;
  end if;

  if (select count(*) from public.sos_sessions where user_id = v_user_id and completed = true) >= 3 then
    return query
      insert into public.user_achievements (user_id, achievement_id)
      values (v_user_id, 'three_sos_completed')
      on conflict do nothing
      returning user_achievements.achievement_id;
  end if;

  if v_today is not null and (select count(*) from public.daily_checkins where user_id = v_user_id and local_date between v_today - 6 and v_today) >= 5 then
    return query
      insert into public.user_achievements (user_id, achievement_id)
      values (v_user_id, 'five_checkins_week')
      on conflict do nothing
      returning user_achievements.achievement_id;
  end if;

  if exists (select 1 from public.relapse_events where user_id = v_user_id) then
    return query
      insert into public.user_achievements (user_id, achievement_id)
      values (v_user_id, 'conscious_restart')
      on conflict do nothing
      returning user_achievements.achievement_id;
  end if;
end;
$$;

revoke all on function public.award_private_milestones() from public;
grant execute on function public.award_private_milestones() to authenticated;

commit;
