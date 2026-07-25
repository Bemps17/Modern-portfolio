import { JournalPostGrid } from '@/components/sections/JournalPostGrid'
import { Button } from '@/components/ui/Button'
import { ReadableSurface } from '@/components/ui/ReadableSurface'
import { SectionTitle } from '@/components/ui/SectionTitle'
import type { JournalPost } from '@/payload-types'

type FeaturedJournalPostsProps = {
  posts: JournalPost[]
  eyebrow?: string | null
  title?: string | null
  subtitle?: string | null
}

export function FeaturedJournalPosts({
  posts,
  eyebrow,
  title,
  subtitle,
}: FeaturedJournalPostsProps) {
  if (!posts.length) return null

  return (
    <ReadableSurface strong>
      <SectionTitle
        editorial
        eyebrow={eyebrow ?? 'La blague du labo'}
        icon="journal"
        subtitle={subtitle ?? 'Articles et galeries choisis dans Le Lablog.'}
        title={title ?? 'Le Lablog'}
      />
      <JournalPostGrid posts={posts} />
      <div className="mt-10">
        <Button href="/carnet" variant="glass">
          Tout Le Lablog
        </Button>
      </div>
    </ReadableSurface>
  )
}
