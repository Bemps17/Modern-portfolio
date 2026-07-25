import { z } from 'zod'

import type { LexicalBlock } from '@/lib/lexical-content'
import { blocksToLexical } from '@/lib/lexical-content'

const blockSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('p'), text: z.string().min(1) }),
  z.object({ type: z.literal('h2'), text: z.string().min(1) }),
  z.object({ type: z.literal('h3'), text: z.string().min(1) }),
  z.object({ type: z.literal('ul'), items: z.array(z.string().min(1)).min(1) }),
])

export const lablogArticleBlueprintSchema = z.object({
  title: z.string().min(1).optional(),
  excerpt: z.string().min(1).max(220).optional(),
  category: z.enum(['ia', 'design', 'veille', 'perso', 'autre']).optional(),
  blocks: z.array(blockSchema).min(1),
})

export type LablogArticleBlueprint = z.infer<typeof lablogArticleBlueprintSchema>

/** Modèle JSON de référence — direction artistique Lablog (Syne titres, corps aéré, sections H2/H3). */
export const LABLOG_ARTICLE_JSON_TEMPLATE: LablogArticleBlueprint = {
  title: 'Titre éditorial de l’article',
  excerpt: 'Chapô court (max 220 car.) — accroche en une ou deux phrases.',
  category: 'ia',
  blocks: [
    {
      type: 'p',
      text: 'Introduction percutante : contexte, enjeu et promesse de l’article en 2–3 phrases.',
    },
    {
      type: 'h2',
      text: 'Première section principale',
    },
    {
      type: 'p',
      text: 'Paragraphe de développement — phrases courtes, ton expert mais accessible. Laisser respirer entre les idées.',
    },
    {
      type: 'h3',
      text: 'Sous-section optionnelle',
    },
    {
      type: 'ul',
      items: [
        'Point clé numéro un',
        'Point clé numéro deux',
        'Point clé numéro trois',
      ],
    },
    {
      type: 'p',
      text: 'Conclusion analytique — synthèse et ouverture, sans call-to-action marketing.',
    },
  ],
}

export function parseLablogBlueprint(input: unknown): LablogArticleBlueprint {
  const normalized =
    typeof input === 'string' && input.trim().length > 0 ? JSON.parse(input) : input
  return lablogArticleBlueprintSchema.parse(normalized)
}

export function blueprintBlocksToLexical(blocks: LablogArticleBlueprint['blocks']) {
  return blocksToLexical(blocks as LexicalBlock[])
}

export type LablogBlueprintApplyResult = {
  content: ReturnType<typeof blocksToLexical>
  title?: string
  excerpt?: string
  category?: LablogArticleBlueprint['category']
}

/** Applique un blueprint JSON aux champs éditoriaux d’un post article. */
export function applyLablogBlueprint(
  blueprintInput: unknown,
  current: {
    title?: string | null
    excerpt?: string | null
    category?: string | null
  },
): LablogBlueprintApplyResult {
  const blueprint = parseLablogBlueprint(blueprintInput)

  return {
    content: blueprintBlocksToLexical(blueprint.blocks),
    title: blueprint.title ?? current.title ?? undefined,
    excerpt: blueprint.excerpt ?? current.excerpt ?? undefined,
    category: blueprint.category ?? (current.category as LablogArticleBlueprint['category']) ?? undefined,
  }
}
