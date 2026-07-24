import { renderToBuffer } from '@react-pdf/renderer'
import type { DocumentProps } from '@react-pdf/renderer'
import { createElement } from 'react'
import type { ReactElement } from 'react'

import { CvDocument } from '@/components/cv/CvDocument'
import { getSiteSettingsContent } from '@/lib/content'
import { resolveCvOverrideUrl } from '@/lib/cv/resolve-cv-override-url'
import { getCvDocumentData } from '@/lib/cv/get-cv-document-data'
import { isMedia, resolveMediaUrl } from '@/lib/media'
import { getSiteUrl } from '@/lib/site-url'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function pdfFileName(fullName: string): string {
  const slug = fullName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return `CV-${slug || 'Portfolio'}.pdf`
}

function pdfHeaders(fileName: string): HeadersInit {
  return {
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="${fileName}"`,
    'Cache-Control': 'private, max-age=0, must-revalidate',
  }
}

async function tryStreamUploadedCv(): Promise<Response | null> {
  const settings = await getSiteSettingsContent()
  if (!isMedia(settings.cv)) return null

  const url = resolveCvOverrideUrl(resolveMediaUrl(settings.cv), getSiteUrl())
  if (!url) return null

  try {
    const remote = await fetch(url)
    if (!remote.ok) return null

    const bytes = await remote.arrayBuffer()
    return new Response(bytes, {
      status: 200,
      headers: pdfHeaders(pdfFileName(settings.siteName)),
    })
  } catch {
    return null
  }
}

export async function GET(): Promise<Response> {
  const uploaded = await tryStreamUploadedCv()
  if (uploaded) return uploaded

  const data = await getCvDocumentData()
  const element = createElement(CvDocument, { data }) as ReactElement<DocumentProps>
  const buffer = await renderToBuffer(element)

  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: pdfHeaders(pdfFileName(data.fullName)),
  })
}
