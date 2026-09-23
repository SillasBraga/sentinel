alter table public.relapse_events
  add column restart_what_happened text check (char_length(restart_what_happened) <= 2000),
  add column restart_barrier text check (char_length(restart_barrier) <= 1000),
  add column restart_next_24h_action text check (char_length(restart_next_24h_action) <= 1000),
  add column restart_tomorrow_mission text check (char_length(restart_tomorrow_mission) <= 500);
