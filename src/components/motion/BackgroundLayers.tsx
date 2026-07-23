'use client'

import { useReducedMotion } from 'framer-motion'
import { useEffect, useRef } from 'react'

import { SITE_IMAGES } from '@/lib/site-images'

const GRID_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath d='M48 0H0V48' fill='none' stroke='rgba(255,255,255,0.18)' stroke-width='1'/%3E%3C/svg%3E")`

const MAX_SCROLL = 2400
const MAX_TRANSLATE = 280

/**
 * Parallax fond Mars — v6 (perf : zero re-raster au scroll)
 *
 * Causes du lag résiduel v5 :
 * 1. Filtres CSS `saturate` / `contrast` sur l’image → re-raster à chaque frame
 * 2. Plusieurs couches `absolute inset-0` superposées → compositing lourd
 * 3. Blobs animés en `blur-3xl` qui se battent pour le GPU pendant le scroll
 *
 * Fix :
 * - Aucun filtre sur l’image (le traitement visuel passe dans le voile)
 * - Une seule couche voile (gradient unique) au lieu de 3 overlays
 * - `isolation: isolate` + `contain` pour limiter le paint au viewport
 * - Blobs retirés du layer parallax (statiques, hors scroll)
 * - Listener scroll + rAF inchangé (déjà optimal côté JS)
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
      const ratio = Math.min(window.scrollY / MAX_SCROLL, 1)
      node.style.transform = `translate3d(0, ${(ratio * MAX_TRANSLATE).toFixed(2)}px, 0)`
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
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ isolation: 'isolate', contain: 'layout paint' }}
    >
      <div className="absolute inset-0 bg-[var(--background)]" />

      <div
        className="absolute inset-x-0 will-change-transform"
        ref={layerRef}
        style={{
          top: '-22%',
          height: '144%',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className="h-full w-full object-cover object-[62%_center]"
          decoding="sync"
          fetchPriority="high"
          src={SITE_IMAGES.backgrounds.marsHighway}
          style={{ transform: 'translateZ(0)', willChange: 'transform' }}
        />
      </div>

      {/* Voile unique — remplace les 3 overlays précédents */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.35) 35%, rgba(10,10,10,0.55) 70%, rgba(10,10,10,0.88) 100%)',
        }}
      />

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
