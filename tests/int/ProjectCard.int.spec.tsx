import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ProjectCard } from '@/components/sections/ProjectCard'
import type { Project } from '@/payload-types'

const project = {
  id: 1,
  title: 'Studio Nova',
  slug: 'studio-nova',
  excerpt: 'Un site dark glassmorphism pour une agence.',
  stack: ['nextjs', 'payload'],
  status: 'published',
  featured: true,
  order: 1,
  cover: {
    id: 10,
    alt: 'Couverture Studio Nova',
    url: '/api/media/file/cover.jpg',
    updatedAt: '2026-01-01',
    createdAt: '2026-01-01',
  },
  updatedAt: '2026-01-01',
  createdAt: '2026-01-01',
} as unknown as Project

describe('ProjectCard', () => {
  it('renders title, excerpt and stack badges', () => {
    render(<ProjectCard project={project} />)
    expect(screen.getByText('Studio Nova')).toBeTruthy()
    expect(screen.getByText(/site dark glassmorphism/i)).toBeTruthy()
    expect(screen.getByText('Next.js')).toBeTruthy()
    expect(screen.getByText('Payload CMS')).toBeTruthy()
  })
})
