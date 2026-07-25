import { Lightbulb } from 'lucide-react'

import { GlassCard } from '@/components/ui/GlassCard'
import { IconLabel } from '@/components/ui/IconLabel'

export type PersonalProject = {
  title: string
  description: string
  id?: string | number | null
}

type PersonalProjectsListProps = {
  projects: PersonalProject[]
}

export function PersonalProjectsList({ projects }: PersonalProjectsListProps) {
  if (!projects.length) return null

  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {projects.map((project, index) => (
        <li key={project.id ?? `${project.title}-${index}`}>
          <GlassCard className="h-full p-6">
            <IconLabel
              className="font-[family-name:var(--font-syne)] text-xl font-semibold text-[var(--foreground)]"
              icon={Lightbulb}
              iconClassName="bg-[var(--accent)]/20"
            >
              {project.title}
            </IconLabel>
            <p className="mt-2 text-sm leading-relaxed text-[var(--foreground-secondary)]">{project.description}</p>
          </GlassCard>
        </li>
      ))}
    </ul>
  )
}
