import RegistroForm from '@/app/components/RegistroForm'
import Link from 'next/link'

export default function RegistroJuvenil() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-pastel-black text-pastel-white py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold">Aztlan 2026</h1>
          <Link
            href="/"
            className="text-sm sm:text-base hover:text-pastel-white/80 transition-colors duration-300"
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
      <footer className="bg-pastel-black/5 text-pastel-black/60 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-sm">
          <p>&copy; 2026 Aztlan. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

