'use client'

import { useState, useRef, useEffect } from 'react'
import { postComprobante, type ComprobantePayload } from '@/app/lib/api'
import AppLogo from './AppLogo'

const MAX_SIZE_MB = 2
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const AZTLAN_ID_MIN = 1
const AZTLAN_ID_MAX = 64

interface FormTerminarRegistroProps {
  onClose: () => void
  aztlanIdPrellenado?: string
}

function validarAztlanId(val: string): string | null {
  const t = val.trim()
  if (!t) return 'Ingresa tu Aztlan ID.'
  if (t.length < AZTLAN_ID_MIN || t.length > AZTLAN_ID_MAX) {
    return `El Aztlan ID debe tener entre ${AZTLAN_ID_MIN} y ${AZTLAN_ID_MAX} caracteres.`
  }
  return null
}

function buildBody(
  aztlanId: string,
  imagen: File,
  imagenPreview: string
): ComprobantePayload {
  const base64 = imagenPreview.replace(/^data:[^;]+;base64,/, '')
  return {
    aztlan_id: aztlanId.trim(),
    comprobante: base64,
    comprobante_filename: imagen.name,
    comprobante_media_type: imagen.type,
    comprobante_size_bytes: imagen.size,
    timestamp: new Date().toISOString(),
  }
}

export default function FormTerminarRegistro({ onClose, aztlanIdPrellenado }: FormTerminarRegistroProps) {
  const [pageLoading, setPageLoading] = useState(true)
  const [aztlanId, setAztlanId] = useState(aztlanIdPrellenado || '')
  const [imagen, setImagen] = useState<File | null>(null)
  const [imagenPreview, setImagenPreview] = useState<string | null>(null)
  const [imagenLoading, setImagenLoading] = useState(false)
  const [imagenError, setImagenError] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [mensajeExito, setMensajeExito] = useState<string | null>(null)
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null)
  const inputFileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setPageLoading(false), 1200)
    return () => clearTimeout(t)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setImagenError(null)
    setErrorValidacion(null)
    setImagen(null)
    setImagenPreview(null)

    if (!file) return

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setImagenError('Usa una imagen JPG, PNG o WebP.')
      return
    }
    if (file.size > MAX_SIZE_BYTES) {
      setImagenError(`La imagen debe pesar menos de ${MAX_SIZE_MB} MB.`)
      return
    }

    setImagenLoading(true)
    const reader = new FileReader()
    reader.onload = () => {
      setImagen(file)
      setImagenPreview(reader.result as string)
      setImagenLoading(false)
    }
    reader.onerror = () => {
      setImagenError('No se pudo leer la imagen.')
      setImagenLoading(false)
    }
    reader.readAsDataURL(file)
  }

  const quitarImagen = () => {
    setImagen(null)
    setImagenPreview(null)
    setImagenError(null)
    setErrorValidacion(null)
    if (inputFileRef.current) inputFileRef.current.value = ''
  }

  const canSubmit = Boolean(aztlanId.trim() && imagen && !imagenLoading && !enviando)
  const mostrarExito = enviado

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorValidacion(null)
    if (!canSubmit) return

    const errId = validarAztlanId(aztlanId)
    if (errId) {
      setErrorValidacion(errId)
      return
    }
    if (!imagen || !imagenPreview) {
      setErrorValidacion('Debes subir el comprobante de pago.')
      return
    }

    setEnviando(true)
    try {
      const body = buildBody(aztlanId, imagen, imagenPreview)
      const response = await postComprobante(body)
      setMensajeExito(response.message)
      setEnviado(true)
    } catch (err) {
      console.error('Error al enviar comprobante:', err)
      setErrorValidacion(err instanceof Error ? err.message : 'Error al enviar el comprobante.')
    } finally {
      setEnviando(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6" aria-live="polite" aria-busy="true">
        <div
          className="h-12 w-12 rounded-full border-4 border-steel-gray/15 border-t-steel-gray animate-spin"
          role="status"
          aria-label="Cargando"
        />
        <p className="mt-4 text-secondary-text">Cargando…</p>
      </div>
    )
  }

  if (mostrarExito) {
    return (
      <div
        className="animate-fade-in flex flex-col items-center justify-center px-6 py-12 text-center"
        role="status"
        aria-live="polite"
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-green shadow-[0_12px_24px_rgba(15,138,95,0.28)]">
          <svg className="w-8 h-8 text-soft-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-primary-text mb-2">Comprobante enviado</h3>
        <p className="text-secondary-text max-w-sm mb-6">
          {mensajeExito ?? 'Tu comprobante ha sido enviado. Espera la confirmación por correo.'}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="btn-primary"
        >
          Cerrar
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-4 rounded-[26px] bg-charcoal-ink px-6 py-8 text-center text-soft-white">
        <div className="mx-auto mb-3 w-fit rounded-2xl border border-white/70 bg-warm-white p-3 shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
          <AppLogo size={100} />
        </div>
        <p className="section-kicker mb-3 border-white/10 bg-white/10 text-blue-mist">Paso final</p>
        <h2 className="flex items-center justify-center gap-2 text-xl font-black tracking-tight text-soft-white sm:text-2xl">
          <svg className="w-6 h-6 text-signal-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Terminar registro
        </h2>
        <p className="mt-3 text-sm text-white/70 sm:text-base">
          Sube tu comprobante y finaliza el proceso de inscripción.
        </p>
      </div>

      <div>
        <label htmlFor="aztlan-id" className="mb-2 block text-sm font-semibold uppercase tracking-[0.08em] text-secondary-text">
          Aztlan ID
        </label>
        <input
          id="aztlan-id"
          type="text"
          value={aztlanId}
          onChange={(e) => {
            setAztlanId(e.target.value)
            setErrorValidacion(null)
          }}
          placeholder="Ej. AZT-2026-XXXX"
          className="input-field"
          autoComplete="off"
          disabled={enviando}
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.08em] text-secondary-text">
          Comprobante de pago (captura de pantalla)
        </label>
        <p className="text-sm text-secondary-text mb-2">
          JPG, PNG o WebP. Máximo {MAX_SIZE_MB} MB.
        </p>
        <input
          ref={inputFileRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          onChange={handleFileChange}
          className="hidden"
          id="comprobante-upload"
          disabled={enviando}
        />
        {!imagenPreview ? (
          <label
            htmlFor="comprobante-upload"
            className="flex min-h-[180px] w-full cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-steel-gray/25 bg-blue-mist/40 px-6 text-center transition-colors hover:border-steel-gray/45 hover:bg-blue-mist"
          >
            {imagenLoading ? (
              <>
                <div
                  className="h-10 w-10 rounded-full border-2 border-steel-gray/15 border-t-steel-gray animate-spin"
                  aria-hidden
                />
                <span className="mt-2 text-sm text-secondary-text">Cargando imagen…</span>
              </>
            ) : (
              <>
                <svg className="mb-2 h-10 w-10 text-steel-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium text-primary-text">Haz clic para subir tu comprobante</span>
              </>
            )}
          </label>
        ) : (
          <div className="relative overflow-hidden rounded-[24px] border border-primary-text/10 shadow-sm">
            <img
              src={imagenPreview}
              alt="Vista previa del comprobante"
              className="max-h-64 w-full object-contain bg-light-ash/50"
            />
            <button
              type="button"
              onClick={quitarImagen}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-charcoal-ink/88 text-soft-white transition-colors hover:bg-soft-black"
              aria-label="Quitar imagen"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        {imagenError && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {imagenError}
          </p>
        )}
      </div>

      {errorValidacion && (
        <p className="text-sm text-red-600" role="alert">
          {errorValidacion}
        </p>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className={`
          w-full rounded-2xl py-4 text-base font-semibold transition-all duration-300
          flex items-center justify-center gap-2
          ${canSubmit
            ? 'bg-signal-orange text-soft-white shadow-[0_16px_28px_rgba(255,122,26,0.25)] hover:bg-[#ef6d12] hover:shadow-[0_20px_34px_rgba(255,122,26,0.32)]'
            : 'bg-disabled text-muted-text cursor-not-allowed'
          }
          ${enviando ? 'opacity-70 cursor-wait' : ''}
        `}
      >
        {enviando ? (
          <>
            <div
              className="w-5 h-5 rounded-full border-2 border-soft-white/30 border-t-soft-white animate-spin"
              aria-hidden
            />
            Enviando…
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Enviar comprobante de pago
          </>
        )}
      </button>
    </form>
  )
}
