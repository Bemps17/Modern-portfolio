function pad2(value: number): string {
  return String(value).padStart(2, '0')
}

/** Format ATS standard : MM/AAAA */
export function formatCvMonthYear(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return `${pad2(date.getUTCMonth() + 1)}/${date.getUTCFullYear()}`
}

/** Valeur datetime HTML (YYYY-MM) pour balises <time>. */
export function formatCvDateTimeValue(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}`
}

/**
 * Plage de dates ATS : `MM/AAAA - MM/AAAA` ou `MM/AAAA - Présent`.
 */
export function formatCvDateRange(
  dateStart: string,
  dateEnd: string | null | undefined,
  current: boolean,
): string {
  const start = formatCvMonthYear(dateStart)
  if (current) return `${start} - Présent`
  if (!dateEnd) return start
  return `${start} - ${formatCvMonthYear(dateEnd)}`
}
