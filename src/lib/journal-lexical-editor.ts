import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { CalloutBlock } from '@/blocks/CalloutBlock'

/** Éditeur Lexical Lablog — inclut les encarts (callout). */
export function journalLexicalEditor() {
  return lexicalEditor({
    features: ({ rootFeatures }) => [
      ...rootFeatures,
      BlocksFeature({
        blocks: [CalloutBlock],
      }),
    ],
  })
}
