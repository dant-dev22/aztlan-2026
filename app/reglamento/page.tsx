import type { Metadata } from 'next'
import Header from '../components/Header'
import Footer from '../components/Footer'

type Categoria = 'infantiles' | 'principiantes' | 'intermedios' | 'avanzados'

interface TecnicaRow {
  tecnica: string
  prohibidaEn: Categoria[]
}

const CATEGORIAS: { key: Categoria; label: string; shortLabel: string }[] = [
  { key: 'infantiles', label: 'Infantiles y Adolescentes', shortLabel: 'Infantiles' },
  { key: 'principiantes', label: 'Juveniles, Adultos y Master Principiantes', shortLabel: 'Principiantes' },
  { key: 'intermedios', label: 'Adultos y Master Intermedios', shortLabel: 'Intermedios' },
  { key: 'avanzados', label: 'Adultos y Master Avanzados', shortLabel: 'Avanzados' },
]

const DATOS_TABLA: TecnicaRow[] = [
  { tecnica: 'Sumisiones que fuercen la separación de las piernas', prohibidaEn: ['infantiles'] },
  { tecnica: 'Ezequiel', prohibidaEn: ['infantiles'] },
  { tecnica: 'Aquiles', prohibidaEn: ['infantiles'] },
  { tecnica: 'Guillotina, Anaconda, D’arce, Peruvian choke o cualquier variante de front head lock', prohibidaEn: ['infantiles'] },
  { tecnica: 'Omoplata', prohibidaEn: ['infantiles'] },
  { tecnica: 'Jalar la cabeza del oponente al hacer triángulo de piernas', prohibidaEn: ['infantiles'] },
  { tecnica: 'Triángulo de brazo', prohibidaEn: ['infantiles'] },
  { tecnica: 'Mano de vaca', prohibidaEn: ['infantiles', 'principiantes'] },
  { tecnica: 'Compresión a las costillas en guardia cerrada', prohibidaEn: ['infantiles', 'principiantes'] },
  { tecnica: 'Girar hacia el lado del pie que no se está atacando en los Aquiles', prohibidaEn: ['infantiles', 'principiantes', 'intermedios'] },
  { tecnica: 'Knee Reaping', prohibidaEn: ['infantiles', 'principiantes', 'intermedios'] },
  { tecnica: 'Compresiones musculares (Bíceps slicer y Calf slicer)', prohibidaEn: ['infantiles', 'principiantes', 'intermedios'] },
  { tecnica: 'Barra de rodilla', prohibidaEn: ['infantiles', 'principiantes', 'intermedios'] },
  { tecnica: 'Saltar a Guardia o Ataques voladores', prohibidaEn: ['infantiles', 'principiantes', 'intermedios'] },
  { tecnica: 'Toe Hold', prohibidaEn: ['infantiles', 'principiantes', 'intermedios'] },
  { tecnica: 'Muffler', prohibidaEn: ['infantiles', 'principiantes', 'intermedios'] },
  { tecnica: 'Heel hook, Heel hook reverso, Aoki lock y Z lock', prohibidaEn: ['infantiles', 'principiantes', 'intermedios'] },
  { tecnica: 'Aplicar presión hacia el lado exterior al hacer toe hold', prohibidaEn: ['infantiles', 'principiantes', 'intermedios', 'avanzados'] },
  { tecnica: 'Kani Basami', prohibidaEn: ['infantiles', 'principiantes', 'intermedios', 'avanzados'] },
  { tecnica: 'Torcer los dedos', prohibidaEn: ['infantiles', 'principiantes', 'intermedios', 'avanzados'] },
  { tecnica: 'Llaves a las cervicales', prohibidaEn: ['infantiles', 'principiantes', 'intermedios', 'avanzados'] },
  { tecnica: 'Suplex', prohibidaEn: ['infantiles', 'principiantes', 'intermedios', 'avanzados'] },
  { tecnica: 'Proyectar de cabeza al oponente', prohibidaEn: ['infantiles', 'principiantes', 'intermedios', 'avanzados'] },
  { tecnica: 'Slam', prohibidaEn: ['infantiles', 'principiantes', 'intermedios', 'avanzados'] },
]

export const metadata: Metadata = {
  title: 'Reglamento Oficial - Aztlán 2026',
  description: 'Técnicas permitidas y prohibidas por categoría de edad y nivel en el torneo Aztlán 2026',
}

function estaProhibida(row: TecnicaRow, cat: Categoria): boolean {
  return row.prohibidaEn.includes(cat)
}

function IconoProhibido() {
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-red-500/30 bg-red-50 text-red-700" aria-label="Prohibido">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </span>
  )
}

function IconoPermitido() {
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-success-green/30 bg-green-50 text-success-green" aria-label="Permitido">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  )
}

export default function ReglamentoPage() {
  return (
    <div className="page-shell min-h-screen flex flex-col">
      <Header
        title="Reglamento"
        subtitle="Oficial Aztlán 2026"
        showBackButton={true}
        backHref="/"
        centered={false}
      />

      <main className="flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <section className="animate-fade-in">
            <p className="section-kicker mb-4">Aztlán 2026</p>
            <h2 className="text-3xl font-black tracking-tight text-primary-text sm:text-4xl">
              Técnicas permitidas y prohibidas
            </h2>
          </section>

          <section className="surface-panel animate-fade-in px-3 py-4 sm:px-6 sm:py-6 overflow-hidden">
            <div className="flex flex-wrap gap-5 mb-6 px-2 sm:px-3">
              <div className="flex items-center gap-3">
                <IconoPermitido />
                <span className="text-sm text-secondary-text">Técnica permitida</span>
              </div>
              <div className="flex items-center gap-3">
                <IconoProhibido />
                <span className="text-sm text-secondary-text">Técnica prohibida</span>
              </div>
            </div>

            <div className="overflow-x-auto -mx-3 sm:-mx-6 px-3 sm:px-6">
              <table className="min-w-[760px] w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-charcoal-ink text-soft-white">
                    <th
                      scope="col"
                      className="text-left font-semibold px-4 py-4 rounded-tl-2xl border-b border-white/10"
                    >
                      <span className="block text-xs uppercase tracking-[0.14em] text-white/70 mb-1">Técnica</span>
                    </th>
                    {CATEGORIAS.map((cat) => (
                      <th
                        key={cat.key}
                        scope="col"
                        className="text-center font-semibold px-3 py-4 border-b border-white/10 last:rounded-tr-2xl min-w-[120px]"
                      >
                        <span className="block text-[10px] sm:text-xs uppercase tracking-[0.12em] text-white/70 mb-1 hidden sm:block">
                          {cat.label}
                        </span>
                        <span className="block text-xs sm:text-sm font-bold text-soft-white sm:hidden">
                          {cat.shortLabel}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DATOS_TABLA.map((row, idx) => (
                    <tr
                      key={row.tecnica}
                      className={`${idx % 2 === 0 ? 'bg-warm-white' : 'bg-light-ash/40'} border-b border-primary-text/[0.06] last:border-b-0 transition-colors hover:bg-blue-mist/40`}
                    >
                      <td className="px-4 py-3.5 text-primary-text font-medium leading-relaxed">
                        {row.tecnica}
                      </td>
                      {CATEGORIAS.map((cat) => (
                        <td
                          key={cat.key}
                          className="text-center px-3 py-3.5 align-middle"
                        >
                          <div className="flex items-center justify-center">
                            {estaProhibida(row, cat.key) ? <IconoProhibido /> : <IconoPermitido />}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="surface-muted animate-fade-in px-6 py-6 text-sm text-secondary-text space-y-2">
            <p className="font-semibold text-primary-text">Nota:</p>
            <p>
              Cualquier técnica no listada en este reglamento será evaluada por el árbitro principal.
              La seguridad de los competidores es prioridad.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
