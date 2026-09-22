export type AttentionZoneEvent = {
  attentionZoneId: string | null;
  location: string | null;
  emotion: string | null;
  platform: string | null;
  strategy: string | null;
};

function mostFrequent(values: Array<string | null>) {
  const counts = new Map<string, number>();
  values.filter((value): value is string => Boolean(value)).forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return [...counts.entries()].sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))[0]?.[0] ?? null;
}

export function summarizeAttentionZone(zoneId: string, events: AttentionZoneEvent[]) {
  const zoneEvents = events.filter((event) => event.attentionZoneId === zoneId);
  return { frequency: zoneEvents.length, context: mostFrequent(zoneEvents.flatMap((event) => [event.location, event.emotion, event.platform])), strategy: mostFrequent(zoneEvents.map((event) => event.strategy)) };
}
