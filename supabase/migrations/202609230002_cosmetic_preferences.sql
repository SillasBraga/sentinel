alter table public.profiles
  add column cosmetic_style text not null default 'base'
  check (cosmetic_style in ('base', 'aurora', 'constellation'));
