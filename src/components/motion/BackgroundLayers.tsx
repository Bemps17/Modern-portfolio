'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

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
 * Parallax fond Mars — v3
 * - Voile allégé pour que le mouvement se voie vraiment
 * - Amplitude liée au progrès de page (0→1), pas à un plafond px arbitraire
 * - Image oversized + translate opposé au contenu (profondeur)
 * - Pas de spring (évite lag / rubber-band)
 */
export function BackgroundLayers() {
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  // Contenu monte → le fond descend plus lentement = profondeur lisible.
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '22%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1.18, 1.32])

  // null au SSR / avant hydratation → pas de parallax (évite mismatch).
  const parallaxOn = reduceMotion === false

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[var(--background)]" />

      <motion.div
        className="absolute inset-x-0 will-change-transform"
        style={{
          // Oversized : absorbe translate ±22 % + scale 1.32
          top: '-28%',
          height: '156%',
          y: parallaxOn ? y : 0,
          scale: parallaxOn ? scale : 1.18,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className="h-full w-full object-cover object-[62%_center] saturate-[0.92] contrast-[1.06]"
          decoding="async"
          fetchPriority="low"
          src={SITE_IMAGES.backgrounds.marsHighway}
        />
      </motion.div>

      {/* Voile allégé — lisibilité OK, parallax encore perceptible */}
      <div className="absolute inset-0 bg-[var(--background)]/48" />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/40 via-transparent to-[var(--background)]/82" />

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
            'radial-gradient(130% 90% at 50% 50%, transparent 48%, rgba(0, 0, 0, 0.5) 100%)',
        }}
      />
    </div>
  )
}
