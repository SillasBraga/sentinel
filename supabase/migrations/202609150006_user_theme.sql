begin;

alter table public.profiles
  add column theme text not null default 'light'
  check (theme in ('light', 'dark'));

commit;
