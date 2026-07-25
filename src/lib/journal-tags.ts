import type { JournalPost, Tag } from '@/payload-types'

function tagSlug(tag: Tag | number | null | undefined): string | null {
  if (!tag || typeof tag === 'number') return null
  return tag.slug?.trim() || null
}

/** Filtre les articles Lablog par slug de tag (relation CMS). */
export function filterJournalPostsByTagSlug(
  posts: JournalPost[],
  tagSlugFilter?: string | null,
): JournalPost[] {
  const needle = tagSlugFilter?.trim()
  if (!needle) return posts

  return posts.filter((post) => {
    const tags = post.tags
    if (!tags?.length) return false
    return tags.some((tag) => tagSlug(tag) === needle)
  })
}
