import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index), line.slice(index + 1)];
    }),
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) throw new Error("Configure o Supabase local em .env.local antes de criar o usuário demo.");

const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
const email = "demo@sentinel.local";
const password = "SentinelDemo2026!";

const { data: usersPage, error: listError } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
if (listError) throw listError;
let user = usersPage.users.find((candidate) => candidate.email === email);

if (!user) {
  const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { display_name: "Lucas Demo" } });
  if (error) throw error;
  user = data.user;
} else {
  const { data, error } = await admin.auth.admin.updateUserById(user.id, { password, email_confirm: true });
  if (error) throw error;
  user = data.user;
}

const userId = user.id;
const now = new Date();
const isoDaysAgo = (days, hour = 20) => {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};
const localDate = (days) => isoDaysAgo(days, 12).slice(0, 10);

const must = async (promise) => {
  const result = await promise;
  if (result.error) throw result.error;
  return result.data;
};

await must(admin.from("profiles").update({ display_name: "Lucas Demo", timezone: "America/Sao_Paulo", onboarding_completed: true, discreet_mode: false, hide_sensitive_numbers: false }).eq("id", userId));
await must(admin.from("recovery_profiles").upsert({ user_id: userId, started_at: isoDaysAgo(21, 8), goals: ["Recuperar o controle", "Melhorar foco e energia"], current_frequency: "Algumas vezes por semana", risk_start: "22:00", risk_end: "01:00", motivations: "Quero estar mais presente, recuperar meu foco e construir relacionamentos melhores.", accountability_preference: "later", checkin_time: "20:00", reminders_enabled: true }));
await must(admin.from("privacy_preferences").upsert({ user_id: userId, personal_analytics: true, browser_notifications: false, quick_exit: true }));

await must(admin.from("daily_checkins").upsert([
  { id: "10000000-0000-4000-8000-000000000001", user_id: userId, local_date: localDate(0), mood: 4, urge_level: 2, exposure: "none", situations: ["Casa"], small_win: "Saí para caminhar depois do trabalho.", occurred_at: isoDaysAgo(0) },
  { id: "10000000-0000-4000-8000-000000000002", user_id: userId, local_date: localDate(1), mood: 3, urge_level: 4, exposure: "light", situations: ["Noite", "Redes sociais"], small_win: "Deixei o celular fora do quarto.", occurred_at: isoDaysAgo(1) },
  { id: "10000000-0000-4000-8000-000000000003", user_id: userId, local_date: localDate(2), mood: 4, urge_level: 1, exposure: "none", situations: ["Trabalho"], small_win: "Concluí uma tarefa importante.", occurred_at: isoDaysAgo(2) },
  { id: "10000000-0000-4000-8000-000000000004", user_id: userId, local_date: localDate(3), mood: 2, urge_level: 7, exposure: "moderate", situations: ["Sozinho", "Noite"], small_win: "Usei o SOS antes de tomar uma decisão.", occurred_at: isoDaysAgo(3, 23) },
  { id: "10000000-0000-4000-8000-000000000005", user_id: userId, local_date: localDate(4), mood: 3, urge_level: 3, exposure: "light", situations: ["Casa"], small_win: "Conversei com um amigo.", occurred_at: isoDaysAgo(4) },
  { id: "10000000-0000-4000-8000-000000000006", user_id: userId, local_date: localDate(5), mood: 4, urge_level: 2, exposure: "none", situations: ["Trabalho"], occurred_at: isoDaysAgo(5) },
  { id: "10000000-0000-4000-8000-000000000007", user_id: userId, local_date: localDate(6), mood: 3, urge_level: 5, exposure: "light", situations: ["Noite"], occurred_at: isoDaysAgo(6) }
], { onConflict: "id" }));

await must(admin.from("urges").upsert([
  { id: "20000000-0000-4000-8000-000000000001", user_id: userId, intensity: 7, emotion: "Ansiedade", context: "Fim de um dia difícil", location_context: "Quarto", alone: true, associated_platform: "Redes sociais", response_taken: "Ativei o SOS", outcome: "O impulso diminuiu", occurred_at: isoDaysAgo(3, 23) },
  { id: "20000000-0000-4000-8000-000000000002", user_id: userId, intensity: 5, emotion: "Tédio", context: "Sem atividade planejada", location_context: "Casa", alone: true, response_taken: "Fui caminhar", outcome: "Melhor", occurred_at: isoDaysAgo(6, 22) },
  { id: "20000000-0000-4000-8000-000000000003", user_id: userId, intensity: 3, emotion: "Estresse", context: "Depois do trabalho", location_context: "Casa", alone: false, response_taken: "Conversei com alguém", outcome: "Melhor", occurred_at: isoDaysAgo(8, 19) },
  { id: "20000000-0000-4000-8000-000000000004", user_id: userId, intensity: 6, emotion: "Solidão", context: "Antes de dormir", location_context: "Quarto", alone: true, response_taken: "Deixei o celular longe", outcome: "O impulso passou", occurred_at: isoDaysAgo(12, 0) },
  { id: "20000000-0000-4000-8000-000000000005", user_id: userId, intensity: 4, emotion: "Tédio", context: "Fim de semana", location_context: "Casa", alone: true, response_taken: "Toquei violão", outcome: "Melhor", occurred_at: isoDaysAgo(15, 16) }
], { onConflict: "id" }));

await must(admin.from("relapse_events").upsert({ id: "30000000-0000-4000-8000-000000000001", user_id: userId, occurred_at: isoDaysAgo(10, 23), trigger_summary: "Cansaço, isolamento e uso prolongado de redes sociais.", emotions: ["Tédio", "Ansiedade"], context: "Sozinho, tarde da noite", learning: "Preciso encerrar as redes sociais antes do meu horário de risco.", next_step: "Deixar o celular carregando fora do quarto." }, { onConflict: "id" }));
await must(admin.from("sos_sessions").upsert({ id: "40000000-0000-4000-8000-000000000001", user_id: userId, started_at: isoDaysAgo(3, 23), finished_at: isoDaysAgo(3, 23), initial_intensity: 8, final_intensity: 4, environment: "Quarto", strategies: ["mudar_ambiente", "respiracao", "atividade_alternativa"], duration_seconds: 524, completed: true }, { onConflict: "id" }));

await must(admin.from("triggers").upsert([
  { id: "50000000-0000-4000-8000-000000000001", user_id: userId, kind: "emotion", label: "Tédio" },
  { id: "50000000-0000-4000-8000-000000000002", user_id: userId, kind: "context", label: "Sozinho à noite" },
  { id: "50000000-0000-4000-8000-000000000003", user_id: userId, kind: "platform", label: "Redes sociais" }
], { onConflict: "id" }));
await must(admin.from("personal_reasons").upsert({ id: "60000000-0000-4000-8000-000000000001", user_id: userId, reason: "Quero estar mais presente, recuperar meu foco e construir relacionamentos melhores." }, { onConflict: "id" }));
await must(admin.from("alternative_activities").upsert([
  { id: "70000000-0000-4000-8000-000000000001", user_id: userId, label: "Caminhar por dez minutos", duration_minutes: 10 },
  { id: "70000000-0000-4000-8000-000000000002", user_id: userId, label: "Tocar violão", duration_minutes: 15 },
  { id: "70000000-0000-4000-8000-000000000003", user_id: userId, label: "Conversar com alguém de confiança", duration_minutes: 10 }
], { onConflict: "id" }));

await must(admin.from("habits").upsert([
  { id: "80000000-0000-4000-8000-000000000001", user_id: userId, name: "Caminhar 15 minutos" },
  { id: "80000000-0000-4000-8000-000000000002", user_id: userId, name: "Celular fora do quarto" },
  { id: "80000000-0000-4000-8000-000000000003", user_id: userId, name: "Ler antes de dormir" }
], { onConflict: "id" }));
await must(admin.from("habit_logs").upsert(Array.from({ length: 6 }, (_, day) => ({ id: `90000000-0000-4000-8000-${String(day + 1).padStart(12, "0")}`, habit_id: day % 2 === 0 ? "80000000-0000-4000-8000-000000000001" : "80000000-0000-4000-8000-000000000002", user_id: userId, local_date: localDate(day) })), { onConflict: "id" }));
await must(admin.from("goals").upsert({ id: "a0000000-0000-4000-8000-000000000001", user_id: userId, title: "Completar 14 dias com escolhas conscientes", target_date: localDate(-7) }, { onConflict: "id" }));

console.log("Usuário demo pronto:");
console.log(`E-mail: ${email}`);
console.log(`Senha: ${password}`);
