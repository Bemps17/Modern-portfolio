import { z } from 'zod'

import type { LexicalBlock } from '@/lib/lexical-content'
import { blocksToLexical } from '@/lib/lexical-content'
import {
  lablogBlueprintSchema,
  validateLablogBlueprint,
  type LablogBlueprint,
} from '@/lib/lablog-blueprint-schema'

export { validateLablogBlueprint, lablogBlueprintSchema } from '@/lib/lablog-blueprint-schema'
export type { LablogBlueprint } from '@/lib/lablog-blueprint-schema'

export const lablogArticleBlueprintSchema = lablogBlueprintSchema.extend({
  blocks: z.array(
    z.discriminatedUnion('type', [
      z.object({ type: z.literal('p'), text: z.string().min(1) }),
      z.object({ type: z.literal('h2'), text: z.string().min(1) }),
      z.object({ type: z.literal('h3'), text: z.string().min(1) }),
      z.object({ type: z.literal('ul'), items: z.array(z.string().min(1)).min(1) }),
    ]),
  ).min(1),
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

export function blueprintBlocksToLexical(blocks: NonNullable<LablogBlueprint['blocks']>) {
  return blocksToLexical(blocks as LexicalBlock[])
}

export type LablogBlueprintApplyResult = {
  content: ReturnType<typeof blocksToLexical>
  title?: string
  excerpt?: string
  category?: LablogBlueprint['category']
}

function unchangedApplyResult(current: {
  title?: string | null
  excerpt?: string | null
  category?: string | null
  content?: LablogBlueprintApplyResult['content'] | null
}): LablogBlueprintApplyResult {
  return {
    content: current.content ?? blocksToLexical([]),
    title: current.title ?? undefined,
    excerpt: current.excerpt ?? undefined,
    category: (current.category as LablogBlueprint['category']) ?? undefined,
  }
}

/** Applique un blueprint JSON aux champs éditoriaux d’un post article. */
export function applyLablogBlueprint(
  blueprintInput: unknown,
  current: {
    title?: string | null
    excerpt?: string | null
    category?: string | null
    content?: LablogBlueprintApplyResult['content'] | null
  },
): LablogBlueprintApplyResult {
  const validation = validateLablogBlueprint(blueprintInput)
  if (!validation.ok) {
    return unchangedApplyResult(current)
  }

  const blueprint = validation.data

  return {
    content: blueprint.blocks
      ? blueprintBlocksToLexical(blueprint.blocks)
      : unchangedApplyResult(current).content,
    title: blueprint.title ?? current.title ?? undefined,
    excerpt: blueprint.excerpt ?? current.excerpt ?? undefined,
    category: blueprint.category ?? (current.category as LablogBlueprint['category']) ?? undefined,
  }
}
