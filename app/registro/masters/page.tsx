import RegistroForm from '@/app/components/RegistroForm'
import Header from '@/app/components/Header'

export default function RegistroMasters() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header showBackButton backHref="/" />

      {/* Main */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <RegistroForm tipoRegistro="masters" />
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

