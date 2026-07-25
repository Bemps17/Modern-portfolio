import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

import { BottomTabBar } from '@/components/layout/BottomTabBar'

describe('BottomTabBar', () => {
  afterEach(() => {
    cleanup()
  })
  it('does not render visible tab labels (icons only)', () => {
    render(<BottomTabBar journalNavLabel="Le Lablog" />)
    expect(screen.queryByText('Accueil')).toBeNull()
    expect(screen.queryByText('Projets')).toBeNull()
    expect(screen.queryByText('À propos')).toBeNull()
    expect(screen.queryByText('Contact')).toBeNull()
    expect(screen.queryByText('Le Lablog')).toBeNull()
  })

  it('exposes accessible aria-label on each tab link', () => {
    render(<BottomTabBar journalNavLabel="Le Lablog" />)
    const nav = screen.getByRole('navigation', { name: 'Navigation mobile' })
    expect(within(nav).getByRole('link', { name: 'Accueil' })).toBeTruthy()
    expect(within(nav).getByRole('link', { name: 'Projets' })).toBeTruthy()
    expect(within(nav).getByRole('link', { name: 'À propos' })).toBeTruthy()
    expect(within(nav).getByRole('link', { name: 'Contact' })).toBeTruthy()
    expect(within(nav).getByRole('link', { name: 'Le Lablog' })).toBeTruthy()
  })

  it('is hidden on large screens via lg:hidden', () => {
    const { container } = render(<BottomTabBar />)
    expect(container.firstChild).toHaveProperty('className')
    expect(String((container.firstChild as HTMLElement).className)).toContain('lg:hidden')
  })
})
