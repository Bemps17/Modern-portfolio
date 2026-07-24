/** Compare deux textes éditoriaux en ignorant casse / ponctuation / espaces. */
export function normalizeComparableText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/** True si les deux chaînes portent le même message (doublon UI). */
export function isDuplicateCopy(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a?.trim() || !b?.trim()) return false
  const left = normalizeComparableText(a)
  const right = normalizeComparableText(b)
  if (!left || !right) return false
  return left === right || left.includes(right) || right.includes(left)
}
