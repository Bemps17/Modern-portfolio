import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { JournalCallout } from '@/components/sections/JournalCallout'

type CalloutBlockFields = {
  variant?: 'info' | 'warning' | 'tip'
  body?: string
}

type JournalRichTextRendererProps = {
  data: DefaultTypedEditorState
  className?: string
}

const journalConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    callout: ({ node }: { node: { fields: CalloutBlockFields } }) => {
      const variant = node.fields.variant ?? 'info'
      const body = node.fields.body ?? ''
      if (!body.trim()) return null
      return <JournalCallout variant={variant} body={body} />
    },
  },
})

export function JournalRichTextRenderer({ data, className }: JournalRichTextRendererProps) {
  return (
    <div className={className}>
      <RichText converters={journalConverters} data={data} />
    </div>
  )
}
