import { RichTextRenderer } from '@/components/sections/RichTextRenderer'
import type { JournalPost } from '@/payload-types'

type JournalArticleBodyProps = {
  content: NonNullable<JournalPost['content']>
  className?: string
}

/** Corps d’article Lablog — typographie aérée alignée design system. */
export function JournalArticleBody({ content, className }: JournalArticleBodyProps) {
  return (
    <div className={className ?? 'lablog-prose mt-10'}>
      <RichTextRenderer data={content} />
    </div>
  )
}
