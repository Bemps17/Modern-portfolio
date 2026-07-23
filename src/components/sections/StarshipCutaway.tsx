'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Rocket } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { PROJECT_CUTAWAY_STEPS, type CutawayStep } from '@/lib/project-cutaway'
import { cn } from '@/lib/utils'

type StarshipCutawayProps = {
  subtitle?: string | null
}

const LAYER_SPREAD = 22
const STROKE = 'rgb(232 238 247 / 0.94)'
const STROKE_DIM = 'rgb(232 238 247 / 0.38)'

const SLICE_BOUNDS = [
  { y: 28, h: 72 },
  { y: 100, h: 76 },
  { y: 176, h: 76 },
  { y: 252, h: 76 },
  { y: 328, h: 148 },
] as const

type RocketSliceProps = {
  index: number
  activeStage: number
  isLaunching: boolean
  isActive: boolean
  onSelect: (index: number) => void
  children: React.ReactNode
}

function RocketSlice({
  index,
  activeStage,
  isLaunching,
  isActive,
  onSelect,
  children,
}: RocketSliceProps) {
  const spread = activeStage >= index ? index * LAYER_SPREAD : 0
  const bounds = SLICE_BOUNDS[index]

  return (
    <motion.g
      animate={
        isLaunching
          ? { y: -560 - index * 32, opacity: 0 }
          : { y: spread, opacity: 1 }
      }
      aria-label={`Étage ${index + 1} : ${PROJECT_CUTAWAY_STEPS[index]?.title}`}
      onClick={() => onSelect(index)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(index)
        }
      }}
      role="button"
      style={{ cursor: 'pointer' }}
      tabIndex={0}
      transition={
        isLaunching
          ? { duration: 1.15, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }
          : { type: 'spring', stiffness: 260, damping: 20 }
      }
    >
      <rect
        fill={isActive ? 'rgb(255 107 26 / 0.16)' : 'transparent'}
        height={bounds.h}
        rx="2"
        stroke={isActive ? 'var(--accent)' : 'transparent'}
        strokeOpacity={0.75}
        width={72}
        x="104"
        y={bounds.y}
      />
      {children}
    </motion.g>
  )
}

/** Fusée classique type Ariane 5 / Tintin — ogive, étages empilés, boosters latéraux. */
function ClassicRocketSvg({
  activeStage,
  isLaunching,
  onSelect,
}: {
  activeStage: number
  isLaunching: boolean
  onSelect: (index: number) => void
}) {
  const stroke = (index: number) => (activeStage === index ? 'var(--accent-soft)' : STROKE)

  return (
    <svg aria-label="Fusée classique interactive" className="mx-auto h-auto w-full max-h-[min(52vh,420px)]" viewBox="0 0 280 500">
      <defs>
        <clipPath id="rocket-cutaway-interior">
          <rect height="460" width="72" x="140" y="20" />
        </clipPath>
      </defs>

      {/* Boosters latéraux (Ariane) — statiques, s'illuminent à l'étape 5 */}
      <g opacity={activeStage === 4 ? 1 : 0.55}>
        <path
          d="M52 300 L88 292 L92 430 L48 438 Z"
          fill="none"
          stroke={activeStage === 4 ? 'var(--accent-soft)' : STROKE_DIM}
          strokeWidth="1.2"
        />
        <path
          d="M228 300 L192 292 L188 430 L232 438 Z"
          fill="none"
          stroke={activeStage === 4 ? 'var(--accent-soft)' : STROKE_DIM}
          strokeWidth="1.2"
        />
        <path d="M60 420 L80 416 M200 420 L220 416" stroke={STROKE_DIM} strokeWidth="0.8" />
      </g>

      {/* Socle de lancement */}
      <path d="M88 468 H192 L184 492 H96 Z" fill="none" stroke={STROKE_DIM} strokeWidth="1" />

      <RocketSlice
        activeStage={activeStage}
        index={0}
        isActive={activeStage === 0}
        isLaunching={isLaunching}
        onSelect={onSelect}
      >
        <path
          d="M140 32 L168 100 H112 Z"
          fill="none"
          stroke={stroke(0)}
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path d="M112 100 H168" stroke={STROKE} strokeWidth="1" />
        <g clipPath="url(#rocket-cutaway-interior)">
          <path d="M148 52 L188 78" stroke={STROKE_DIM} strokeWidth="0.7" />
        </g>
      </RocketSlice>

      <RocketSlice
        activeStage={activeStage}
        index={1}
        isActive={activeStage === 1}
        isLaunching={isLaunching}
        onSelect={onSelect}
      >
        <rect fill="none" height="76" stroke={stroke(1)} strokeWidth="1.5" width="56" x="112" y="100" />
        <circle cx="124" cy="128" fill="none" r="5" stroke={STROKE_DIM} strokeWidth="0.8" />
        <circle cx="140" cy="128" fill="none" r="5" stroke={STROKE_DIM} strokeWidth="0.8" />
        <circle cx="156" cy="128" fill="none" r="5" stroke={STROKE_DIM} strokeWidth="0.8" />
        <g clipPath="url(#rocket-cutaway-interior)">
          <rect fill="none" height="20" stroke={STROKE_DIM} strokeWidth="0.7" width="36" x="152" y="118" />
        </g>
      </RocketSlice>

      <RocketSlice
        activeStage={activeStage}
        index={2}
        isActive={activeStage === 2}
        isLaunching={isLaunching}
        onSelect={onSelect}
      >
        <rect fill="none" height="76" stroke={stroke(2)} strokeWidth="1.5" width="56" x="112" y="176" />
        <path d="M118 196 H162 M118 216 H162 M118 236 H162" stroke={STROKE_DIM} strokeWidth="0.6" />
        <g clipPath="url(#rocket-cutaway-interior)">
          <ellipse cx="176" cy="206" fill="none" rx="28" ry="10" stroke={STROKE} strokeWidth="0.8" />
          <ellipse cx="176" cy="232" fill="none" rx="28" ry="10" stroke={STROKE} strokeWidth="0.8" />
        </g>
      </RocketSlice>

      <RocketSlice
        activeStage={activeStage}
        index={3}
        isActive={activeStage === 3}
        isLaunching={isLaunching}
        onSelect={onSelect}
      >
        <rect fill="none" height="76" stroke={stroke(3)} strokeWidth="1.5" width="56" x="112" y="252" />
        <g clipPath="url(#rocket-cutaway-interior)">
          <circle cx="162" cy="286" fill="none" r="8" stroke={STROKE} strokeWidth="0.9" />
          <circle cx="184" cy="286" fill="none" r="8" stroke={STROKE} strokeWidth="0.9" />
          <circle cx="206" cy="286" fill="none" r="8" stroke={STROKE} strokeWidth="0.9" />
        </g>
      </RocketSlice>

      <RocketSlice
        activeStage={activeStage}
        index={4}
        isActive={activeStage === 4}
        isLaunching={isLaunching}
        onSelect={onSelect}
      >
        <path
          d="M112 328 H168 L160 420 H120 Z"
          fill="none"
          stroke={stroke(4)}
          strokeWidth="1.5"
        />
        <path d="M96 400 L112 328 L112 408 Z M184 400 L168 328 L168 408 Z" fill="none" stroke={stroke(4)} strokeWidth="1" />
        <path d="M128 448 L140 468 L152 448 Z" fill="none" stroke={STROKE} strokeWidth="1" />
      </RocketSlice>

      <line stroke={STROKE_DIM} strokeDasharray="3 3" strokeWidth="0.8" x1="140" x2="140" y1="28" y2="468" />

      <g fontFamily="var(--font-space-grotesk), monospace" fontSize="7.5" letterSpacing="0.1em">
        <text fill={STROKE_DIM} x="196" y="36">
          ARIANE-TYPE
        </text>
        <text fill={STROKE_DIM} x="196" y="50">
          CUTAWAY 1:50
        </text>
      </g>
    </svg>
  )
}

function StageDetailCard({ step, className }: { step: CutawayStep; className?: string }) {
  return (
    <div className={cn('rounded-xl border border-[color:var(--accent)]/30 bg-[rgb(8_18_36_/_0.9)] p-4 backdrop-blur-sm', className)}>
      <p className="font-[family-name:var(--font-space-grotesk)] text-[10px] tracking-[0.2em] text-[var(--accent-soft)] uppercase">
        {step.blueprintTag}
      </p>
      <p className="mt-2 font-[family-name:var(--font-syne)] text-lg font-semibold leading-tight text-[var(--foreground)]">
        {step.title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-[var(--foreground-secondary)]">{step.description}</p>
    </div>
  )
}

function MobileStageTabs({
  steps,
  activeStage,
  onSelect,
}: {
  steps: CutawayStep[]
  activeStage: number
  onSelect: (index: number) => void
}) {
  return (
    <div className="flex w-full gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {steps.map((step, index) => (
        <button
          className={cn(
            'min-w-[calc(50%-0.25rem)] shrink-0 snap-start rounded-lg border px-3 py-2.5 text-left transition sm:min-w-[42%]',
            activeStage === index
              ? 'border-[color:var(--accent)]/55 bg-[var(--accent)]/12'
              : 'border-[color:var(--border)] bg-[rgb(8_18_36_/_0.65)]',
          )}
          key={step.id}
          onClick={() => onSelect(index)}
          type="button"
        >
          <span className="font-[family-name:var(--font-space-grotesk)] text-[10px] tracking-[0.16em] text-[var(--accent-soft)]">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="mt-0.5 block text-sm font-medium leading-snug text-[var(--foreground)]">{step.title}</span>
        </button>
      ))}
    </div>
  )
}

function StepRail({
  steps,
  activeStage,
  onSelect,
}: {
  steps: CutawayStep[]
  activeStage: number
  onSelect: (index: number) => void
}) {
  return (
    <div className="space-y-2">
      {steps.map((step, index) => (
        <button
          className={cn(
            'flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition',
            activeStage === index
              ? 'border-[color:var(--accent)]/50 bg-[var(--accent)]/10'
              : 'border-transparent hover:border-[color:var(--border)] hover:bg-white/5',
          )}
          key={step.id}
          onClick={() => onSelect(index)}
          type="button"
        >
          <span
            className={cn(
              'mt-0.5 font-[family-name:var(--font-space-grotesk)] text-[10px] tracking-[0.2em]',
              activeStage === index ? 'text-[var(--accent-soft)]' : 'text-[var(--muted)]',
            )}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="min-w-0">
            <span className="block font-[family-name:var(--font-space-grotesk)] text-[10px] tracking-[0.14em] text-[var(--muted)] uppercase">
              {step.blueprintTag}
            </span>
            <span className="block text-sm font-medium text-[var(--foreground)]">{step.title}</span>
          </span>
        </button>
      ))}
    </div>
  )
}

export function StarshipCutaway({ subtitle }: StarshipCutawayProps) {
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const [activeStage, setActiveStage] = useState(0)
  const [isLaunching, setIsLaunching] = useState(false)

  const selectStage = useCallback((index: number) => {
    setActiveStage(index)
  }, [])

  const goPrev = useCallback(() => {
    setActiveStage((current) => Math.max(0, current - 1))
  }, [])

  const goNext = useCallback(() => {
    setActiveStage((current) => Math.min(PROJECT_CUTAWAY_STEPS.length - 1, current + 1))
  }, [])

  const handleLaunch = useCallback(() => {
    if (isLaunching) return

    if (reduceMotion) {
      router.push('/contact')
      return
    }

    setIsLaunching(true)
    window.setTimeout(() => router.push('/contact'), 1300)
  }, [isLaunching, reduceMotion, router])

  const activeStep = PROJECT_CUTAWAY_STEPS[activeStage]

  return (
    <Container as="section" className="py-12 sm:py-16 lg:py-20">
      <SectionTitle
        editorial
        eyebrow="Méthode"
        subtitle={
          subtitle ||
          'Je centre chaque projet sur vos besoins — du brief au frontend final, étape par étape.'
        }
        title="Découpez le projet"
      />

      <div className="mt-8 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[#0a1830] sm:mt-10 sm:rounded-3xl">
        <div
          className="relative px-3 py-5 sm:px-8 sm:py-10"
          style={{
            backgroundImage: 'radial-gradient(circle, rgb(255 255 255 / 0.13) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        >
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)] lg:items-start lg:gap-10">
            <div className="flex flex-col">
              <div className="relative mx-auto w-full max-w-[300px]">
                <AnimatePresence>
                  {isLaunching ? (
                    <motion.div
                      animate={{ opacity: [0, 1, 0], scaleY: [0.5, 1.8, 2.4] }}
                      className="pointer-events-none absolute bottom-2 left-1/2 z-0 h-36 w-20 -translate-x-1/2 bg-gradient-to-t from-[var(--accent)] via-[var(--accent-soft)] to-transparent blur-xl"
                      initial={{ opacity: 0 }}
                      transition={{ duration: 1.1, ease: 'easeOut' }}
                    />
                  ) : null}
                </AnimatePresence>

                <motion.div
                  animate={isLaunching ? { y: -28, opacity: 0.65 } : { y: 0, opacity: 1 }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ClassicRocketSvg
                    activeStage={activeStage}
                    isLaunching={isLaunching}
                    onSelect={selectStage}
                  />
                </motion.div>
              </div>

              <p className="mt-2 text-center font-[family-name:var(--font-space-grotesk)] text-[10px] tracking-[0.18em] text-[rgb(232_238_247_/_0.55)] uppercase">
                Touchez un étage de la fusée
              </p>

              {/* Mobile : onglets scrollables + carte fixe en dessous (pas de superposition) */}
              <div className="mt-5 space-y-3 lg:hidden">
                <div className="flex items-center gap-2">
                  <button
                    aria-label="Étape précédente"
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-[color:var(--border)] text-[var(--foreground-secondary)] disabled:opacity-40"
                    disabled={activeStage === 0}
                    onClick={goPrev}
                    type="button"
                  >
                    <ChevronLeft aria-hidden className="size-4" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <MobileStageTabs activeStage={activeStage} onSelect={selectStage} steps={PROJECT_CUTAWAY_STEPS} />
                  </div>
                  <button
                    aria-label="Étape suivante"
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-[color:var(--border)] text-[var(--foreground-secondary)] disabled:opacity-40"
                    disabled={activeStage === PROJECT_CUTAWAY_STEPS.length - 1}
                    onClick={goNext}
                    type="button"
                  >
                    <ChevronRight aria-hidden className="size-4" />
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    initial={{ opacity: 0, y: 6 }}
                    key={activeStep.id}
                    transition={{ duration: 0.2 }}
                  >
                    <StageDetailCard step={activeStep} />
                  </motion.div>
                </AnimatePresence>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <p className="text-xs text-[rgb(232_238_247_/_0.55)]">
                    Étape {activeStage + 1} / {PROJECT_CUTAWAY_STEPS.length}
                  </p>
                  <Button className="gap-2" disabled={isLaunching} onClick={handleLaunch} type="button">
                    <Rocket aria-hidden className="size-4" />
                    {isLaunching ? 'Lancement…' : 'Lancer'}
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-8 hidden space-y-5 lg:mt-0 lg:block">
              <StepRail activeStage={activeStage} onSelect={selectStage} steps={PROJECT_CUTAWAY_STEPS} />
              <AnimatePresence mode="wait">
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  initial={{ opacity: 0, y: 8 }}
                  key={activeStep.id}
                  transition={{ duration: 0.25 }}
                >
                  <StageDetailCard step={activeStep} />
                </motion.div>
              </AnimatePresence>
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-[rgb(232_238_247_/_0.55)]">
                  Étape {activeStage + 1} / {PROJECT_CUTAWAY_STEPS.length}
                </p>
                <Button className="gap-2" disabled={isLaunching} onClick={handleLaunch} type="button">
                  <Rocket aria-hidden className="size-4" />
                  {isLaunching ? 'Lancement…' : 'Lancer'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
