import RegistroForm from '@/app/components/RegistroForm'
import Header from '@/app/components/Header'
import RegistroCerrado from '@/app/components/RegistroCerrado'
import { REGISTRO_ABIERTO } from '@/app/lib/registroConfig'

export default function RegistroAdultos() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header showBackButton backHref="/" />

      {/* Main */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        {REGISTRO_ABIERTO ? (
          <RegistroForm tipoRegistro="adultos" />
        ) : (
          <div className="max-w-7xl mx-auto">
            <RegistroCerrado variant="page" />
          </div>
        )}
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

