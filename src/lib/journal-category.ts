import type { JournalPost } from '@/payload-types'

export const JOURNAL_POST_TYPE_LABELS: Record<JournalPost['postType'], string> = {
  article: 'Article',
  gallery: 'Galerie',
}

export const JOURNAL_GALLERY_LAYOUT_LABELS: Record<
  NonNullable<JournalPost['galleryLayout']>,
  string
> = {
  grid: 'Grille',
  slideshow: 'Diaporama',
}

export const JOURNAL_CATEGORY_LABELS: Record<JournalPost['category'], string> = {
  ia: 'IA',
  design: 'Design',
  veille: 'Veille',
  perso: 'Perso',
  autre: 'Autre',
}

export function formatJournalPublishedDate(value: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}
