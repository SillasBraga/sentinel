begin;

alter table public.daily_focuses
  add column completed_at timestamptz;

commit;
