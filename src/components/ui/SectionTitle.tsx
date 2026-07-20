import { cn } from '@/lib/utils'

type SectionTitleProps = {
  title: string
  subtitle?: string
  className?: string
  eyebrow?: string
}

export function SectionTitle({ title, subtitle, className, eyebrow }: SectionTitleProps) {
  return (
    <div className={cn('mb-10 max-w-2xl', className)}>
      {eyebrow ? (
        <p className="mb-3 font-[family-name:var(--font-space-grotesk)] text-xs tracking-[0.2em] text-[var(--muted)] uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {subtitle ? <p className="mt-3 text-base text-[var(--muted)] sm:text-lg">{subtitle}</p> : null}
    </div>
  )
}
