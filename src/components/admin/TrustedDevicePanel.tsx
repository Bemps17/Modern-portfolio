'use client'

import React, { useCallback, useState, useTransition } from 'react'

type DeviceRow = {
  deviceId: string
  label: string
  createdAt: string
  lastUsedAt: string | null
}

type ListResponse = {
  ok: boolean
  devices?: DeviceRow[]
  currentDeviceId?: string | null
  error?: string
}

/**
 * Bandeau dashboard : enregistrer / révoquer l’appareil courant pour l’accès admin sans mot de passe.
 */
export default function TrustedDevicePanel() {
  const [devices, setDevices] = useState<DeviceRow[] | null>(null)
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const refresh = useCallback(() => {
    startTransition(async () => {
      try {
        const response = await fetch('/api/admin/trusted-device', { credentials: 'include' })
        const data = (await response.json()) as ListResponse
        if (!data.ok) {
          setError(data.error || 'Impossible de charger les appareils')
          return
        }
        setDevices(data.devices || [])
        setCurrentDeviceId(data.currentDeviceId ?? null)
        setError(null)
      } catch {
        setError('Impossible de charger les appareils')
      }
    })
  }, [])

  const isCurrentTrusted = Boolean(
    currentDeviceId && devices?.some((device) => device.deviceId === currentDeviceId),
  )

  function registerDevice() {
    setMessage(null)
    setError(null)
    startTransition(async () => {
      try {
        const response = await fetch('/api/admin/trusted-device', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        })
        const data = (await response.json()) as { ok: boolean; message?: string; error?: string }
        if (!data.ok) {
          setError(data.error || 'Échec de l’enregistrement')
          return
        }
        setMessage(data.message || 'Appareil enregistré')
        const list = await fetch('/api/admin/trusted-device', { credentials: 'include' })
        const listData = (await list.json()) as ListResponse
        if (listData.ok) {
          setDevices(listData.devices || [])
          setCurrentDeviceId(listData.currentDeviceId ?? null)
        }
      } catch {
        setError('Échec de l’enregistrement')
      }
    })
  }

  function revoke(deviceId?: string, all = false) {
    setMessage(null)
    setError(null)
    startTransition(async () => {
      try {
        const query = all ? 'all=1' : `deviceId=${encodeURIComponent(deviceId || '')}`
        const response = await fetch(`/api/admin/trusted-device?${query}`, {
          method: 'DELETE',
          credentials: 'include',
        })
        const data = (await response.json()) as { ok: boolean; error?: string }
        if (!data.ok) {
          setError(data.error || 'Échec de la révocation')
          return
        }
        setMessage(all ? 'Tous les appareils ont été révoqués' : 'Appareil révoqué')
        const list = await fetch('/api/admin/trusted-device', { credentials: 'include' })
        const listData = (await list.json()) as ListResponse
        if (listData.ok) {
          setDevices(listData.devices || [])
          setCurrentDeviceId(listData.currentDeviceId ?? null)
        }
      } catch {
        setError('Échec de la révocation')
      }
    })
  }

  return (
    <aside className="cms-sync-banner" style={{ marginTop: '0.75rem' }}>
      <strong className="cms-sync-banner__title">Sécurité — appareils administrateur</strong>
      <p className="cms-sync-banner__text">
        Sans appareil enregistré, chaque accès au cadenas demande le mot de passe. Enregistrez cet
        appareil pour ouvrir l’admin directement depuis ce navigateur.
      </p>

      {devices === null ? (
        <button
          className="btn btn--style-secondary btn--size-medium"
          disabled={pending}
          onClick={() => refresh()}
          type="button"
        >
          {pending ? 'Chargement…' : 'Gérer les appareils de confiance'}
        </button>
      ) : (
        <>
          {isCurrentTrusted ? (
            <p className="cms-sync-banner__text">
              Cet appareil est <strong>enregistré</strong> comme administrateur.
            </p>
          ) : (
            <button
              className="btn btn--style-primary btn--size-medium"
              disabled={pending}
              onClick={() => registerDevice()}
              type="button"
            >
              {pending ? 'Enregistrement…' : 'Enregistrer cet appareil'}
            </button>
          )}

          {devices.length > 0 ? (
            <ul
              className="cms-sync-banner__text"
              style={{ marginTop: '0.75rem', paddingLeft: '1.1rem' }}
            >
              {devices.map((device) => (
                <li key={device.deviceId} style={{ marginBottom: '0.35rem' }}>
                  {device.label}
                  {device.deviceId === currentDeviceId ? ' (cet appareil)' : ''}
                  {' · '}
                  <button
                    disabled={pending}
                    onClick={() => revoke(device.deviceId)}
                    style={{
                      textDecoration: 'underline',
                      background: 'none',
                      border: 0,
                      color: 'inherit',
                      cursor: 'pointer',
                    }}
                    type="button"
                  >
                    Révoquer
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="cms-sync-banner__text">Aucun appareil enregistré pour le moment.</p>
          )}

          {devices.length > 1 ? (
            <button
              className="btn btn--style-secondary btn--size-small"
              disabled={pending}
              onClick={() => revoke(undefined, true)}
              type="button"
            >
              Révoquer tous les appareils
            </button>
          ) : null}
        </>
      )}

      {message ? <p className="cms-sync-banner__text">{message}</p> : null}
      {error ? (
        <p className="cms-sync-banner__text" style={{ color: '#fca5a5' }}>
          {error}
        </p>
      ) : null}
    </aside>
  )
}
