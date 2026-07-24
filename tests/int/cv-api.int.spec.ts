import { describe, expect, it } from 'vitest'

describe('GET /api/cv', () => {
  it('returns a non-empty PDF buffer', async () => {
    const { GET } = await import('../../src/app/api/cv/route')
    const response = await GET()

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('application/pdf')

    const disposition = response.headers.get('Content-Disposition') || ''
    expect(disposition).toContain('attachment')
    expect(disposition).toContain('.pdf')

    const buffer = Buffer.from(await response.arrayBuffer())
    expect(buffer.byteLength).toBeGreaterThan(500)
    expect(buffer.subarray(0, 4).toString('utf8')).toBe('%PDF')
  })
})
