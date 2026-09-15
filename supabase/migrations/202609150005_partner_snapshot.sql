create or replace function public.accountability_partner_snapshot(p_relationship_id uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare r public.accountability_relationships; owner_profile public.profiles; result jsonb; last_start timestamptz; aligned integer;
begin
  select * into r from public.accountability_relationships where id=p_relationship_id and partner_id=auth.uid() and status='active';
  if r.id is null then raise exception 'forbidden'; end if;
  select * into owner_profile from public.profiles where id=r.owner_id;
  result=jsonb_build_object('relationshipId',r.id,'name',coalesce(owner_profile.display_name,'Pessoa apoiada'));
  if coalesce((r.permissions->>'streak')::boolean,false) then
    select greatest(rp.started_at,coalesce(max(re.occurred_at),rp.started_at)) into last_start from public.recovery_profiles rp left join public.relapse_events re on re.user_id=rp.user_id where rp.user_id=r.owner_id group by rp.started_at;
    result=result||jsonb_build_object('streak',greatest(0,(now() at time zone owner_profile.timezone)::date-(last_start at time zone owner_profile.timezone)::date));
  end if;
  if coalesce((r.permissions->>'weekly_progress')::boolean,false) then
    select 30-count(distinct (occurred_at at time zone owner_profile.timezone)::date) into aligned from public.relapse_events where user_id=r.owner_id and occurred_at>=now()-interval '30 days';
    result=result||jsonb_build_object('alignedDays',aligned);
  end if;
  if coalesce((r.permissions->>'checkins')::boolean,false) then result=result||jsonb_build_object('checkin',(select jsonb_build_object('mood',mood,'occurredAt',occurred_at) from public.daily_checkins where user_id=r.owner_id order by occurred_at desc limit 1)); end if;
  if coalesce((r.permissions->>'risk')::boolean,false) then result=result||jsonb_build_object('risk',(select jsonb_build_object('level',level,'score',score,'calculatedAt',calculated_at) from public.risk_scores where user_id=r.owner_id order by calculated_at desc limit 1)); end if;
  if coalesce((r.permissions->>'support_requests')::boolean,false) then result=result||jsonb_build_object('supportRequest',(select jsonb_build_object('requestedAt',requested_at,'acknowledgedAt',acknowledged_at) from public.support_requests where relationship_id=r.id order by requested_at desc limit 1)); end if;
  if coalesce((r.permissions->>'goals')::boolean,false) then result=result||jsonb_build_object('goal',(select jsonb_build_object('title',title,'targetDate',target_date) from public.goals where user_id=r.owner_id and completed_at is null order by created_at limit 1)); end if;
  if coalesce((r.permissions->>'relapses')::boolean,false) then result=result||jsonb_build_object('lastRelapse',(select occurred_at from public.relapse_events where user_id=r.owner_id order by occurred_at desc limit 1)); end if;
  if coalesce((r.permissions->>'journal')::boolean,false) then result=result||jsonb_build_object('journal',(select jsonb_build_object('title',title,'body',body,'occurredAt',occurred_at) from public.journal_entries where user_id=r.owner_id order by occurred_at desc limit 1)); end if;
  insert into public.accountability_access_events(relationship_id,partner_id,resource) values(r.id,auth.uid(),'partner_snapshot');
  return result;
end; $$;
revoke all on function public.accountability_partner_snapshot(uuid) from public;
grant execute on function public.accountability_partner_snapshot(uuid) to authenticated;
