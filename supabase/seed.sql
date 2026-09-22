insert into public.achievements(id,title,description,rule) values
('first_checkin','Primeiro passo','Você concluiu seu primeiro check-in.','{"checkins":1}'),
('seven_days_present','Sete dias de presença','Você reservou presença para si em sete dias.','{"checkin_days":7}'),
('three_sos_completed','Pausa que protege','Você concluiu três sessões SOS de autocuidado.','{"sos_completed":3}'),
('five_checkins_week','Semana de cuidado','Você registrou cinco momentos em uma janela de sete dias.','{"checkins_in_7_days":5}'),
('conscious_restart','Recomeço consciente','Você registrou um recomeço e preservou sua história.','{"relapse_events":1}')
on conflict do nothing;
