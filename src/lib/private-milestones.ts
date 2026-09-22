export const PRIVATE_MILESTONES = {
  first_checkin: { title: "Primeiro passo", description: "Você concluiu seu primeiro check-in." },
  seven_days_present: { title: "Sete dias de presença", description: "Você reservou presença para si em sete dias." },
  three_sos_completed: { title: "Pausa que protege", description: "Você concluiu três sessões SOS de autocuidado." },
  five_checkins_week: { title: "Semana de cuidado", description: "Você registrou cinco momentos em uma janela de sete dias." },
  conscious_restart: { title: "Recomeço consciente", description: "Você registrou um recomeço e preservou sua história." },
} as const;

export type PrivateMilestoneId = keyof typeof PRIVATE_MILESTONES;

export function isPrivateMilestoneId(value: string): value is PrivateMilestoneId {
  return value in PRIVATE_MILESTONES;
}
