import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLaunchSequence } from '@/components/sections/starship/useLaunchSequence'

describe('useLaunchSequence', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('starts countdown on handleLaunch', () => {
    const onComplete = vi.fn()
    const { result } = renderHook(() => useLaunchSequence({ onComplete, reduceMotion: false }))
    act(() => result.current.handleLaunch())
    expect(result.current.phase).toBe('countdown')
    expect(result.current.countdown).toBe(3)
  })

  it('reduceMotion calls onComplete immediately', () => {
    const onComplete = vi.fn()
    const { result } = renderHook(() => useLaunchSequence({ onComplete, reduceMotion: true }))
    act(() => result.current.handleLaunch())
    expect(onComplete).toHaveBeenCalledOnce()
    expect(result.current.phase).toBe('idle')
  })

  it('progresses countdown to ignition then liftoff', () => {
    const onComplete = vi.fn()
    const { result } = renderHook(() => useLaunchSequence({ onComplete, reduceMotion: false }))
    act(() => result.current.handleLaunch())
    act(() => vi.advanceTimersByTime(900 * 3))
    expect(result.current.phase).toBe('ignition')
    act(() => vi.advanceTimersByTime(500))
    expect(result.current.phase).toBe('liftoff')
    act(() => vi.advanceTimersByTime(2200))
    expect(result.current.phase).toBe('mission')
    act(() => vi.advanceTimersByTime(450))
    expect(onComplete).toHaveBeenCalledOnce()
  })
})
