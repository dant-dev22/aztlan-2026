import Header from '@/app/components/Header'

export default function LoadingAsistenciasPage() {
  return (
    <div className="page-shell min-h-screen">
      <Header title="Control De Asistencias" subtitle="Preparando modulo..." showBackButton backHref="/" centered={false} />

      <main className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-4 rounded-[28px] border border-black/5 bg-white px-6 py-6 shadow-sm">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-silver-fog border-t-electric-blue" aria-hidden />
          <div>
            <p className="text-base font-semibold text-primary-text">Cargando portal de asistencias...</p>
            <p className="text-sm text-secondary-text">Estamos preparando las clases y el escaner QR.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
