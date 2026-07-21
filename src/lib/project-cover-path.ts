import fs from 'node:fs'
import path from 'node:path'

const COVER_EXTENSIONS = ['webp', 'jpg', 'jpeg', 'png', 'svg'] as const

export function projectCoverPublicPath(slug: string): string {
  return `/projects/${slug}-cover.webp`
}

export function resolveLocalCoverFile(slug: string): { abs: string; publicPath: string } | null {
  const dir = path.join(process.cwd(), 'public/projects')
  for (const ext of COVER_EXTENSIONS) {
    const abs = path.join(dir, `${slug}-cover.${ext}`)
    if (fs.existsSync(abs)) {
      return { abs, publicPath: `/projects/${slug}-cover.${ext}` }
    }
  }
  return null
}

export function mimeFromExt(filename: string): string {
  const ext = path.extname(filename).toLowerCase()
  switch (ext) {
    case '.webp':
      return 'image/webp'
    case '.png':
      return 'image/png'
    case '.svg':
      return 'image/svg+xml'
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    default:
      return 'application/octet-stream'
  }
}
