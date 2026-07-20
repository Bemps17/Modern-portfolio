'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'

type OdometerProps = {
  value: number
  suffix?: string
}

function DigitColumn({ digit, active }: { digit: number; active: boolean }) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <span>{digit}</span>
  }

  return (
    <span className="relative inline-block h-[1em] w-[0.62em] overflow-hidden align-bottom">
      <motion.span
        animate={{ y: active ? `-${digit * 10}%` : 0 }}
        className="absolute inset-x-0 top-0 flex flex-col"
        initial={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      >
        {Array.from({ length: 10 }, (_, index) => (
          <span className="flex h-[1em] items-center justify-center" key={index}>
            {index}
          </span>
        ))}
      </motion.span>
    </span>
  )
}

export function Odometer({ value, suffix = '' }: OdometerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const [active, setActive] = useState(false)
  const digits = useMemo(() => String(value).split('').map(Number), [value])

  useEffect(() => {
    if (!inView) return
    const timer = window.setTimeout(() => setActive(true), 120)
    return () => window.clearTimeout(timer)
  }, [inView])

  return (
    <span
      className="inline-flex items-baseline font-[family-name:var(--font-space-grotesk)] text-4xl font-bold tabular-nums text-[var(--accent-soft)] sm:text-5xl"
      ref={ref}
    >
      {digits.map((digit, index) => (
        <DigitColumn active={active} digit={digit} key={`${index}-${digit}`} />
      ))}
      {suffix ? <span className="ml-0.5 text-[0.72em]">{suffix}</span> : null}
    </span>
  )
}
