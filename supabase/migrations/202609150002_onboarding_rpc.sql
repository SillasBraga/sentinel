create or replace function public.complete_onboarding(p_user_id uuid, p_payload jsonb)
returns void language plpgsql security invoker set search_path = public as $$
begin
  if p_user_id <> auth.uid() then raise exception 'forbidden'; end if;
  update profiles set display_name = p_payload->>'displayName', discreet_mode = coalesce((p_payload->>'discreetMode')::boolean,false), spiritual_mode = (p_payload->>'spiritualMode')::spiritual_mode, onboarding_completed = true, updated_at = now() where id = p_user_id;
  update recovery_profiles set goals = array(select jsonb_array_elements_text(p_payload->'goals')), current_frequency = nullif(p_payload->>'frequency',''), risk_start = nullif(p_payload->>'riskStart','')::time, risk_end = nullif(p_payload->>'riskEnd','')::time, motivations = p_payload->>'motivation', accountability_preference = p_payload->>'accountability', reminders_enabled = coalesce((p_payload->>'reminders')::boolean,false), checkin_time = (p_payload->>'checkinTime')::time, updated_at = now() where user_id = p_user_id;
  delete from triggers where user_id = p_user_id;
  insert into triggers(user_id,kind,label) select p_user_id,'context',value from jsonb_array_elements_text(p_payload->'risks');
  insert into personal_reasons(user_id,reason) values(p_user_id,p_payload->>'motivation');
  insert into alternative_activities(user_id,label,duration_minutes) values (p_user_id,'Caminhar por alguns minutos',10),(p_user_id,'Beber água e mudar de ambiente',5),(p_user_id,'Falar com alguém de confiança',10);
end; $$;
