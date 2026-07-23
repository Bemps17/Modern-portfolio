import { Badge } from '@/components/ui/Badge'
import type { Skill } from '@/payload-types'

type SoftSkillsStripProps = {
  skills: Skill[]
}

export function SoftSkillsStrip({ skills }: SoftSkillsStripProps) {
  if (!skills.length) return null

  return (
    <div className="rounded-2xl readable-surface-strong p-6 sm:p-8">
      <p className="mb-4 font-[family-name:var(--font-space-grotesk)] text-xs tracking-[0.18em] text-[var(--muted)] uppercase">
        Soft skills
      </p>
      <div className="flex flex-wrap gap-2.5">
        {skills.map((skill) => (
          <Badge
            className="border-[color:var(--accent)]/25 bg-[var(--accent)]/12 text-[var(--foreground)]"
            key={skill.id}
          >
            {skill.name}
          </Badge>
        ))}
      </div>
    </div>
  )
}
