const MONTHS_FR = [
  'janv.',
  'févr.',
  'mars',
  'avr.',
  'mai',
  'juin',
  'juil.',
  'août',
  'sept.',
  'oct.',
  'nov.',
  'déc.',
] as const

function formatMonthYear(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return `${MONTHS_FR[date.getUTCMonth()]} ${date.getUTCFullYear()}`
}

export function formatCvDateRange(
  dateStart: string,
  dateEnd: string | null | undefined,
  current: boolean,
): string {
  const start = formatMonthYear(dateStart)
  if (current) return `${start} – Présent`
  if (!dateEnd) return start
  return `${start} – ${formatMonthYear(dateEnd)}`
}
