'use client'

import AppLogo from './AppLogo'

interface ModalExitoRegistroProps {
  nombreParticipante: string
  aztlanId: string
  onSubirComprobante: () => void
  onClose: () => void
}

export default function ModalExitoRegistro({
  nombreParticipante,
  aztlanId,
  onSubirComprobante,
  onClose,
}: ModalExitoRegistroProps) {
  return (
    <div className="flex flex-col items-center text-center animate-fade-in" role="status" aria-live="polite">
      <AppLogo size={80} className="mb-4" />
      {/* Icono de éxito */}
      <div className="flex items-center justify-center mb-6 text-orange-500">
        <svg
          className="w-16 h-16"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      {/* Título de felicitación */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-primary-text">
        ¡Felicidades {nombreParticipante}!
      </h2>

      {/* Mensaje de éxito */}
      <p className="text-lg mb-6 text-secondary-text">
        Tu registro ha sido comenzado con éxito
      </p>

      {/* Aztlan ID destacado */}
      <div className="bg-orange-50 border-2 border-orange-400 rounded-xl px-6 py-4 mb-6 w-full max-w-md">
        <p className="text-sm font-medium mb-2 text-secondary-text">Este es tu Aztlan ID:</p>
        <p className="text-2xl font-bold tracking-wider font-mono text-orange-600 break-all">
          {aztlanId}
        </p>
        <p className="text-xs text-secondary-text mt-2">Guárdalo en un lugar seguro</p>
      </div>

      {/* Instrucciones de depósito */}
      <div className="bg-warm-white border-2 border-primary-text/10 rounded-xl p-6 mb-6 w-full max-w-md text-left">
        <h3 className="text-lg font-semibold text-primary-text mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-charcoal-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Próximos pasos
        </h3>
        <ol className="space-y-3 text-sm text-secondary-text">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-charcoal-ink text-soft-white flex items-center justify-center font-semibold text-xs">
              1
            </span>
            <span>
              Realiza tu depósito o transferencia a la cuenta <strong className="text-primary-text">BBVA 4152 3139 2334 3144</strong> a nombre de <strong className="text-primary-text">Cristhian Bautista</strong>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-charcoal-ink text-soft-white flex items-center justify-center font-semibold text-xs">
              2
            </span>
            <span>
              Guarda o toma una captura de pantalla de tu comprobante de pago
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-charcoal-ink text-soft-white flex items-center justify-center font-semibold text-xs">
              3
            </span>
            <span>
              Haz clic en el botón de abajo para subir tu comprobante y completar tu registro
            </span>
          </li>
        </ol>
      </div>

      {/* Botón para subir comprobante */}
      <button
        type="button"
        onClick={onSubirComprobante}
        className="w-full max-w-md py-4 px-6 rounded-xl font-semibold text-base transition-all duration-300 bg-success-green text-soft-white hover:bg-success-green-hover shadow-md hover:shadow-lg flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Subir comprobante de pago
      </button>

      {/* Botón secundario para cerrar */}
      <button
        type="button"
        onClick={onClose}
        className="mt-4 text-sm text-secondary-text hover:text-primary-text underline underline-offset-2 transition-colors"
      >
        Cerrar
      </button>
    </div>
  )
}
