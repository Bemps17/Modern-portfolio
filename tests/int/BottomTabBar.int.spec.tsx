import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

import { BottomTabBar } from '@/components/layout/BottomTabBar'

describe('BottomTabBar', () => {
  it('renders the four primary navigation links', () => {
    render(<BottomTabBar />)
    expect(screen.getByText('Accueil')).toBeTruthy()
    expect(screen.getByText('Projets')).toBeTruthy()
    expect(screen.getByText('À propos')).toBeTruthy()
    expect(screen.getByText('Contact')).toBeTruthy()
  })

  it('is hidden on large screens via lg:hidden', () => {
    const { container } = render(<BottomTabBar />)
    expect(container.firstChild).toHaveProperty('className')
    expect(String((container.firstChild as HTMLElement).className)).toContain('lg:hidden')
  })
})
