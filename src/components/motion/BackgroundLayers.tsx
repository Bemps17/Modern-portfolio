'use client'

import { useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useSyncExternalStore } from 'react'

import { SITE_IMAGES } from '@/lib/site-images'
import { useMediaQuery } from '@/lib/use-client-media'

const GRID_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath d='M48 0H0V48' fill='none' stroke='rgba(255,255,255,0.18)' stroke-width='1'/%3E%3C/svg%3E")`

const MAX_SCROLL = 2400
const MAX_TRANSLATE = 280

function subscribeScrollTimeline(onChange: () => void) {
  // Les supports évoluent (Chrome, Safari récents) — on re-check au focus.
  window.addEventListener('focus', onChange)
  return () => window.removeEventListener('focus', onChange)
}

function supportsScrollTimeline(): boolean {
  try {
    return (
      typeof CSS !== 'undefined' &&
      typeof CSS.supports === 'function' &&
      (CSS.supports('animation-timeline: scroll()') ||
        CSS.supports('animation-timeline', 'scroll()'))
    )
  } catch {
    return false
  }
}

function useScrollTimelineSupport() {
  return useSyncExternalStore(
    subscribeScrollTimeline,
    supportsScrollTimeline,
    () => false,
  )
}

type BgMode = 'static' | 'css-parallax' | 'js-parallax'

/**
 * Fond Mars — v8
 *
 * Problème mobile (v7) :
 * même en mode “fixed”, la couche restait oversized (top -22% / height 144%)
 * avec `will-change: transform` + `translate3d`. Au scroll, la barre d’URL
 * mobile change le visual viewport → micro-décalage perceptible.
 *
 * Modes :
 * - `static` : couverture exacte du viewport (`inset-0`, `100dvh`), aucun
 *   transform / will-change → fond vraiment figé.
 * - `css-parallax` : scroll-driven animations (Chrome / Safari récents,
 *   y compris mobile haut de gamme) — parallax fluide sans JS.
 * - `js-parallax` : rAF desktop (pointer fin) si scroll-timeline absent.
 */
export function BackgroundLayers() {
  const reduceMotion = useReducedMotion()
  const finePointer = useMediaQuery('(pointer: fine)')
  const scrollTimeline = useScrollTimelineSupport()
  const layerRef = useRef<HTMLDivElement>(null)

  const mode: BgMode = (() => {
    if (reduceMotion) return 'static'
    if (scrollTimeline) return 'css-parallax'
    if (finePointer) return 'js-parallax'
    return 'static'
  })()

  useEffect(() => {
    if (mode !== 'js-parallax') return
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
      node.style.transform = ''
    }
  }, [mode])

  const parallaxActive = mode === 'css-parallax' || mode === 'js-parallax'

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{
        // 100dvh évite le jump de la barre d’URL mobile (100vh classique).
        height: '100dvh',
        width: '100%',
        isolation: 'isolate',
      }}
    >
      <div className="absolute inset-0 bg-[var(--background)]" />

      <div
        className={
          parallaxActive
            ? mode === 'css-parallax'
              ? 'bg-mars-parallax absolute inset-x-0'
              : 'absolute inset-x-0'
            : 'absolute inset-0'
        }
        data-bg-mode={mode}
        ref={layerRef}
        style={
          parallaxActive
            ? {
                top: '-22%',
                height: '144%',
              }
            : undefined
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className="h-full w-full object-cover object-[62%_center]"
          decoding="async"
          fetchPriority="high"
          src={SITE_IMAGES.backgrounds.marsHighway}
        />
      </div>

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
