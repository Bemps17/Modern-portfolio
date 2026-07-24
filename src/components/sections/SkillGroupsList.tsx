type SkillGroup = {
  title: string
  items: string
  id?: string | number | null
}

type SkillGroupsListProps = {
  groups: SkillGroup[]
}

/** Blocs compétences éditoriaux (Catégorie : liste). */
export function SkillGroupsList({ groups }: SkillGroupsListProps) {
  if (!groups.length) return null

  return (
    <ul className="space-y-3">
      {groups.map((group, index) => (
        <li
          className="text-base leading-relaxed text-[var(--foreground-secondary)]"
          key={group.id ?? `${group.title}-${index}`}
        >
          <span className="font-[family-name:var(--font-syne)] font-semibold text-[var(--foreground)]">
            {group.title}
          </span>
          <span className="text-[var(--muted)]"> : </span>
          <span>{group.items}</span>
        </li>
      ))}
    </ul>
  )
}
