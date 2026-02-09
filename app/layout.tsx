import type { Metadata } from 'next'
import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aztlan2026.com'

export const metadata: Metadata = {
  title: 'Registro de Participantes - Aztlan 2026',
  description: 'Sistema de registro para participantes del torneo Aztlan 2026',
  openGraph: {
    title: 'Registro de Participantes - Aztlan 2026',
    description: 'Sistema de registro para participantes del torneo Aztlan 2026',
    url: siteUrl,
    siteName: 'Aztlan 2026',
    images: [
      {
        url: `${siteUrl}/images/logoaztlan.svg`,
        width: 120,
        height: 120,
        alt: 'Aztlan 2026 - Logo oficial',
      },
    ],
    locale: 'es',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Registro de Participantes - Aztlan 2026',
    description: 'Sistema de registro para participantes del torneo Aztlan 2026',
    images: [`${siteUrl}/images/logoaztlan.svg`],
  },
  icons: {
    icon: '/images/logoaztlan.svg',
    apple: '/images/logoaztlan.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}

