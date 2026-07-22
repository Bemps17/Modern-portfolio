'use client'

import { Button, toast } from '@payloadcms/ui'
import React, { useState } from 'react'

/**
 * Bouton header admin — force la revalidation du cache Next (front public).
 * Toast de confirmation / erreur après l’action.
 */
export default function RevalidateSiteButton() {
  const [pending, setPending] = useState(false)

  const onClick = async () => {
    if (pending) return
    setPending(true)
    try {
      const res = await fetch('/api/admin/revalidate', {
        method: 'POST',
        credentials: 'include',
      })
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean
        message?: string
      } | null

      if (!res.ok || !data?.ok) {
        toast.error(data?.message || 'Échec de l’actualisation du site.')
        return
      }

      toast.success(data.message || 'Site actualisé.')
    } catch {
      toast.error('Impossible de contacter le serveur d’actualisation.')
    } finally {
      setPending(false)
    }
  }

  return (
    <Button
      buttonStyle="secondary"
      disabled={pending}
      margin={false}
      onClick={onClick}
      size="small"
      type="button"
    >
      {pending ? 'Actualisation…' : 'Actualiser le site'}
    </Button>
  )
}
