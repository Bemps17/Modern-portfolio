import { portfolioFallback } from '@/data/portfolio-fallback'
import type { Skill } from '@/payload-types'

export const SOFT_SKILL_CATEGORY = 'soft' as const

const FALLBACK_SOFT_SKILLS = portfolioFallback.skills.filter(
  (skill) => skill.category === SOFT_SKILL_CATEGORY,
)

export function getSoftSkills(skills: Skill[]): Skill[] {
  return skills.filter((skill) => skill.category === SOFT_SKILL_CATEGORY)
}

/** CMS d'abord ; si aucune soft skill publiée, repli sur le fallback démo. */
export function resolveSoftSkills(skills: Skill[]): Skill[] {
  const fromCms = getSoftSkills(skills)
  return fromCms.length > 0 ? fromCms : FALLBACK_SOFT_SKILLS
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
