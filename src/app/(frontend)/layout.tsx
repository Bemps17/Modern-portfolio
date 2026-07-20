import { Syne, DM_Sans, Space_Grotesk } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import { Toaster } from 'sonner'

import { BottomTabBar } from '@/components/layout/BottomTabBar'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { getSiteSettingsContent } from '@/lib/content'

import './styles.css'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const revalidate = 3600

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/brand/favicon.svg', type: 'image/svg+xml' },
      { url: '/brand/favicon.png', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#050505',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettingsContent()
  const siteName = settings?.siteName || 'Portfolio'
  const email = settings?.email || null

  return (
    <html className={`${syne.variable} ${dmSans.variable} ${spaceGrotesk.variable}`} lang="fr">
      <body>
        <Header siteName={siteName} />
        <main className="min-h-screen pb-20 lg:pb-0">{children}</main>
        <Footer email={email} siteName={siteName} />
        <BottomTabBar />
        <Toaster position="bottom-center" theme="dark" />
      </body>
    </html>
  )
}
