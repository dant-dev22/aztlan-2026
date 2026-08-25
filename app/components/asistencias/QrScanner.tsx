'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'

interface QrScannerProps {
  enabled: boolean
  onDetected: (value: string) => void
}

type ScannerStatus = 'idle' | 'starting' | 'ready' | 'error'

export default function QrScanner({ enabled, onDetected }: QrScannerProps) {
  const [status, setStatus] = useState<ScannerStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const scannerRef = useRef<{ stop: () => Promise<void>; clear: () => void | Promise<void> } | null>(null)
  const isHandlingResultRef = useRef(false)
  const rawRegionId = useId()
  const regionId = useMemo(() => `attendance-qr-${rawRegionId.replace(/:/g, '')}`, [rawRegionId])

  useEffect(() => {
    async function cleanupScanner() {
      const scanner = scannerRef.current
      scannerRef.current = null
      if (!scanner) return
      try {
        await scanner.stop()
      } catch {
        // Ignorar: stop puede fallar si el scanner no alcanzó a iniciar.
      }
      try {
        await scanner.clear()
      } catch {
        // Ignorar: clear puede fallar si el contenedor ya fue desmontado.
      }
    }

    if (!enabled) {
      setStatus('idle')
      setError(null)
      isHandlingResultRef.current = false
      void cleanupScanner()
      return
    }

    let cancelled = false

    async function startScanner() {
      setStatus('starting')
      setError(null)
      isHandlingResultRef.current = false

      try {
        const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import('html5-qrcode')
        if (cancelled) return

        const scanner = new Html5Qrcode(regionId, {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          verbose: false,
        })

        scannerRef.current = scanner

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1,
          },
          (decodedText) => {
            if (isHandlingResultRef.current) return
            isHandlingResultRef.current = true
            onDetected(decodedText)
          },
          () => undefined
        )

        if (!cancelled) {
          setStatus('ready')
        }
      } catch (scannerError) {
        if (cancelled) return
        setStatus('error')
        setError(scannerError instanceof Error ? scannerError.message : 'No fue posible iniciar la camara.')
      }
    }

    void startScanner()

    return () => {
      cancelled = true
      void cleanupScanner()
    }
  }, [enabled, onDetected, regionId])

  return (
    <div className="surface-panel-dark overflow-hidden p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="section-kicker border-white/10 bg-white/10 text-blue-mist">Escaner QR</p>
          <h3 className="mt-3 text-xl font-black tracking-tight text-soft-white">Apunta la camara al codigo del alumno</h3>
          <p className="mt-2 text-sm text-white/70">
            El registro se envia en cuanto el QR coincide con el Aztlan ID capturado.
          </p>
        </div>
        <span
          className={`status-badge ${
            status === 'ready'
              ? 'bg-emerald-500/15 text-emerald-200'
              : status === 'error'
                ? 'bg-red-500/15 text-red-200'
                : 'bg-white/10 text-white/75'
          }`}
        >
          {status === 'ready' ? 'Listo' : status === 'error' ? 'Error' : status === 'starting' ? 'Iniciando' : 'En espera'}
        </span>
      </div>

      <div className="mt-5 overflow-hidden rounded-[24px] border border-white/10 bg-soft-black/80">
        <div id={regionId} className="min-h-[320px] w-full" />
      </div>

      {status === 'starting' && (
        <div className="mt-4 flex items-center gap-3 text-sm text-white/80">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" aria-hidden />
          <span>Preparando camara y permisos...</span>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error ?? 'No fue posible iniciar el escaner.'}
        </div>
      )}

      {status === 'ready' && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75">
          Mantén el codigo dentro del recuadro durante unos segundos.
        </div>
      )}
    </div>
  )
}
