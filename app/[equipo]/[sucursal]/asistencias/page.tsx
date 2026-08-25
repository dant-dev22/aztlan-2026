import Header from '@/app/components/Header'
import AttendanceModule from '@/app/components/asistencias/AttendanceModule'
import { slugToLabel } from '@/app/lib/slug'

interface AsistenciasPageProps {
  params: {
    equipo: string
    sucursal: string
  }
}

export default function AsistenciasPage({ params }: AsistenciasPageProps) {
  const equipoLabel = slugToLabel(params.equipo)
  const sucursalLabel = slugToLabel(params.sucursal)

  return (
    <div className="page-shell min-h-screen">
      <Header
        title="Control De Asistencias"
        subtitle={`${equipoLabel} · ${sucursalLabel}`}
        showBackButton
        backHref="/"
        centered={false}
      />

      <main className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AttendanceModule
            equipoSlug={params.equipo}
            sucursalSlug={params.sucursal}
            equipoLabel={equipoLabel}
            sucursalLabel={sucursalLabel}
          />
        </div>
      </main>
    </div>
  )
}
