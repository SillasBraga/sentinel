export const cosmeticStyles = ["base", "aurora", "constellation"] as const;

export type CosmeticStyle = (typeof cosmeticStyles)[number];

export const cosmeticCatalog = [
  { id: "base", title: "Base serena", description: "A aparência essencial do Sentinel.", requiredXp: 0 },
  { id: "aurora", title: "Aurora", description: "Um fundo suave para celebrar sua presença.", requiredXp: 100 },
  { id: "constellation", title: "Constelação", description: "Pontos de luz discretos para acompanhar seu caminho.", requiredXp: 300 },
] as const satisfies ReadonlyArray<{ id: CosmeticStyle; title: string; description: string; requiredXp: number }>;

export function isCosmeticStyle(value: unknown): value is CosmeticStyle {
  return typeof value === "string" && cosmeticStyles.includes(value as CosmeticStyle);
}

export function getCosmeticCollection(totalXp: number) {
  const safeXp = Math.max(0, totalXp);
  return cosmeticCatalog.map((cosmetic) => ({ ...cosmetic, unlocked: safeXp >= cosmetic.requiredXp }));
}
