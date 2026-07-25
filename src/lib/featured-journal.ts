import type { JournalPost } from '@/payload-types'

type FeaturedRef = number | { id: number }

function featuredId(ref: FeaturedRef): number | null {
  if (typeof ref === 'number') return ref
  if (ref && typeof ref === 'object' && typeof ref.id === 'number') return ref.id
  return null
}

type FeaturedJournalLookup = Pick<JournalPost, 'id' | 'slug'> & {
  status?: JournalPost['status'] | null
}

const MAX_FEATURED_JOURNAL_POSTS = 3

/** Articles Lablog mis en avant : ordre CMS, brouillons exclus, max 3. */
export function resolveFeaturedJournalPosts(
  featuredIds: FeaturedRef[],
  allPosts: FeaturedJournalLookup[],
): JournalPost[] {
  if (!featuredIds.length) return []

  const byId = new Map(
    allPosts
      .filter((post) => post.status == null || post.status === 'published')
      .map((post) => [post.id, post as JournalPost]),
  )

  const featured: JournalPost[] = []

  for (const ref of featuredIds) {
    if (featured.length >= MAX_FEATURED_JOURNAL_POSTS) break

    const id = featuredId(ref)
    if (id == null) continue

    const post = byId.get(id)
    if (!post) continue

    featured.push(post)
  }

  return featured
}
