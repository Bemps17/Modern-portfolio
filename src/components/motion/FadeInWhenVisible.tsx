'use client'

import { motion, useReducedMotion } from 'framer-motion'

type FadeInWhenVisibleProps = {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function FadeInWhenVisible({ children, className, delay = 0 }: FadeInWhenVisibleProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.2 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  )
}
