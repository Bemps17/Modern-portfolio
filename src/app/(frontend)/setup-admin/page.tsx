import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { AdminSetupForm } from '@/components/admin/AdminSetupForm'
import { isPayloadConfigured } from '@/lib/payload-env'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Setup admin — Payload',
  robots: { index: false, follow: false },
}

export default function SetupAdminPage() {
  if (isPayloadConfigured()) {
    redirect('/admin')
  }

  return (
    <div className="px-6 py-16 xl:px-16">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="space-y-3">
          <p className="font-[family-name:var(--font-space-grotesk)] text-xs tracking-[0.2em] text-[var(--muted)] uppercase">
            Bootstrap
          </p>
          <h1 className="font-[family-name:var(--font-syne)] text-3xl font-semibold text-white sm:text-4xl">
            Activer le backoffice
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-[var(--muted)]">
            Payload n’a pas <code className="text-white/70">PAYLOAD_SECRET</code> ni{' '}
            <code className="text-white/70">DATABASE_URI</code> sur Vercel Production. Ce
            formulaire les pousse (Production + Preview + Development) puis relance un deploy.
          </p>
        </div>
        <AdminSetupForm />
      </div>
    </div>
  )
}
