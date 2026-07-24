import type { Metadata } from 'next'
import Link from 'next/link'

import { CvHtmlDocument } from '@/components/cv/CvHtmlDocument'
import { Container } from '@/components/ui/Container'
import { getCvDocumentData } from '@/lib/cv/get-cv-document-data'
import { getSiteUrl } from '@/lib/site-url'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const data = await getCvDocumentData()
  const title = data.jobTitle ? `${data.fullName} — ${data.jobTitle}` : `CV — ${data.fullName}`
  const description = data.pitch.slice(0, 160)
  const url = `${getSiteUrl()}/cv`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'profile',
    },
  }
}

export default async function CvPage() {
  const data = await getCvDocumentData()

  return (
    <Container as="div" className="cv-page py-10 sm:py-14">
      <div className="cv-page__toolbar mb-8 flex flex-wrap items-center gap-3 print:hidden">
        <Link
          className="inline-flex h-11 items-center rounded-xl border border-white/15 bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/15"
          href="/a-propos"
        >
          Retour
        </Link>
        <Link
          className="inline-flex h-11 items-center rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] px-4 text-sm font-semibold text-white transition hover:brightness-110"
          href="/api/cv?download=1"
          prefetch={false}
        >
          Télécharger le PDF
        </Link>
        <Link
          className="inline-flex h-11 items-center rounded-xl border border-white/15 bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/15"
          href="/api/cv?preview=1"
          prefetch={false}
          target="_blank"
        >
          Aperçu PDF
        </Link>
      </div>

      <CvHtmlDocument data={data} />
    </Container>
  )
}
