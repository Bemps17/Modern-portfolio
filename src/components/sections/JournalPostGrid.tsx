import { JournalPostCard } from '@/components/sections/JournalPostCard'
import type { JournalPost } from '@/payload-types'

type JournalPostGridProps = {
  posts: JournalPost[]
}

export function JournalPostGrid({ posts }: JournalPostGridProps) {
  if (!posts.length) {
    return (
      <p className="text-[var(--foreground-secondary)]">Aucun article publié pour le moment.</p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => (
        <JournalPostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
