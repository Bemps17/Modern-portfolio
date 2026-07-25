import type { LablogCoverTheme } from '@/lib/lablog-cover-art'
import type { LexicalBlock } from '@/lib/lexical-content'

export type LablogArticleDefinition = {
  slug: string
  title: string
  excerpt: string
  category: 'ia' | 'veille' | 'design' | 'perso' | 'autre'
  coverTheme: LablogCoverTheme
  publishedAt: string
  order: number
  blocks: LexicalBlock[]
}

export function lablogCoverPublicPath(slug: string): string {
  return `/carnet/${slug}-cover.webp`
}
