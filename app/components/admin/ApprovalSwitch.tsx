'use client'

import { useState } from 'react'
import ConfirmModal from './ConfirmModal'

interface ApprovalSwitchProps {
  isApproved: boolean
  onToggle: () => void
  participantName: string
}

export default function ApprovalSwitch({ isApproved, onToggle, participantName }: ApprovalSwitchProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSwitchClick = () => {
    if (!isApproved) {
      setShowConfirm(true)
    }
  }

  const handleConfirm = () => {
    onToggle()
    setShowConfirm(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={handleSwitchClick}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-charcoal-ink focus:ring-offset-2
          ${isApproved ? 'bg-success-green' : 'bg-disabled'}
        `}
        role="switch"
        aria-checked={isApproved}
        aria-label={`${isApproved ? 'Aprobado' : 'No aprobado'} - ${participantName}`}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-soft-white transition-transform
            ${isApproved ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        title="Confirmar aprobación"
        message={`¿Está seguro de aprobar este comprobante?`}
        confirmText="Sí, aprobar"
        cancelText="Cancelar"
      />
    </>
  )
}
