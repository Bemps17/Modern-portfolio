// @vitest-environment node
import { describe, expect, it } from 'vitest'

import {
  applyLablogBlueprint,
  LABLOG_ARTICLE_JSON_TEMPLATE,
} from '@/lib/lablog-article-blueprint'
import {
  lablogBlueprintSchema,
  validateLablogBlueprint,
} from '@/lib/lablog-blueprint-schema'

describe('lablogBlueprintSchema', () => {
  it('accepte un blueprint valide complet', () => {
    const result = validateLablogBlueprint(LABLOG_ARTICLE_JSON_TEMPLATE)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.title).toBe(LABLOG_ARTICLE_JSON_TEMPLATE.title)
      expect(result.data.blocks?.length).toBeGreaterThan(0)
    }
  })

  it('accepte un blueprint minimal avec titre seul', () => {
    const result = validateLablogBlueprint({ title: 'Titre seul' })
    expect(result.ok).toBe(true)
  })

  it('rejette un titre non string', () => {
    const result = validateLablogBlueprint({ title: 42 })
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.length).toBeGreaterThan(0)
    }
  })

  it('rejette des blocks invalides', () => {
    const result = validateLablogBlueprint({ blocks: [{ type: 'invalid', text: 'x' }] })
    expect(result.ok).toBe(false)
  })

  it('rejette une catégorie inconnue', () => {
    const result = validateLablogBlueprint({ category: 'marketing' })
    expect(result.ok).toBe(false)
  })

  it('parse une chaîne JSON valide', () => {
    const result = validateLablogBlueprint(JSON.stringify({ title: 'Via JSON' }))
    expect(result.ok).toBe(true)
  })

  it('rejette une chaîne JSON mal formée', () => {
    const result = validateLablogBlueprint('{ title: broken')
    expect(result.ok).toBe(false)
  })

  it('expose lablogBlueprintSchema pour usage admin', () => {
    const parsed = lablogBlueprintSchema.safeParse(LABLOG_ARTICLE_JSON_TEMPLATE)
    expect(parsed.success).toBe(true)
  })
})

describe('applyLablogBlueprint validation', () => {
  const existingContent = applyLablogBlueprint(LABLOG_ARTICLE_JSON_TEMPLATE, {}).content

  it('ne modifie pas le contenu si le blueprint est invalide', () => {
    const current = {
      title: 'Titre existant',
      excerpt: 'Excerpt existant',
      category: 'ia',
      content: existingContent,
    }

    const result = applyLablogBlueprint({ title: 123, blocks: 'not-an-array' }, current)

    expect(result.title).toBe('Titre existant')
    expect(result.excerpt).toBe('Excerpt existant')
    expect(result.category).toBe('ia')
    expect(result.content).toBe(existingContent)
  })

  it('applique un blueprint valide', () => {
    const result = applyLablogBlueprint(LABLOG_ARTICLE_JSON_TEMPLATE, {
      title: 'Ancien titre',
      content: existingContent,
    })

    expect(result.title).toBe(LABLOG_ARTICLE_JSON_TEMPLATE.title)
    expect(result.content.root.children.length).toBe(LABLOG_ARTICLE_JSON_TEMPLATE.blocks.length)
  })
})
