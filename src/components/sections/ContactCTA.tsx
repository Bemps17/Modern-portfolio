import { AvailabilityBadge, type AvailabilityStatus } from '@/components/ui/AvailabilityBadge'
import { Button } from '@/components/ui/Button'
import { FadeInWhenVisible } from '@/components/motion/FadeInWhenVisible'
import { SectionTitle } from '@/components/ui/SectionTitle'

type ContactCTAProps = {
  availability?: AvailabilityStatus | null
  availabilityLabel?: string | null
  location?: string | null
  email?: string | null
}

export function ContactCTA({ availability, availabilityLabel, location, email }: ContactCTAProps) {
  return (
    <section className="px-6 pb-20 xl:px-16">
      <FadeInWhenVisible>
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-transparent p-8 sm:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[var(--accent)]/15 blur-3xl"
          />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <AvailabilityBadge label={availabilityLabel} status={availability} />
              <SectionTitle
                subtitle={
                  location?.trim() ||
                  'Un projet, une collab, une opportunité — parlons-en clairement.'
                }
                title="Travaillons ensemble"
              />
              {email ? (
                <a
                  className="inline-block font-[family-name:var(--font-space-grotesk)] text-sm tracking-wide text-[var(--muted)] underline-offset-4 transition hover:text-white hover:underline"
                  href={`mailto:${email}`}
                >
                  {email}
                </a>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/contact">Me contacter</Button>
              <Button href="/projets" variant="glass">
                Voir les projets
              </Button>
            </div>
          </div>
        </div>
      </FadeInWhenVisible>
    </section>
  )
}
