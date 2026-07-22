'use client'

import { motion, useReducedMotion } from 'framer-motion'

type StaggerChildrenProps = {
  children: React.ReactNode
  className?: string
  /** Délai entre enfants (s). */
  stagger?: number
  delay?: number
  /**
   * `mount` — anime dès le rendu (listes longues / pages projets).
   * `view` — anime au scroll (sections courtes).
   */
  mode?: 'mount' | 'view'
}

const container = (stagger: number, delay: number) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
})

/** Pas de `filter: blur` — trop coûteux sur de longues grilles. */
export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
}

/**
 * Conteneur de stagger — enfants wrappés dans `StaggerItem`.
 * Important : en `view`, une grille très haute peut ne jamais atteindre
 * `amount` → cartes restées invisibles. Préférer `mount` pour /projets.
 */
export function StaggerChildren({
  children,
  className,
  stagger = 0.06,
  delay = 0.02,
  mode = 'mount',
}: StaggerChildrenProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  if (mode === 'mount') {
    return (
      <motion.div
        animate="show"
        className={className}
        initial="hidden"
        variants={container(stagger, delay)}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      variants={container(stagger, delay)}
      viewport={{ once: true, amount: 0.05, margin: '0px 0px -40px 0px' }}
      whileInView="show"
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const reduceMotion = useReducedMotion()
  if (reduceMotion) return <div className={className}>{children}</div>
  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  )
}
