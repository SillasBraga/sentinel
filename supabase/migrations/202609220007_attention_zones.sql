begin;

create table public.attention_zones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

alter table public.urges
  add column attention_zone_id uuid references public.attention_zones(id) on delete set null,
  add column protection_strategy text check (char_length(protection_strategy) <= 120);

create index urges_user_zone_time_idx on public.urges(user_id, attention_zone_id, occurred_at desc);
alter table public.attention_zones enable row level security;
create policy "own attention zones" on public.attention_zones
  for all using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

commit;
