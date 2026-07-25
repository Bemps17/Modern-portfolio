import { createElement } from 'react'
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { StarshipSvg } from '@/components/sections/starship/StarshipSvg'

describe('StarshipSvg stacked mode', () => {
  it('hides dashed spine line when stacked', () => {
    const { container } = render(
      createElement(StarshipSvg, {
        activeStage: 2,
        isIgniting: false,
        isLaunching: false,
        stacked: true,
        onSelect: () => undefined,
      }),
    )
    const dashedLine = container.querySelector('line[stroke-dasharray]')
    expect(dashedLine).toBeNull()
  })

  it('shows dashed spine line when not stacked', () => {
    const { container } = render(
      createElement(StarshipSvg, {
        activeStage: 2,
        isIgniting: false,
        isLaunching: false,
        stacked: false,
        onSelect: () => undefined,
      }),
    )
    const dashedLine = container.querySelector('line[stroke-dasharray]')
    expect(dashedLine).not.toBeNull()
  })
})
