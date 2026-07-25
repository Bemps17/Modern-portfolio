import { JournalRichTextRenderer } from '@/components/sections/JournalRichTextRenderer'
import type { JournalPost } from '@/payload-types'

type JournalArticleBodyProps = {
  content: NonNullable<JournalPost['content']>
  className?: string
}

/** Corps d’article Lablog — typographie aérée + encarts callout. */
export function JournalArticleBody({ content, className }: JournalArticleBodyProps) {
  return (
    <div className={className ?? 'lablog-prose mt-10'}>
      <JournalRichTextRenderer data={content} />
    </div>
  )
}
