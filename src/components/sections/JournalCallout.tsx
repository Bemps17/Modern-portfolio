type JournalCalloutProps = {
  variant: 'info' | 'warning' | 'tip'
  body: string
}

const VARIANT_LABELS: Record<JournalCalloutProps['variant'], string> = {
  info: 'Info',
  warning: 'Attention',
  tip: 'Astuce',
}

export function JournalCallout({ variant, body }: JournalCalloutProps) {
  const label = VARIANT_LABELS[variant] ?? 'Info'
  return (
    <aside
      aria-label={label}
      className={`lablog-callout lablog-callout--${variant}`}
      role="note"
    >
      <p className="lablog-callout__label">{label}</p>
      <p className="lablog-callout__body">{body}</p>
    </aside>
  )
}
