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
