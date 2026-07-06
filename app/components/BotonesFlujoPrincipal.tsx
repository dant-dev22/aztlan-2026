'use client'

interface BotonesFlujoPrincipalProps {
  onIniciarRegistro: () => void
  onTerminarRegistro: () => void
}

export default function BotonesFlujoPrincipal({
  onIniciarRegistro,
  onTerminarRegistro,
}: BotonesFlujoPrincipalProps) {
  return (
    <section
      className="flex flex-col sm:flex-row gap-4 justify-center items-center"
      aria-label="Acciones principales de registro"
    >
      <button
        type="button"
        onClick={onIniciarRegistro}
        className="btn-primary group w-full min-w-[220px] sm:w-auto px-8 py-4 text-lg"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Iniciar registro
      </button>
      <button
        type="button"
        onClick={onTerminarRegistro}
        className="btn-accent group w-full min-w-[220px] sm:w-auto px-8 py-4 text-lg"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Terminar registro
      </button>
    </section>
  )
}
