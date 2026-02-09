'use client'

import { useState, useRef, useEffect } from 'react'
import { postComprobante, type ComprobantePayload } from '@/app/lib/api'

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
          className="w-12 h-12 rounded-full border-4 border-charcoal-ink/20 border-t-charcoal-ink animate-spin"
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
        className="flex flex-col items-center justify-center py-12 px-6 text-center animate-fade-in"
        role="status"
        aria-live="polite"
      >
        <div className="w-16 h-16 rounded-full bg-success-green flex items-center justify-center mb-4">
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
          className="px-6 py-2 rounded-xl bg-charcoal-ink text-soft-white hover:bg-graphite transition-colors"
        >
          Cerrar
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-primary-text flex items-center gap-2">
        <svg className="w-6 h-6 text-charcoal-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Terminar registro
      </h2>

      <div>
        <label htmlFor="aztlan-id" className="block text-sm font-medium text-primary-text mb-2">
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
          className="w-full px-4 py-3 rounded-xl border-2 border-primary-text/20 bg-soft-white text-primary-text placeholder-secondary-text/60 focus:border-charcoal-ink focus:outline-none focus:ring-2 focus:ring-charcoal-ink/20 transition-colors"
          autoComplete="off"
          disabled={enviando}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-primary-text mb-2">
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
            className="flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed border-steel-gray/50 rounded-xl cursor-pointer hover:border-charcoal-ink/40 hover:bg-light-ash/30 transition-colors"
          >
            {imagenLoading ? (
              <>
                <div
                  className="w-10 h-10 rounded-full border-2 border-charcoal-ink/20 border-t-charcoal-ink animate-spin"
                  aria-hidden
                />
                <span className="mt-2 text-sm text-secondary-text">Cargando imagen…</span>
              </>
            ) : (
              <>
                <svg className="w-10 h-10 text-muted-text mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-secondary-text">Haz clic para subir tu comprobante</span>
              </>
            )}
          </label>
        ) : (
          <div className="relative rounded-xl overflow-hidden border-2 border-primary-text/10">
            <img
              src={imagenPreview}
              alt="Vista previa del comprobante"
              className="w-full max-h-64 object-contain bg-light-ash/50"
            />
            <button
              type="button"
              onClick={quitarImagen}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-charcoal-ink/80 text-soft-white flex items-center justify-center hover:bg-charcoal-ink transition-colors"
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
          w-full py-4 rounded-xl font-semibold text-base transition-all duration-300
          flex items-center justify-center gap-2
          ${canSubmit
            ? 'bg-success-green text-soft-white hover:bg-success-green-hover shadow-md hover:shadow-lg'
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
