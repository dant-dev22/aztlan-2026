import RegistroForm from '@/app/components/RegistroForm'
import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'
import RegistroCerrado from '@/app/components/RegistroCerrado'
import { REGISTRO_ABIERTO } from '@/app/lib/registroConfig'

export default function RegistroAdultos() {
  return (
    <div className="page-shell min-h-screen flex flex-col">
      <Header showBackButton backHref="/" />

      <main className="flex-1 px-4 py-10 sm:px-6 lg:px-8">
        {REGISTRO_ABIERTO ? (
          <RegistroForm tipoRegistro="adultos" />
        ) : (
          <div className="max-w-7xl mx-auto">
            <RegistroCerrado variant="page" />
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

