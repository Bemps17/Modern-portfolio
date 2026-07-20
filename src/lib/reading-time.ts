import type { Project } from '@/payload-types'

function lexicalToPlainText(value: unknown): string {
  if (!value || typeof value !== 'object') return ''
  const root = (value as { root?: { children?: Array<{ children?: Array<{ text?: string }> }> } }).root
  if (!root?.children) return ''

  return root.children
    .flatMap((node) => node.children?.map((child) => child.text || '') || [])
    .join(' ')
}

export function estimateReadingTime(project: Project): number {
  const text = [project.excerpt, lexicalToPlainText(project.content)].filter(Boolean).join(' ')
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}
