begin;

create table public.daily_missions (
  user_id uuid not null references public.profiles(id) on delete cascade,
  local_date date not null,
  checkin_completed boolean not null default false,
  habit_completed boolean not null default false,
  protection_completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, local_date),
  check (
    (checkin_completed and habit_completed and protection_completed) = (completed_at is not null)
  )
);

create index daily_missions_user_date_idx on public.daily_missions(user_id, local_date desc);

alter table public.daily_missions enable row level security;

create policy "own daily missions" on public.daily_missions
  for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

commit;
