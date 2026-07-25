'use client'

import { AnimatePresence, motion } from 'framer-motion'

import type { LaunchPhase } from './constants'

type LaunchEffectsProps = {
  phase: LaunchPhase
  countdown: number | null
}

const SMOKE_PARTICLES = [
  { id: 'a', x: -18, delay: 0 },
  { id: 'b', x: 8, delay: 0.15 },
  { id: 'c', x: 22, delay: 0.28 },
  { id: 'd', x: -6, delay: 0.42 },
] as const

export function LaunchEffects({ phase, countdown }: LaunchEffectsProps) {
  const showCountdown = phase === 'countdown' && countdown !== null
  const showPreIgnition = phase === 'countdown' || phase === 'ignition'
  const showLiftoff = phase === 'liftoff'

  return (
    <>
      <AnimatePresence>
        {showCountdown ? (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="starship-countdown-ring"
            exit={{ opacity: 0, scale: 1.25 }}
            initial={{ opacity: 0, scale: 0.7 }}
            key={countdown}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <span aria-hidden className="starship-countdown-ring__pulse" />
            <span className="font-[family-name:var(--font-syne)] text-6xl font-bold tabular-nums text-[var(--accent-soft)]">
              {countdown}
            </span>
            <span className="mt-1 font-[family-name:var(--font-space-grotesk)] text-[10px] tracking-[0.22em] text-[var(--muted)] uppercase">
              T−{countdown}
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'ignition' ? (
          <motion.div
            animate={{ opacity: [0, 0.38, 0] }}
            className="pointer-events-none absolute inset-0 z-[15] rounded-[1.25rem] bg-[var(--accent)]"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        ) : null}
      </AnimatePresence>

      {showPreIgnition ? (
        <div aria-hidden className="pointer-events-none absolute -bottom-2 left-1/2 z-0 -translate-x-1/2">
          {SMOKE_PARTICLES.map((particle) => (
            <motion.span
              animate={{ y: [-4, -28], opacity: [0, 0.45, 0], scale: [0.6, 1.1, 0.8] }}
              className="absolute bottom-0 h-2 w-2 rounded-full bg-white/35 blur-[1px]"
              key={particle.id}
              style={{ left: `calc(50% + ${particle.x}px)` }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                delay: particle.delay,
                ease: 'easeOut',
              }}
            />
          ))}
          <motion.div
            animate={{ opacity: [0.25, 0.55, 0.35], scaleX: [0.5, 0.95, 0.75], scaleY: [0.25, 0.75, 0.55] }}
            className="h-24 w-24 rounded-full bg-gradient-to-t from-white/60 via-[var(--accent-soft)]/45 to-transparent blur-2xl"
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      ) : null}

      {showLiftoff ? (
        <div aria-hidden className="pointer-events-none absolute -bottom-8 left-1/2 z-0 flex -translate-x-1/2 flex-col items-center">
          <motion.div
            animate={{ opacity: [0.95, 1, 0.8], scaleY: [0.85, 1.6, 2.4], scaleX: [0.9, 1.15, 1.35] }}
            className="h-20 w-5 rounded-full bg-gradient-to-t from-white via-[var(--accent-soft)] to-transparent blur-[1px]"
            initial={{ opacity: 0, scaleY: 0.6 }}
            transition={{ duration: 2.2, ease: 'easeOut' }}
          />
          <motion.div
            animate={{ opacity: [0.85, 0.95, 0.7], scaleY: [0.9, 1.8, 2.8], scaleX: [1, 1.45, 1.85] }}
            className="-mt-14 h-32 w-10 rounded-full bg-gradient-to-t from-[var(--accent)] via-[var(--accent-soft)]/80 to-transparent blur-md"
            initial={{ opacity: 0, scaleY: 0.7 }}
            transition={{ duration: 2.2, ease: 'easeOut' }}
          />
          <motion.div
            animate={{ opacity: [0.5, 0.75, 0.45], scaleY: [1, 2.2, 3], scaleX: [1.1, 1.8, 2.4] }}
            className="-mt-24 h-40 w-16 rounded-full bg-gradient-to-t from-white/25 via-white/10 to-transparent blur-2xl"
            initial={{ opacity: 0, scaleY: 0.8 }}
            transition={{ duration: 2.2, ease: 'easeOut' }}
          />
        </div>
      ) : null}
    </>
  )
}
