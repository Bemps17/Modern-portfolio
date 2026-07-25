import type { Project } from '@/payload-types'

export function lexicalToPlainText(value: unknown): string {
  if (!value || typeof value !== 'object') return ''
  const root = (value as { root?: { children?: Array<{ children?: Array<{ text?: string }> }> } }).root
  if (!root?.children) return ''

  return root.children
    .flatMap((node) => node.children?.map((child) => child.text || '') || [])
    .join(' ')
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function readingMinutesFromText(text: string): number {
  return Math.max(1, Math.ceil(countWords(text) / 200))
}

export function estimateReadingTime(project: Project): number {
  const text = [project.excerpt, lexicalToPlainText(project.content)].filter(Boolean).join(' ')
  return readingMinutesFromText(text)
}

type JournalReadingInput = {
  excerpt?: string | null
  content?: unknown
}

export function estimateJournalReadingTime(input: JournalReadingInput): number {
  const text = [input.excerpt, lexicalToPlainText(input.content)].filter(Boolean).join(' ')
  return readingMinutesFromText(text)
}
