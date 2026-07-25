'use client'

import { FieldDescription, FieldError, FieldLabel, useField } from '@payloadcms/ui'
import type { JSONFieldClientComponent } from 'payload'
import React, { useCallback, useEffect, useRef, useState } from 'react'

function formatJsonValue(value: unknown): string {
  if (value === undefined || value === null) return ''
  if (typeof value === 'string') {
    try {
      return JSON.stringify(JSON.parse(value), null, 2)
    } catch {
      return value
    }
  }
  return JSON.stringify(value, null, 2)
}

/**
 * Éditeur JSON sans Monaco — fiable sur mobile admin (évite chargement infini).
 */
const JsonTextareaField: JSONFieldClientComponent = ({ field, path, readOnly }) => {
  const {
    admin: { description } = {},
    label,
    required,
  } = field

  const { disabled, setValue, showError, value } = useField({ path })
  const inputFromRef = useRef<'external' | 'internal'>('external')
  const [text, setText] = useState(() => formatJsonValue(value))
  const [parseError, setParseError] = useState<string | undefined>()

  useEffect(() => {
    if (inputFromRef.current === 'internal') {
      inputFromRef.current = 'external'
      return
    }
    setText(formatJsonValue(value))
  }, [value])

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (readOnly || disabled) return

      const next = event.target.value
      inputFromRef.current = 'internal'
      setText(next)

      if (!next.trim()) {
        setValue(null)
        setParseError(undefined)
        return
      }

      try {
        setValue(JSON.parse(next))
        setParseError(undefined)
      } catch {
        setParseError('JSON invalide — corrigez la syntaxe avant de sauvegarder.')
      }
    },
    [disabled, readOnly, setValue],
  )

  const locked = Boolean(readOnly || disabled)

  return (
    <div className="field-type json-textarea-field">
      <FieldLabel label={label} path={path} required={required} />
      <FieldError
        message={parseError}
        path={path}
        showError={showError || Boolean(parseError)}
      />
      <textarea
        aria-invalid={showError || Boolean(parseError)}
        className="json-textarea-field__input"
        disabled={locked}
        onChange={onChange}
        readOnly={locked}
        rows={22}
        spellCheck={false}
        style={{
          width: '100%',
          minHeight: '18rem',
          marginTop: '0.35rem',
          padding: '0.75rem 0.85rem',
          borderRadius: '4px',
          border: '1px solid rgb(255 255 255 / 0.14)',
          background: 'rgb(14 14 18 / 0.9)',
          color: 'rgb(248 244 239)',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          fontSize: '13px',
          lineHeight: 1.55,
          resize: 'vertical',
        }}
        value={text}
      />
      {description ? <FieldDescription description={description} path={path} /> : null}
    </div>
  )
}

export default JsonTextareaField
