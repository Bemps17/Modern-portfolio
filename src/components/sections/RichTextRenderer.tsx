import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { RichText } from '@payloadcms/richtext-lexical/react'

type RichTextRendererProps = {
  data: DefaultTypedEditorState
  className?: string
}

export function RichTextRenderer({ data, className }: RichTextRendererProps) {
  return (
    <div className={className}>
      <RichText data={data} />
    </div>
  )
}
