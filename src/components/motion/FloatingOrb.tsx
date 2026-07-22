'use client'

import { motion, useReducedMotion } from 'framer-motion'

/**
 * Orbe de glow animé — ambiance fun pour CTA / hero.
 */
export function FloatingOrb({
  className,
  delay = 0,
}: {
  className?: string
  delay?: number
}) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div aria-hidden className={className} />
  }

  return (
    <motion.div
      animate={{
        x: [0, 24, -12, 0],
        y: [0, -18, 10, 0],
        scale: [1, 1.12, 0.94, 1],
        opacity: [0.55, 0.85, 0.5, 0.55],
      }}
      aria-hidden
      className={className}
      transition={{
        duration: 10,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}
