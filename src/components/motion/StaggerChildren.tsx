'use client'

import { motion, useReducedMotion } from 'framer-motion'

type StaggerChildrenProps = {
  children: React.ReactNode
  className?: string
  /** Délai entre enfants (s). */
  stagger?: number
  delay?: number
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

export const staggerItem = {
  hidden: { opacity: 0, y: 36, filter: 'blur(10px)', scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    scale: 1,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  },
}

/**
 * Conteneur de stagger au scroll — enfants wrappés dans `motion.div variants={staggerItem}`.
 */
export function StaggerChildren({
  children,
  className,
  stagger = 0.12,
  delay = 0.05,
}: StaggerChildrenProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      variants={container(stagger, delay)}
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -60px 0px' }}
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
