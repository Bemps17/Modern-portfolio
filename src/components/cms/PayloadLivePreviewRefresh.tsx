'use client'

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'

import { getSiteUrl } from '@/lib/site-url'

/** Rafraîchit la page front quand l’admin Payload sauvegarde (live preview). */
export function PayloadLivePreviewRefresh() {
  const router = useRouter()
  return <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={getSiteUrl()} />
}
