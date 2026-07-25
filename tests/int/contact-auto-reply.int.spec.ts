// @vitest-environment node
import { describe, expect, it } from 'vitest'

import {
  buildContactAutoReplyEmail,
  sendContactAutoReply,
} from '@/lib/form-submission-notify'

describe('contact auto-reply', () => {
  it('buildContactAutoReplyEmail remplace {{name}} dans sujet et corps', () => {
    const email = buildContactAutoReplyEmail({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      subject: 'Merci {{name}}',
      body: 'Bonjour {{name}}, nous avons bien reçu votre message.',
    })

    expect(email.to).toBe('ada@example.com')
    expect(email.subject).toBe('Merci Ada Lovelace')
    expect(email.text).toBe('Bonjour Ada Lovelace, nous avons bien reçu votre message.')
  })

  it('sendContactAutoReply ne envoie pas si désactivé', async () => {
    const result = await sendContactAutoReply({
      name: 'Test',
      email: 'test@example.com',
      subject: 'Merci',
      body: 'Hello',
      enabled: false,
      resendApiKey: 're_test',
    })
    expect(result.sent).toBe(false)
  })

  it('sendContactAutoReply ne envoie pas sans clé Resend', async () => {
    const result = await sendContactAutoReply({
      name: 'Test',
      email: 'test@example.com',
      subject: 'Merci',
      body: 'Hello',
      enabled: true,
      resendApiKey: null,
    })
    expect(result.sent).toBe(false)
  })
})
