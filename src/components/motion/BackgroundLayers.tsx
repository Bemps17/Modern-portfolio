'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

import { SITE_IMAGES } from '@/lib/site-images'

const BLOBS = [
  {
    className: 'left-[-12%] top-[4%] h-[46vw] w-[46vw] animate-[blob-float-1_22s_ease-in-out_infinite]',
    color: 'rgba(255, 107, 26, 0.12)',
  },
  {
    className: 'right-[-10%] top-[28%] h-[40vw] w-[40vw] animate-[blob-float-2_26s_ease-in-out_infinite]',
    color: 'rgba(153, 27, 27, 0.10)',
  },
  {
    className: 'left-[22%] bottom-[2%] h-[34vw] w-[34vw] animate-[blob-float-3_20s_ease-in-out_infinite]',
    color: 'rgba(255, 179, 71, 0.08)',
  },
] as const

const GRID_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath d='M48 0H0V48' fill='none' stroke='rgba(255,255,255,0.22)' stroke-width='1'/%3E%3C/svg%3E")`

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`

/**
 * Atmosphère unique : Mars en fond plein écran (léger), sans collage multi-photos.
 */
export function BackgroundLayers() {
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const meshY = useTransform(scrollY, [0, 1400], [0, 180])
  const marsY = useTransform(scrollY, [0, 1600], [0, 120])
  const gridY = useTransform(scrollY, [0, 1400], [0, 60])
  const parallaxEnabled = !reduceMotion

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[var(--background)]" />

      <motion.div
        className="absolute inset-0"
        style={parallaxEnabled ? { y: marsY } : undefined}
      >
        <Image
          alt=""
          aria-hidden
          className="object-cover object-[70%_center] saturate-[0.9] contrast-[1.05]"
          fill
          priority
          sizes="100vw"
          src={SITE_IMAGES.backgrounds.marsHighway}
        />
      </motion.div>

      {/* Voile pour lisibilité du contenu */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[var(--background)]/72"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/40 via-transparent to-[var(--background)]/85"
      />

      <motion.div className="absolute inset-0" style={parallaxEnabled ? { y: meshY } : undefined}>
        {BLOBS.map((blob) => (
          <div
            className={`absolute rounded-full blur-3xl ${blob.className}`}
            key={blob.className}
            style={{ background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)` }}
          />
        ))}
      </motion.div>

      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 110%, rgba(255, 107, 26, 0.12) 0%, transparent 55%)',
        }}
      />

      <motion.div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: GRID_SVG,
          backgroundSize: '48px 48px',
          y: parallaxEnabled ? gridY : 0,
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: NOISE_SVG, backgroundSize: '180px 180px' }}
      />

      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(140% 100% at 50% 50%, transparent 55%, rgba(0, 0, 0, 0.5) 100%)',
        }}
      />
    </div>
  )
}
