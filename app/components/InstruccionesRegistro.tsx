'use client'

const ID_SECCION_REGISTRO = 'registro-participantes'

const pasos = [
  {
    numero: 1,
    titulo: 'Inicia tu registro',
    esEnlaceScroll: true,
    texto:
      'Cuando termines, tendrás un Aztlan ID. Guárdalo muy bien.',
    icono: (
      <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    numero: 2,
    titulo: 'Haz tu transferencia',
    esEnlaceScroll: false,
    texto:
      'Transfiere a la cuenta indicada (Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.) y envía el comprobante dando clic en "Terminar registro".',
    icono: (
      <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    numero: 3,
    titulo: 'Espera la confirmación',
    esEnlaceScroll: false,
    texto:
      'Recibirás un mensaje por WhatsApp confirmando que tu pago ha sido recibido y que tu registro ha sido completado.',
    icono: (
      <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
]

function scrollASeccionRegistro() {
  document.getElementById(ID_SECCION_REGISTRO)?.scrollIntoView({ behavior: 'smooth' })
}

export default function InstruccionesRegistro() {
  return (
    <section
      className="bg-warm-white rounded-2xl p-6 sm:p-8 border-2 border-primary-text/10 max-w-2xl mx-auto"
      aria-labelledby="instrucciones-titulo"
    >
      <h2
        id="instrucciones-titulo"
        className="text-xl sm:text-2xl font-bold text-primary-text mb-6 flex items-center gap-2"
      >
        <svg className="w-6 h-6 text-charcoal-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        Cómo hacer tu registro
      </h2>
      <ol className="space-y-5">
        {pasos.map((paso) => (
          <li
            key={paso.numero}
            className="flex gap-4 items-start"
          >
            <span
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-charcoal-ink text-soft-white font-bold text-sm"
              aria-hidden
            >
              {paso.numero}
            </span>
            <div className="flex-1 min-w-0">
              {paso.esEnlaceScroll ? (
                <button
                  type="button"
                  onClick={scrollASeccionRegistro}
                  className="font-semibold text-primary-text mb-1 text-left cursor-pointer hover:text-charcoal-ink hover:underline underline-offset-2 transition-colors focus:outline-none focus:ring-2 focus:ring-charcoal-ink/30 focus:ring-offset-1 rounded"
                >
                  {paso.titulo}
                </button>
              ) : (
                <h3 className="font-semibold text-primary-text mb-1">{paso.titulo}</h3>
              )}
              <p className="text-secondary-text text-sm sm:text-base">{paso.texto}</p>
            </div>
            <span className="text-charcoal-ink/60 mt-1" aria-hidden>
              {paso.icono}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
