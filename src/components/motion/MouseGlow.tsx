'use client'

import { useEffect, useState } from 'react'

export function MouseGlow() {
  const [position, setPosition] = useState({ x: 50, y: 20 })
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!finePointer || reduceMotion) return

    setEnabled(true)

    const onMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 100
      const y = (event.clientY / window.innerHeight) * 100
      setPosition({ x, y })
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  if (!enabled) return null

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] transition-[background] duration-500 ease-out"
        style={{
          background: `radial-gradient(720px circle at ${position.x}% ${position.y}%, rgba(255, 107, 26, 0.09) 0%, transparent 62%)`,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] transition-[background] duration-200 ease-out"
        style={{
          background: `radial-gradient(280px circle at ${position.x}% ${position.y}%, rgba(255, 179, 71, 0.12) 0%, transparent 70%)`,
        }}
      />
    </>
  )
}
