begin;

create table public.daily_focuses (
  user_id uuid not null references public.profiles(id) on delete cascade,
  local_date date not null,
  focus text not null check (char_length(focus) between 1 and 160),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, local_date)
);

alter table public.daily_focuses enable row level security;
create policy "own daily focuses" on public.daily_focuses
  for all using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

commit;
