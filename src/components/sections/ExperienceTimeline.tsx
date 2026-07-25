import { Building2, Calendar } from 'lucide-react'

import { IconLabel } from '@/components/ui/IconLabel'
import type { Experience } from '@/payload-types'

type ExperienceTimelineProps = {
  experiences: Experience[]
}

function formatDate(value?: string | null) {
  if (!value) return null
  return new Intl.DateTimeFormat('fr-FR', { month: 'short', year: 'numeric' }).format(new Date(value))
}

export function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  if (!experiences.length) return null

  return (
    <ol className="experience-timeline">
      {experiences.map((experience) => {
        const start = formatDate(experience.dateStart)
        const end = experience.current ? 'Présent' : formatDate(experience.dateEnd)
        return (
          <li className="experience-timeline__item" key={experience.id}>
            <div aria-hidden className="experience-timeline__track">
              <span className="experience-timeline__marker" />
            </div>
            <div className="experience-timeline__content">
              <IconLabel
                className="font-[family-name:var(--font-space-grotesk)] text-xs tracking-wide text-[var(--muted)] uppercase"
                icon={Calendar}
              >
                {start} — {end}
              </IconLabel>
              <h3 className="mt-2 font-[family-name:var(--font-syne)] text-xl font-semibold">{experience.title}</h3>
              <IconLabel className="mt-1 text-sm text-[var(--accent-soft)]" icon={Building2}>
                {experience.company}
              </IconLabel>
              <p className="mt-2 text-sm text-[var(--foreground-secondary)]">{experience.description}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
