begin;

create table public.power_up_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  activity_id uuid not null references public.alternative_activities(id) on delete restrict,
  local_date date not null,
  completed_at timestamptz not null default now(),
  unique (user_id, activity_id, local_date)
);

create index power_up_logs_user_date_idx on public.power_up_logs(user_id, local_date desc);
alter table public.power_up_logs enable row level security;
create policy "own power up logs read" on public.power_up_logs for select using ((select auth.uid()) = user_id);

create or replace function public.complete_power_up(p_activity_id uuid, p_local_date date)
returns boolean language plpgsql security definer set search_path = '' as $$
declare v_user_id uuid := auth.uid(); v_today date;
begin
  if v_user_id is null then raise exception 'Authentication required'; end if;
  select (now() at time zone timezone)::date into v_today from public.profiles where id = v_user_id;
  if p_local_date <> v_today then raise exception 'Power-ups can only be completed today'; end if;
  if not exists (select 1 from public.alternative_activities where id = p_activity_id and user_id = v_user_id and active = true) then raise exception 'Power-up does not belong to the current user'; end if;
  insert into public.power_up_logs(user_id, activity_id, local_date) values (v_user_id, p_activity_id, p_local_date) on conflict (user_id, activity_id, local_date) do nothing;
  return found;
end;
$$;

revoke all on function public.complete_power_up(uuid, date) from public;
grant execute on function public.complete_power_up(uuid, date) to authenticated;

commit;
