import { Layers } from 'lucide-react'

import { IconLabel } from '@/components/ui/IconLabel'

type SkillGroup = {
  title: string
  items: string
  id?: string | number | null
}

type SkillGroupsListProps = {
  groups: SkillGroup[]
}

function parseItems(items: string): string[] {
  return items
    .split(/\n|•|;/)
    .map((line) => line.trim())
    .filter(Boolean)
}

/** Blocs compétences éditoriaux — catégorie + lignes détaillées. */
export function SkillGroupsList({ groups }: SkillGroupsListProps) {
  if (!groups.length) return null

  return (
    <ul className="space-y-8">
      {groups.map((group, index) => {
        const lines = parseItems(group.items)
        return (
          <li key={group.id ?? `${group.title}-${index}`}>
            <IconLabel
              className="font-[family-name:var(--font-space-grotesk)] text-sm tracking-[0.18em] text-[var(--muted)] uppercase"
              icon={Layers}
            >
              {group.title}
            </IconLabel>
            {lines.length > 1 ? (
              <ul className="mt-3 space-y-2 border-l border-[color:var(--border-subtle)] pl-4">
                {lines.map((line) => (
                  <li
                    className="text-base leading-relaxed text-[var(--foreground-secondary)]"
                    key={line}
                  >
                    {line.includes(' : ') ? (
                      <>
                        <span className="font-[family-name:var(--font-syne)] font-semibold text-[var(--foreground)]">
                          {line.slice(0, line.indexOf(' : '))}
                        </span>
                        <span className="text-[var(--muted)]"> : </span>
                        <span>{line.slice(line.indexOf(' : ') + 3)}</span>
                      </>
                    ) : (
                      line
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-base leading-relaxed text-[var(--foreground-secondary)]">
                {group.items}
              </p>
            )}
          </li>
        )
      })}
    </ul>
  )
}
