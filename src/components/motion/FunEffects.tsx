'use client'

import { BackgroundLayers } from '@/components/motion/BackgroundLayers'
import { CustomCursor } from '@/components/motion/CustomCursor'
import { MouseGlow } from '@/components/motion/MouseGlow'
import { useEffect, useState } from 'react'

export function FunEffects() {
  const [richEffects, setRichEffects] = useState(false)

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setRichEffects(finePointer && !reduceMotion)
  }, [])

  return (
    <>
      {richEffects ? (
        <>
          <BackgroundLayers />
          <MouseGlow />
        </>
      ) : null}
      <CustomCursor />
    </>
  )
}
