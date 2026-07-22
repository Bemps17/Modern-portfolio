'use client'

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'

import { SITE_IMAGES } from '@/lib/site-images'
import { useRichMotionEffects } from '@/lib/use-client-media'

const BLOBS = [
  {
    className: 'left-[-12%] top-[4%] h-[42vw] w-[42vw] animate-[blob-float-1_28s_ease-in-out_infinite]',
    color: 'rgba(255, 107, 26, 0.10)',
  },
  {
    className: 'right-[-10%] top-[28%] h-[36vw] w-[36vw] animate-[blob-float-2_32s_ease-in-out_infinite]',
    color: 'rgba(153, 27, 27, 0.08)',
  },
  {
    className: 'left-[22%] bottom-[2%] h-[30vw] w-[30vw] animate-[blob-float-3_26s_ease-in-out_infinite]',
    color: 'rgba(255, 179, 71, 0.06)',
  },
] as const

const GRID_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath d='M48 0H0V48' fill='none' stroke='rgba(255,255,255,0.22)' stroke-width='1'/%3E%3C/svg%3E")`

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`

/**
 * Fond Mars + voile. Parallax soigné :
 * - couche image plus haute que le viewport (pas de trous)
 * - amplitude faible + spring (pas de jitter)
 * - desktop only (rich motion)
 */
export function BackgroundLayers() {
  const reduceMotion = useReducedMotion()
  const richEffects = useRichMotionEffects()
  const parallaxEnabled = !reduceMotion && richEffects

  const { scrollY } = useScroll()
  const marsRaw = useTransform(scrollY, [0, 2000], [0, 48])
  const marsY = useSpring(marsRaw, { stiffness: 60, damping: 28, mass: 0.4 })

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[var(--background)]" />

      {/* Oversized layer : le translate ne découvre jamais le vide */}
      <motion.div
        className="absolute inset-x-0 -top-[12%] h-[124%] will-change-transform"
        style={parallaxEnabled ? { y: marsY } : undefined}
      >
        {/* img native : moins de coût que next/image fill + layout sur couche fixed */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className="h-full w-full object-cover object-[70%_center] saturate-[0.9] contrast-[1.05]"
          decoding="async"
          fetchPriority="low"
          src={SITE_IMAGES.backgrounds.marsHighway}
        />
      </motion.div>

      <div className="absolute inset-0 bg-[var(--background)]/74" />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/45 via-transparent to-[var(--background)]/88" />

      {/* Blobs en CSS only — pas de scroll listener */}
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
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 110%, rgba(255, 107, 26, 0.10) 0%, transparent 55%)',
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{ backgroundImage: GRID_SVG, backgroundSize: '48px 48px' }}
      />

      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{ backgroundImage: NOISE_SVG, backgroundSize: '180px 180px' }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(140% 100% at 50% 50%, transparent 55%, rgba(0, 0, 0, 0.5) 100%)',
        }}
      />
    </div>
  )
}
