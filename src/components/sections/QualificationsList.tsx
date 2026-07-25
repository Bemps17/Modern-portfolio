import { GraduationCap } from 'lucide-react'

import { IconLabel } from '@/components/ui/IconLabel'
import type { Qualification } from '@/payload-types'

type QualificationsListProps = {
  qualifications: Qualification[]
}

export function QualificationsList({ qualifications }: QualificationsListProps) {
  if (!qualifications.length) return null

  return (
    <ol className="relative space-y-6 border-l border-white/10 pl-6">
      {qualifications.map((qualification) => (
        <li className="relative" key={qualification.id}>
          <span className="absolute top-1.5 -left-[1.7rem] h-3 w-3 rounded-full bg-[var(--accent)]" />
          <IconLabel
            className="font-[family-name:var(--font-space-grotesk)] text-xs tracking-wide text-[var(--muted)] uppercase"
            icon={GraduationCap}
          >
            {qualification.year}
          </IconLabel>
          <h3 className="mt-2 font-[family-name:var(--font-syne)] text-xl font-semibold">{qualification.title}</h3>
          {qualification.institution?.trim() ? (
            <IconLabel className="mt-1 text-sm text-[var(--accent-soft)]" icon={GraduationCap}>
              {qualification.institution}
            </IconLabel>
          ) : null}
        </li>
      ))}
    </ol>
  )
}
