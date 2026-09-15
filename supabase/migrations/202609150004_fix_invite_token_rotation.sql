create or replace function public.accept_accountability_invite(p_token_hash text,p_partner_id uuid)
returns uuid language plpgsql security definer set search_path='' as $$
declare relationship_id uuid;
begin
  if p_partner_id <> auth.uid() then raise exception 'forbidden'; end if;
  update public.accountability_relationships
  set partner_id=p_partner_id,status='active',accepted_at=now(),invite_token_hash=encode(extensions.gen_random_bytes(32),'hex')
  where invite_token_hash=p_token_hash and status='pending' and invite_expires_at>now() and owner_id<>p_partner_id
  returning id into relationship_id;
  if relationship_id is null then raise exception 'invalid_invite'; end if;
  return relationship_id;
end; $$;
