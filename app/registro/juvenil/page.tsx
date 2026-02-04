import RegistroForm from '@/app/components/RegistroForm'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Registro Infantil y Juvenil - Aztlan 2026',
  description: 'Registro de participantes infantiles y juveniles (6-17 años) para Aztlan 2026. Categorías por edad y peso.',
}

export default function RegistroJuvenil() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-charcoal-ink text-soft-white py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold">Aztlan 2026</h1>
          <Link
            href="/"
            className="text-sm sm:text-base hover:text-silver-fog transition-colors duration-300"
          >
            ← Volver
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <RegistroForm tipoRegistro="juvenil" />
      </main>

      {/* Footer */}
      <footer className="bg-light-ash/30 text-muted-text py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-sm">
          <p>&copy; 2026 Aztlan. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

