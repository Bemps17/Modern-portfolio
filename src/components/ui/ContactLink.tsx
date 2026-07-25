import type { LucideIcon } from 'lucide-react'
import { Mail, Phone } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

type ContactLinkBaseProps = {
  className?: string
  showIcon?: boolean
  size?: 'sm' | 'md'
}

function normalizePhoneHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '')
  return `tel:${digits}`
}

type EmailContactLinkProps = ContactLinkBaseProps & {
  type: 'email'
  value: string
}

type PhoneContactLinkProps = ContactLinkBaseProps & {
  type: 'phone'
  value: string
}

export type ContactLinkProps = EmailContactLinkProps | PhoneContactLinkProps

const sizeClasses = {
  sm: 'contact-link contact-link--sm',
  md: 'contact-link',
} as const

function ContactLinkInner({
  href,
  icon: Icon,
  label,
  className,
  size = 'md',
  showIcon = true,
  kind,
}: {
  href: string
  icon: LucideIcon
  label: string
  className?: string
  size?: 'sm' | 'md'
  showIcon?: boolean
  kind: 'email' | 'phone'
}) {
  const isExternalScheme = href.startsWith('mailto:') || href.startsWith('tel:')
  const kindClass = kind === 'email' ? 'contact-link--email' : 'contact-link--phone'

  const content = (
    <>
      {showIcon ? (
        <span aria-hidden className="contact-link__icon">
          <Icon className="contact-link__glyph" strokeWidth={2} />
        </span>
      ) : null}
      <span className="contact-link__label">{label}</span>
    </>
  )

  if (isExternalScheme) {
    return (
      <a className={cn(sizeClasses[size], kindClass, className)} href={href} rel={undefined}>
        {content}
      </a>
    )
  }

  return (
    <Link className={cn(sizeClasses[size], kindClass, className)} href={href}>
      {content}
    </Link>
  )
}

export function ContactLink(props: ContactLinkProps) {
  if (props.type === 'email') {
    const email = props.value.trim()
    if (!email) return null
    return (
      <ContactLinkInner
        className={props.className}
        href={`mailto:${email}`}
        icon={Mail}
        kind="email"
        label={email}
        showIcon={props.showIcon}
        size={props.size}
      />
    )
  }

  const phone = props.value.trim()
  if (!phone) return null
  return (
    <ContactLinkInner
      className={props.className}
      href={normalizePhoneHref(phone)}
      icon={Phone}
      kind="phone"
      label={phone}
      showIcon={props.showIcon}
      size={props.size}
    />
  )
}

export function EmailContactLink({
  email,
  ...props
}: Omit<EmailContactLinkProps, 'type' | 'value'> & { email: string }) {
  return <ContactLink type="email" value={email} {...props} />
}

export function PhoneContactLink({
  phone,
  ...props
}: Omit<PhoneContactLinkProps, 'type' | 'value'> & { phone: string }) {
  return <ContactLink type="phone" value={phone} {...props} />
}
