'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  COUNTDOWN_START,
  COUNTDOWN_TICK_MS,
  IGNITION_MS,
  LIFTOFF_MS,
  MISSION_MS,
  type LaunchPhase,
} from './constants'

type UseLaunchSequenceOptions = {
  onComplete: () => void
  reduceMotion: boolean | null
}

export function useLaunchSequence({ onComplete, reduceMotion }: UseLaunchSequenceOptions) {
  const [phase, setPhase] = useState<LaunchPhase>('idle')
  const [countdown, setCountdown] = useState<number | null>(null)

  const handleLaunch = useCallback(() => {
    if (phase !== 'idle') return
    if (reduceMotion) {
      onComplete()
      return
    }
    setPhase('countdown')
    setCountdown(COUNTDOWN_START)
  }, [onComplete, phase, reduceMotion])

  useEffect(() => {
    if (phase !== 'countdown') return

    let cancelled = false
    let remaining = COUNTDOWN_START

    const scheduleTick = () => {
      window.setTimeout(() => {
        if (cancelled) return
        if (remaining > 1) {
          remaining -= 1
          setCountdown(remaining)
          scheduleTick()
          return
        }
        setCountdown(null)
        setPhase('ignition')
      }, COUNTDOWN_TICK_MS)
    }

    setCountdown(COUNTDOWN_START)
    scheduleTick()

    return () => {
      cancelled = true
    }
  }, [phase])

  useEffect(() => {
    if (phase !== 'ignition') return
    const timer = window.setTimeout(() => setPhase('liftoff'), IGNITION_MS)
    return () => window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== 'liftoff') return
    const timer = window.setTimeout(() => setPhase('mission'), LIFTOFF_MS)
    return () => window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== 'mission') return
    const timer = window.setTimeout(() => {
      onComplete()
      setPhase('idle')
    }, MISSION_MS)
    return () => window.clearTimeout(timer)
  }, [onComplete, phase])

  return {
    phase,
    countdown,
    isLaunching: phase === 'liftoff',
    isIgniting: phase === 'ignition',
    isMission: phase === 'mission',
    handleLaunch,
    launchDisabled: phase !== 'idle',
  }
}
