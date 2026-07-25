export type FormSubmissionEmailInput = {
  name: string
  email: string
  message: string
}

export type FormSubmissionEmail = {
  subject: string
  replyTo: string
  text: string
}

export function buildFormSubmissionEmail(input: FormSubmissionEmailInput): FormSubmissionEmail {
  const subject = `Nouveau message de ${input.name}`
  const text = [
    `Nom : ${input.name}`,
    `Email : ${input.email}`,
    '',
    'Message :',
    input.message,
  ].join('\n')

  return {
    subject,
    replyTo: input.email,
    text,
  }
}

export function shouldNotifyFormSubmission({ operation }: { operation: 'create' | 'update' }): boolean {
  return operation === 'create'
}

export type ContactAutoReplyEmailInput = {
  name: string
  email: string
  subject: string
  body: string
}

export type ContactAutoReplyEmail = {
  subject: string
  text: string
  to: string
}

function replaceContactNamePlaceholder(text: string, name: string): string {
  return text.replace(/\{\{name\}\}/g, name)
}

export function buildContactAutoReplyEmail(input: ContactAutoReplyEmailInput): ContactAutoReplyEmail {
  return {
    subject: replaceContactNamePlaceholder(input.subject, input.name),
    text: replaceContactNamePlaceholder(input.body, input.name),
    to: input.email,
  }
}

export type SendContactAutoReplyInput = ContactAutoReplyEmailInput & {
  enabled?: boolean
  resendApiKey?: string | null
  fromEmail?: string | null
}

/** Envoie l'accusé de réception au visiteur si activé et Resend configuré. Ne lève pas en cas d'échec réseau. */
export async function sendContactAutoReply(
  input: SendContactAutoReplyInput,
): Promise<{ sent: boolean }> {
  if (!input.enabled) return { sent: false }

  const apiKey = input.resendApiKey?.trim()
  if (!apiKey) return { sent: false }

  const email = buildContactAutoReplyEmail(input)
  const from = input.fromEmail?.trim() || 'Portfolio <onboarding@resend.dev>'

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)
    await resend.emails.send({
      from,
      to: [email.to],
      subject: email.subject,
      text: email.text,
    })
    return { sent: true }
  } catch (error) {
    console.error('[form-submission] Échec envoi accusé de réception contact', error)
    return { sent: false }
  }
}

export type SendFormSubmissionNotificationInput = FormSubmissionEmailInput & {
  resendApiKey?: string | null
  toEmail?: string | null
  fromEmail?: string | null
}

/** Envoie la notification Resend si configurée. Ne lève pas en cas d'échec réseau. */
export async function sendFormSubmissionNotification(
  input: SendFormSubmissionNotificationInput,
): Promise<{ sent: boolean }> {
  const apiKey = input.resendApiKey?.trim()
  const to = input.toEmail?.trim()
  if (!apiKey || !to) return { sent: false }

  const email = buildFormSubmissionEmail(input)
  const from = input.fromEmail?.trim() || 'Portfolio <onboarding@resend.dev>'

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)
    await resend.emails.send({
      from,
      to: [to],
      subject: email.subject,
      replyTo: email.replyTo,
      text: email.text,
    })
    return { sent: true }
  } catch (error) {
    console.error('[form-submission] Échec envoi email notification', error)
    return { sent: false }
  }
}
