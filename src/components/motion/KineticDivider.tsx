'use client'

import { motion, useReducedMotion } from 'framer-motion'

import { cn } from '@/lib/utils'

type KineticDividerProps = {
  className?: string
}

/**
 * Séparateur léger — pas de useScroll (évite les listeners coûteux en chaîne).
 */
export function KineticDivider({ className }: KineticDividerProps) {
  const reduceMotion = useReducedMotion()

  return (
    <div className={cn('relative py-10', className)}>
      <div className="relative h-px overflow-hidden">
        <motion.div
          className="absolute inset-0 origin-left bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent"
          initial={reduceMotion ? false : { scaleX: 0, opacity: 0.35 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.6 }}
          whileInView={reduceMotion ? undefined : { scaleX: 1, opacity: 1 }}
        />
      </div>
    </div>
  )
}
