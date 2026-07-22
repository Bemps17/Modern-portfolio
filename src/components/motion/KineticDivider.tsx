'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

import { cn } from '@/lib/utils'

type KineticDividerProps = {
  className?: string
}

/**
 * Séparateur cinétique : ligne + pulse accent + léger parallax.
 */
export function KineticDivider({ className }: KineticDividerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const glowX = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <div className={cn('relative py-12', className)} ref={ref}>
      <div className="relative h-px overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent"
          initial={reduceMotion ? false : { scaleX: 0, opacity: 0.3 }}
          style={reduceMotion ? undefined : { transformOrigin: 'left' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.8 }}
          whileInView={reduceMotion ? undefined : { scaleX: 1, opacity: 1 }}
        />
        {!reduceMotion ? (
          <motion.span
            aria-hidden
            className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[var(--accent)] shadow-[0_0_24px_var(--accent-glow)]"
            style={{ left: glowX }}
          />
        ) : null}
      </div>
    </div>
  )
}
