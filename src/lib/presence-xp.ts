export const PRESENCE_XP_REWARDS = { checkin: 15, habit: 10, sos: 20, reflection: 10, protection: 10, goal: 25 } as const;
export type PresenceXpSource = keyof typeof PRESENCE_XP_REWARDS;

export function getPresenceProgress(totalXp: number) {
  const safeTotal = Math.max(0, totalXp);
  const energy = safeTotal % 100;
  return { totalXp: safeTotal, level: Math.floor(safeTotal / 100) + 1, energy, energyToNextLevel: 100 - energy, energyPercent: energy };
}
