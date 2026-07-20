import Image from 'next/image'

import { Badge } from '@/components/ui/Badge'
import type { Media, Skill } from '@/payload-types'

type SkillBadgeListProps = {
  skills: Skill[]
}

function mediaUrl(media: number | Media | null | undefined): string | null {
  if (!media || typeof media === 'number') return null
  return media.url ?? null
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
              const iconUrl = mediaUrl(skill.icon)
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
