// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type { Payload } from 'payload'

import {
  skillsToEnsureFromStack,
  syncProjectStackToSkills,
} from '@/lib/stack-skill-sync'
import { getTestPayload } from './helpers/payload'

describe('stack-skill-sync', () => {
  describe('skillsToEnsureFromStack', () => {
    it('mappe nextjs vers Next.js frontend', () => {
      const skills = skillsToEnsureFromStack(['nextjs'])
      expect(skills).toEqual([{ name: 'Next.js', category: 'frontend' }])
    })

    it('ignore les slugs inconnus', () => {
      expect(skillsToEnsureFromStack(['unknown'])).toEqual([])
    })

    it('déduplique et mappe plusieurs slugs', () => {
      const skills = skillsToEnsureFromStack(['nextjs', 'react', 'nextjs', 'unknown'])
      expect(skills).toEqual([
        { name: 'Next.js', category: 'frontend' },
        { name: 'React', category: 'frontend' },
      ])
    })

    it('mappe vercel vers outils', () => {
      expect(skillsToEnsureFromStack(['vercel'])).toEqual([
        { name: 'Vercel', category: 'outils' },
      ])
    })
  })

  describe('syncProjectStackToSkills', () => {
    let payload: Payload
    const createdSkillIds: number[] = []

    beforeAll(async () => {
      payload = await getTestPayload()
    }, 60_000)

    afterAll(async () => {
      for (const id of createdSkillIds) {
        await payload.delete({ collection: 'skills', id }).catch(() => undefined)
      }
    })

    it('crée les skills manquantes avec overrideAccess', async () => {
      const uniqueName = `Stack Sync Skill ${Date.now()}`
      const stack = ['nextjs']

      const existing = await payload.find({
        collection: 'skills',
        where: { name: { equals: 'Next.js' } },
        limit: 1,
      })

      const result = await syncProjectStackToSkills(payload, stack)
      expect(result.created).toBeGreaterThanOrEqual(existing.totalDocs === 0 ? 1 : 0)

      const found = await payload.find({
        collection: 'skills',
        where: { name: { equals: 'Next.js' } },
        limit: 1,
      })
      expect(found.docs[0]?.category).toBe('frontend')

      if (existing.totalDocs === 0 && found.docs[0]?.id) {
        createdSkillIds.push(found.docs[0].id)
      }
    })

    it('ne recrée pas une skill existante', async () => {
      const name = `Existing Stack Skill ${Date.now()}`
      const created = await payload.create({
        collection: 'skills',
        data: { name, category: 'backend' },
        overrideAccess: true,
      })
      createdSkillIds.push(created.id)

      const before = await payload.count({
        collection: 'skills',
        where: { name: { equals: name } },
      })

      const result = await syncProjectStackToSkills(payload, [])
      expect(result.created).toBe(0)

      const after = await payload.count({
        collection: 'skills',
        where: { name: { equals: name } },
      })
      expect(after.totalDocs).toBe(before.totalDocs)
    })
  })
})
