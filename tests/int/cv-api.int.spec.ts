import { describe, expect, it } from 'vitest'

describe('GET /api/cv', () => {
  it('returns a non-empty PDF buffer', async () => {
    const { GET } = await import('../../src/app/api/cv/route')
    const response = await GET(new Request('http://localhost/api/cv'))

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('application/pdf')

    const disposition = response.headers.get('Content-Disposition') || ''
    expect(disposition).toContain('attachment')
    expect(disposition).toContain('.pdf')

    const buffer = Buffer.from(await response.arrayBuffer())
    expect(buffer.byteLength).toBeGreaterThan(500)
    expect(buffer.subarray(0, 4).toString('utf8')).toBe('%PDF')

    const text = buffer.toString('latin1')
    const pageCount = (text.match(/\/Type\s*\/Page\b/g) || []).length
    expect(pageCount).toBe(1)
  })

  it('serves inline disposition when preview=1', async () => {
    const { GET } = await import('../../src/app/api/cv/route')
    const response = await GET(new Request('http://localhost/api/cv?preview=1'))

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('application/pdf')

    const disposition = response.headers.get('Content-Disposition') || ''
    expect(disposition).toContain('inline')
    expect(disposition).toContain('.pdf')
  })

  it('serves attachment disposition when download=1', async () => {
    const { GET } = await import('../../src/app/api/cv/route')
    const response = await GET(
      new Request('http://localhost/api/cv?download=1', {
        headers: { Accept: 'text/html' },
      }),
    )

    expect(response.status).toBe(200)
    const disposition = response.headers.get('Content-Disposition') || ''
    expect(disposition).toContain('attachment')
  })
})
