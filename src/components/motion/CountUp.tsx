'use client'

import { animate, motion, useInView, useMotionValue, useReducedMotion } from 'framer-motion'
import { useEffect, useRef } from 'react'

type CountUpProps = {
  value: number
  suffix?: string
  duration?: number
}

export function CountUp({ value, suffix = '', duration = 1.2 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const motionValue = useMotionValue(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!inView) return

    if (reduceMotion) {
      if (ref.current) ref.current.textContent = `${value}${suffix}`
      return
    }

    const controls = animate(motionValue, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (latest) => {
        if (ref.current) ref.current.textContent = `${Math.round(latest)}${suffix}`
      },
    })

    return () => controls.stop()
  }, [duration, inView, motionValue, reduceMotion, suffix, value])

  return (
    <motion.span
      className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold tabular-nums text-[var(--accent-soft)] sm:text-5xl"
      ref={ref}
    >
      0{suffix}
    </motion.span>
  )
}
