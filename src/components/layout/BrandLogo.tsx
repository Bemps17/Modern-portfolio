'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

type BrandLogoProps = {
  siteName: string
  className?: string
}

export function BrandLogo({ siteName, className }: BrandLogoProps) {
  const [clicks, setClicks] = useState(0)
  const [party, setParty] = useState(false)
  const reduceMotion = useReducedMotion()

  const onClick = () => {
    const next = clicks + 1
    setClicks(next)
    if (next >= 5) {
      setParty(true)
      window.setTimeout(() => {
        setParty(false)
        setClicks(0)
      }, 1800)
    }
  }

  return (
    <Link
      className={className}
      data-cursor="link"
      href="/"
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        onClick()
      }}
    >
      <motion.span
        animate={
          party && !reduceMotion
            ? { rotate: [0, -8, 8, -4, 4, 0], scale: [1, 1.12, 1] }
            : { rotate: 0, scale: 1 }
        }
        className="inline-flex items-center gap-3"
        transition={{ duration: 0.5 }}
      >
        <Image
          alt=""
          className="rounded-lg ring-1 ring-[color:var(--accent)]/30"
          height={32}
          src="/brand/favicon.png"
          width={32}
        />
        <span className={party ? 'text-[var(--accent-soft)]' : undefined}>{siteName}</span>
      </motion.span>
    </Link>
  )
}
