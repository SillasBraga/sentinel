export function formatInTimeZone(value: string, timezone: string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(value));
}

export function differenceInCalendarDays(later: string, earlier: string, timezone: string) {
  const a = formatInTimeZone(later, timezone);
  const b = formatInTimeZone(earlier, timezone);
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  return Math.round((Date.UTC(ay, am - 1, ad) - Date.UTC(by, bm - 1, bd)) / 86_400_000);
}
