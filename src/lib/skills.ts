import type { Skill } from '@/payload-types'

export const SOFT_SKILL_CATEGORY = 'soft' as const

export function getSoftSkills(skills: Skill[]): Skill[] {
  return skills.filter((skill) => skill.category === SOFT_SKILL_CATEGORY)
}

export function getTechnicalSkills(skills: Skill[]): Skill[] {
  return skills.filter((skill) => skill.category !== SOFT_SKILL_CATEGORY)
}

export const SKILL_CATEGORY_LABELS: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  outils: 'Outils',
  design: 'Design',
  soft: 'Soft skills',
}
