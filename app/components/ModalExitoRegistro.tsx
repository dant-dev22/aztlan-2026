'use client'

import Link from 'next/link'
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
      <div className="mb-4 rounded-2xl border border-primary-text/10 bg-light-ash/45 p-3">
        <AppLogo size={80} />
      </div>
      <div className="mb-6 flex items-center justify-center text-signal-orange">
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

      <p className="section-kicker mb-3">Registro iniciado</p>
      <h2 className="mb-3 text-2xl font-black tracking-tight text-primary-text sm:text-3xl">
        ¡Felicidades {nombreParticipante}!
      </h2>

      <p className="mb-6 text-lg text-secondary-text">
        Tu registro ha sido comenzado con éxito
      </p>

      <div className="mb-6 w-full max-w-md rounded-[24px] border border-signal-orange/25 bg-signal-orange-soft px-6 py-5 shadow-[0_16px_28px_rgba(255,122,26,0.10)]">
        <p className="text-sm font-medium mb-2 text-secondary-text">Este es tu Aztlan ID:</p>
        <p className="break-all font-mono text-2xl font-bold tracking-wider text-signal-orange">
          {aztlanId}
        </p>
        <p className="text-xs text-secondary-text mt-2">Guárdalo en un lugar seguro</p>
      </div>

      <div className="mb-5 w-full max-w-md rounded-[20px] border border-steel-gray/15 bg-blue-mist/60 px-5 py-4 text-left shadow-sm">
        <Link
          href="/reglamento"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-3 group"
        >
          <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-steel-gray text-soft-white shadow-sm">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-primary-text group-hover:text-steel-gray transition-colors">
              Revisa el reglamento oficial
              <span className="ml-1 inline-block align-middle" aria-hidden="true">↗</span>
            </p>
            <p className="text-xs text-secondary-text mt-0.5">
              Consulta qué técnicas están autorizadas según tu categoría.
            </p>
          </div>
        </Link>
      </div>

      <div className="surface-muted mb-6 w-full max-w-md p-6 text-left">
        <h3 className="text-lg font-semibold text-primary-text mb-4 flex items-center gap-2">
          <svg className="h-5 w-5 text-steel-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Próximos pasos
        </h3>
        <ol className="space-y-3 text-sm text-secondary-text">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-steel-gray text-soft-white font-semibold text-xs">
              1
            </span>
            <span>
              Realiza tu depósito o transferencia a la cuenta <strong className="text-primary-text">BBVA 4152 3139 2334 3144</strong> a nombre de <strong className="text-primary-text">Cristhian Bautista</strong>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-steel-gray text-soft-white font-semibold text-xs">
              2
            </span>
            <span>
              Guarda o toma una captura de pantalla de tu comprobante de pago
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-steel-gray text-soft-white font-semibold text-xs">
              3
            </span>
            <span>
              Haz clic en el botón de abajo para subir tu comprobante y completar tu registro
            </span>
          </li>
        </ol>
      </div>

      <button
        type="button"
        onClick={onSubirComprobante}
        className="btn-accent w-full max-w-md py-4"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Subir comprobante de pago
      </button>

      <button
        type="button"
        onClick={onClose}
        className="mt-4 text-sm text-secondary-text underline underline-offset-2 transition-colors hover:text-primary-text"
      >
        Cerrar
      </button>
    </div>
  )
}
