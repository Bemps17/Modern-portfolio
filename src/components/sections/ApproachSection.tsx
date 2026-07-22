import { FadeInWhenVisible } from '@/components/motion/FadeInWhenVisible'
import { GlassCard } from '@/components/ui/GlassCard'
import { SectionTitle } from '@/components/ui/SectionTitle'

export type ApproachStep = {
  title: string
  description: string
  id?: string | number | null
}

type ApproachSectionProps = {
  steps: ApproachStep[]
}

export function ApproachSection({ steps }: ApproachSectionProps) {
  if (!steps.length) return null

  return (
    <section className="px-6 py-20 xl:px-16">
      <FadeInWhenVisible>
        <SectionTitle
          editorial
          eyebrow="Méthode"
          subtitle="Du cadrage au ship — précision, rythme, impact."
          title="Comment je construis"
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <GlassCard className="relative overflow-hidden p-6" key={step.id ?? `${step.title}-${index}`}>
              <span
                aria-hidden
                className="font-[family-name:var(--font-space-grotesk)] text-xs tracking-[0.2em] text-[var(--accent-soft)] uppercase"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 font-[family-name:var(--font-syne)] text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{step.description}</p>
            </GlassCard>
          ))}
        </div>
      </FadeInWhenVisible>
    </section>
  )
}
