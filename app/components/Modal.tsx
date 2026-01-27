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
      <div className="absolute inset-0 bg-charcoal-ink/80 backdrop-blur-sm animate-fade-in" aria-hidden />
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-soft-white rounded-2xl shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-charcoal-ink text-soft-white hover:bg-graphite transition-colors duration-300 shadow-lg"
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
