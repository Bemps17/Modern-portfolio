// @vitest-environment node
import { describe, expect, it } from 'vitest'

import {
  applyLablogBlueprint,
  LABLOG_ARTICLE_JSON_TEMPLATE,
  parseLablogBlueprint,
} from '@/lib/lablog-article-blueprint'

describe('lablog-article-blueprint', () => {
  it('parse le modèle JSON de référence', () => {
    const parsed = parseLablogBlueprint(LABLOG_ARTICLE_JSON_TEMPLATE)
    expect(parsed.blocks.length).toBeGreaterThanOrEqual(4)
  })

  it('applyLablogBlueprint génère du contenu Lexical', () => {
    const result = applyLablogBlueprint(LABLOG_ARTICLE_JSON_TEMPLATE, {})
    expect(result.content.root.children.length).toBe(LABLOG_ARTICLE_JSON_TEMPLATE.blocks.length)
    expect(result.title).toBe(LABLOG_ARTICLE_JSON_TEMPLATE.title)
  })

  it('parse une chaîne JSON', () => {
    const parsed = parseLablogBlueprint(JSON.stringify(LABLOG_ARTICLE_JSON_TEMPLATE))
    expect(parsed.title).toBe(LABLOG_ARTICLE_JSON_TEMPLATE.title)
  })

  it('rejette un blueprint sans blocks', () => {
    expect(() => parseLablogBlueprint({ title: 'Sans corps' })).toThrow()
  })
})
