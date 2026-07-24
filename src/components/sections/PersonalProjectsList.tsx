import { GlassCard } from '@/components/ui/GlassCard'

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
            <h3 className="font-[family-name:var(--font-syne)] text-xl font-semibold">{project.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--foreground-secondary)]">{project.description}</p>
          </GlassCard>
        </li>
      ))}
    </ul>
  )
}
