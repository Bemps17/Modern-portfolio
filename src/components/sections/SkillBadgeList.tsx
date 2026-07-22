import Image from 'next/image'

import { Badge } from '@/components/ui/Badge'
import type { Skill } from '@/payload-types'
import { resolveMediaUrl } from '@/lib/media'

type SkillBadgeListProps = {
  skills: Skill[]
}

export function SkillBadgeList({ skills }: SkillBadgeListProps) {
  if (!skills.length) return null

  const byCategory = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const key = skill.category
    acc[key] ??= []
    acc[key].push(skill)
    return acc
  }, {})

  return (
    <div className="space-y-8">
      {Object.entries(byCategory).map(([category, items]) => (
        <div key={category}>
          <h3 className="mb-3 font-[family-name:var(--font-space-grotesk)] text-sm tracking-[0.18em] text-[var(--muted)] uppercase">
            {category}
          </h3>
          <div className="flex flex-wrap gap-3">
            {items.map((skill) => {
              const iconUrl = resolveMediaUrl(skill.icon)
              return (
                <Badge className="gap-2 py-1.5" key={skill.id}>
                  {iconUrl ? (
                    <Image alt="" className="rounded-sm" height={16} src={iconUrl} width={16} />
                  ) : null}
                  {skill.name}
                </Badge>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
