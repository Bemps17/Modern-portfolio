'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'

import { SITE_IMAGES } from '@/lib/site-images'

const BLOBS = [
  {
    className: 'left-[-14%] top-[0%] h-[44vw] w-[44vw] animate-[blob-float-1_30s_ease-in-out_infinite]',
    color: 'rgba(255, 107, 26, 0.09)',
  },
  {
    className: 'right-[-12%] top-[32%] h-[38vw] w-[38vw] animate-[blob-float-2_34s_ease-in-out_infinite]',
    color: 'rgba(153, 27, 27, 0.07)',
  },
] as const

const GRID_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath d='M48 0H0V48' fill='none' stroke='rgba(255,255,255,0.18)' stroke-width='1'/%3E%3C/svg%3E")`

/**
 * Parallax fond Mars — v2
 * - Pas de spring (source de lag / rubber-band)
 * - Couche largement oversized (pas de bandes vides)
 * - Transform direct scroll → y + scale léger
 * - Actif dès que reduced-motion est off (pas seulement desktop)
 */
export function BackgroundLayers() {
  const reduceMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const { scrollY } = useScroll()
  // Image monte plus lentement que le contenu → sensation de profondeur.
  const y = useTransform(scrollY, [0, 2800], [0, 160])
  const scale = useTransform(scrollY, [0, 2800], [1.12, 1.2])

  const parallaxOn = mounted && !reduceMotion

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[var(--background)]" />

      <motion.div
        className="absolute inset-x-0 will-change-transform"
        style={{
          // Oversized : ±20–25 % pour absorber le translate max (~160px)
          top: '-22%',
          height: '144%',
          y: parallaxOn ? y : 0,
          scale: parallaxOn ? scale : 1.12,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className="h-full w-full object-cover object-[68%_center] saturate-[0.88] contrast-[1.04]"
          decoding="async"
          fetchPriority="low"
          src={SITE_IMAGES.backgrounds.marsHighway}
        />
      </motion.div>

      {/* Voiles — lisibilité sans étouffer le parallax */}
      <div className="absolute inset-0 bg-[var(--background)]/68" />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/50 via-transparent to-[var(--background)]/90" />

      <div className="absolute inset-0">
        {BLOBS.map((blob) => (
          <div
            className={`absolute rounded-full blur-3xl motion-reduce:animate-none ${blob.className}`}
            key={blob.className}
            style={{ background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)` }}
          />
        ))}
      </div>

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: GRID_SVG, backgroundSize: '48px 48px' }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 50%, transparent 50%, rgba(0, 0, 0, 0.55) 100%)',
        }}
      />
    </div>
  )
}
