export const PRESENCE_XP_REWARDS = { checkin: 15, habit: 10, sos: 20, reflection: 10, protection: 10, goal: 25 } as const;
export type PresenceXpSource = keyof typeof PRESENCE_XP_REWARDS;

export function xpRequiredForLevel(level: number) {
  return 50 * Math.max(0, level - 1) * Math.max(1, level);
}

export function getPresenceProgress(totalXp: number) {
  const safeTotal = Math.max(0, totalXp);
  let level = 1;
  while (safeTotal >= xpRequiredForLevel(level + 1)) level += 1;
  const levelStartXp = xpRequiredForLevel(level);
  const nextLevelXp = xpRequiredForLevel(level + 1);
  const energy = safeTotal - levelStartXp;
  const energyNeeded = nextLevelXp - levelStartXp;
  return { totalXp: safeTotal, level, energy, energyNeeded, energyToNextLevel: nextLevelXp - safeTotal, energyPercent: Math.round((energy / energyNeeded) * 100) };
}
