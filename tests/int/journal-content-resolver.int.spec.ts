// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { portfolioFallback } from '@/data/portfolio-fallback'
import { resolveJournalCopy, resolvePublishedJournalPosts } from '@/lib/journal-content'

describe('journal-content resolver', () => {
  it('resolveJournalCopy migre le legacy Carnet vers Le Lablog', () => {
    expect(resolveJournalCopy('Carnet', 'Le Lablog')).toBe('Le Lablog')
    expect(resolveJournalCopy('  Carnet  ', 'Le Lablog')).toBe('Le Lablog')
    expect(resolveJournalCopy(null, 'Le Lablog')).toBe('Le Lablog')
    expect(resolveJournalCopy('', 'Le Lablog')).toBe('Le Lablog')
  })

  it('resolveJournalCopy migre eyebrow et subtitle legacy', () => {
    expect(resolveJournalCopy('Créations & veille', 'La blague du labo', ['Créations & veille'])).toBe(
      'La blague du labo',
    )
    expect(
      resolveJournalCopy(
        'Créations IA, expérimentations visuelles et notes du moment — un skyblog 2026.',
        'Nouveau sous-titre',
        ['Créations IA, expérimentations visuelles et notes du moment — un skyblog 2026.'],
      ),
    ).toBe('Nouveau sous-titre')
  })

  it('resolvePublishedJournalPosts retourne le fallback si CMS vide', () => {
    const fallback = portfolioFallback.journalPosts
    expect(resolvePublishedJournalPosts([], fallback)).toEqual(fallback)
    expect(resolvePublishedJournalPosts([], fallback).length).toBe(12)
  })

  it('resolvePublishedJournalPosts préfère le CMS quand des posts existent', () => {
    const cmsPost = portfolioFallback.journalPosts[0]
    const result = resolvePublishedJournalPosts([cmsPost], portfolioFallback.journalPosts)
    expect(result).toEqual([cmsPost])
    expect(result.length).toBe(1)
  })
})
