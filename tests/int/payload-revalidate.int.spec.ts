import { describe, expect, it, vi } from 'vitest'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

import { revalidatePath } from 'next/cache'

import {
  PUBLIC_PATHS,
  revalidateContentPages,
  revalidateContentPagesDelete,
  revalidateGlobals,
  revalidateMediaChange,
  revalidateProjects,
  revalidateProjectsDelete,
  revalidatePublicSite,
} from '@/lib/revalidate'

describe('revalidatePublicSite', () => {
  it('invalide le layout racine et les pages publiques', () => {
    vi.mocked(revalidatePath).mockClear()
    revalidatePublicSite()

    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout')
    for (const path of PUBLIC_PATHS) {
      expect(revalidatePath).toHaveBeenCalledWith(path, 'page')
    }
    expect(revalidatePath).toHaveBeenCalledWith('/sitemap.xml', 'page')
  })
})

describe('hooks CMS', () => {
  it('revalidateProjects invalide aussi le slug courant et l’ancien slug', () => {
    vi.mocked(revalidatePath).mockClear()
    const doc = { slug: 'nouveau-projet' }
    const result = revalidateProjects({
      doc,
      previousDoc: { slug: 'ancien-projet' },
    } as never)

    expect(result).toBe(doc)
    expect(revalidatePath).toHaveBeenCalledWith('/projets/nouveau-projet', 'page')
    expect(revalidatePath).toHaveBeenCalledWith('/projets/ancien-projet', 'page')
  })

  it('revalidateProjectsDelete invalide le slug supprimé', () => {
    vi.mocked(revalidatePath).mockClear()
    revalidateProjectsDelete({ doc: { slug: 'gone' } } as never)
    expect(revalidatePath).toHaveBeenCalledWith('/projets/gone', 'page')
  })

  it('hooks contenu / médias / globals déclenchent une revalidation globale', () => {
    vi.mocked(revalidatePath).mockClear()
    revalidateContentPages({ doc: {} } as never)
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout')

    vi.mocked(revalidatePath).mockClear()
    revalidateContentPagesDelete({} as never)
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout')

    vi.mocked(revalidatePath).mockClear()
    revalidateMediaChange({ doc: {} } as never)
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout')

    vi.mocked(revalidatePath).mockClear()
    revalidateGlobals({ doc: {} } as never)
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout')
  })
})
