import type { Payload } from 'payload'

export type StackSkillCategory = 'frontend' | 'backend' | 'outils' | 'design'

export const STACK_SKILL_MAP: Record<
  string,
  { name: string; category: StackSkillCategory }
> = {
  nextjs: { name: 'Next.js', category: 'frontend' },
  react: { name: 'React', category: 'frontend' },
  typescript: { name: 'TypeScript', category: 'frontend' },
  tailwind: { name: 'Tailwind CSS', category: 'frontend' },
  'framer-motion': { name: 'Framer Motion', category: 'frontend' },
  nodejs: { name: 'Node.js', category: 'backend' },
  postgres: { name: 'PostgreSQL', category: 'backend' },
  payload: { name: 'Payload CMS', category: 'backend' },
  neon: { name: 'Neon', category: 'backend' },
  vercel: { name: 'Vercel', category: 'outils' },
}

export function skillsToEnsureFromStack(
  stack: string[],
): Array<{ name: string; category: string }> {
  const seen = new Set<string>()
  const skills: Array<{ name: string; category: string }> = []

  for (const slug of stack) {
    const mapped = STACK_SKILL_MAP[slug]
    if (!mapped || seen.has(mapped.name)) continue
    seen.add(mapped.name)
    skills.push({ name: mapped.name, category: mapped.category })
  }

  return skills
}

export async function syncProjectStackToSkills(
  payload: Payload,
  stack: string[],
): Promise<{ created: number }> {
  const toEnsure = skillsToEnsureFromStack(stack)
  let created = 0

  for (const skill of toEnsure) {
    const existing = await payload.find({
      collection: 'skills',
      where: { name: { equals: skill.name } },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.totalDocs > 0) continue

    await payload.create({
      collection: 'skills',
      data: {
        name: skill.name,
        category: skill.category as StackSkillCategory,
      },
      overrideAccess: true,
    })
    created += 1
  }

  return { created }
}
