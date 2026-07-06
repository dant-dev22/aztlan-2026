'use client'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  /** Oculta el botón X cuando el contenido maneja su propio cierre (ej. éxito) */
  showCloseButton?: boolean
}

export default function Modal({
  isOpen,
  onClose,
  children,
  showCloseButton = true,
}: ModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-soft-black/78 backdrop-blur-md animate-fade-in" aria-hidden />
      <div
        className="surface-panel relative max-h-[90vh] w-full max-w-3xl overflow-y-auto border border-white/30 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-primary-text/10 bg-warm-white text-primary-text shadow-lg transition duration-300 hover:border-signal-orange/30 hover:bg-signal-orange-soft hover:text-signal-orange"
            aria-label="Cerrar"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        <div className="p-6 sm:p-8 lg:p-10">{children}</div>
      </div>
    </div>
  )
}
