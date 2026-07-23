'use client'

import { useReducedMotion } from 'framer-motion'
import { useEffect, useRef } from 'react'

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

const MAX_SCROLL = 2400
const MAX_TRANSLATE = 300

/**
 * Parallax fond Mars — v5 (scroll fluide, sans saccade)
 *
 * Cause de la saccade v4 :
 * framer-motion `useScroll` batche les updates via requestAnimationFrame →
 * lag d’1 frame entre le scroll réel et le transform → l’image “se décale”.
 *
 * Fix : listener `scroll` passif + rAF dédié, transform appliqué direct sur
 * le nœud via ref (pas de ré-render React). Image promue sur son propre
 * layer GPU pour éviter les re-composites.
 */
export function BackgroundLayers() {
  const reduceMotion = useReducedMotion()
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduceMotion) return
    const node = layerRef.current
    if (!node) return

    let frame = 0
    const update = () => {
      frame = 0
      const scrollY = window.scrollY
      const ratio = Math.min(scrollY / MAX_SCROLL, 1)
      const y = ratio * MAX_TRANSLATE
      node.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [reduceMotion])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[var(--background)]" />

      <div
        className="absolute inset-x-0 will-change-transform"
        ref={layerRef}
        style={{
          // Marge verticale > amplitude max (300px) pour ne jamais découvrir le vide
          top: '-22%',
          height: '144%',
          // Init GPU layer — évite le re-composite à la première frame
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className="h-full w-full object-cover object-[62%_center] saturate-[0.92] contrast-[1.06]"
          decoding="sync"
          fetchPriority="high"
          src={SITE_IMAGES.backgrounds.marsHighway}
          style={{ transform: 'translateZ(0)', willChange: 'transform' }}
        />
      </div>

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
