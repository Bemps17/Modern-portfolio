import type { ReactNode } from 'react'

import { Container } from '@/components/ui/Container'
import { ReadableSurface } from '@/components/ui/ReadableSurface'
import { SectionTitle } from '@/components/ui/SectionTitle'

type LegalPageShellProps = {
  title: string
  eyebrow: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}

export function LegalPageShell({ title, eyebrow, subtitle, children, footer }: LegalPageShellProps) {
  return (
    <Container className="py-12 sm:py-16">
      <ReadableSurface className="max-w-3xl" strong>
        <SectionTitle eyebrow={eyebrow} subtitle={subtitle} title={title} />
        <div className="legal-prose space-y-8 text-[var(--foreground-secondary)]">{children}</div>
        {footer ? <div className="mt-12 border-t border-[color:var(--border-subtle)] pt-8">{footer}</div> : null}
      </ReadableSurface>
    </Container>
  )
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 font-[family-name:var(--font-syne)] text-xl font-semibold text-[var(--foreground)]">
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-relaxed sm:text-base">{children}</div>
    </section>
  )
}

export function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-[var(--accent-soft)]">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}
