import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Registro de Participantes - Aztlan 2026',
  description: 'Sistema de registro para participantes del torneo Aztlan 2026',
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

