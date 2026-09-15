insert into public.achievements(id,title,description,rule) values
('first_checkin','Primeiro passo','Você concluiu seu primeiro check-in.','{"checkins":1}'),
('first_sos','Escolha consciente','Você concluiu um protocolo SOS.','{"sos_completed":1}'),
('seven_aligned','Uma semana presente','Você reuniu sete dias alinhados.','{"aligned_days":7}')
on conflict do nothing;
